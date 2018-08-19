import * as React from 'react'
import { noop, trim } from 'lodash'
import { check } from '../../core/apis/eachttp/perm/perm'
import { docname } from '../../core/docs/docs'
import { create, getSuggestName } from '../../core/apis/efshttp/dir/dir'
import { Exception, Strategy, IconType } from '../ExceptionStrategy/component.base'
import WebComponent from '../webcomponent';
import __ from './locale';

interface Props {
    doc: Core.Docs.Doc;
    onSuccess: (dir?: Core.Docs.Doc) => void;
    onCancel: () => void;
}

interface State {
    showCreateFolder: boolean;   // 是否显示“新建文件夹”对话框
    value: string;               // 输入框的值
    invalidMsg: string;          // 输入不合法的提示信息
    exception: number;
    processingDoc: any;
    errCode: number;             // 输入不合法的错误
}

export enum ErrorCode {
    NO_CREATE_PERMISSION = 403002,         // 没有新建权限
    FILE_NOT_EXITST = 404006,              // 文件不存在
    NAME_DUPLICATION_SAME_TYPE = 403039,   // 相同类型的同名冲突
    NAME_DUPLICATION_DIFF_TYPE = 403041,   // 不同类型的同名冲突
    SAME_NAME_NO_PERMISSION = 403040,      // 没有修改权限的同名冲突
    NO_SPACE_DESTINATION = 403001,         // 配额空间不足
    USER_FREEZED = 403171,                 // 用户已被冻结 
    DOC_FREEZED = 403172,                  // 文档已被冻结
    NameInvalid = 1,                       // 文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符
    NameEndWithDot = 2,                    // 文件夹名称以.结尾
}

enum Ondup {
    QUERY = 1,   // 询问
    RENAME,      // 重命名
    OVERWRITE,   // 覆盖
}

export default class CreateFolderBase extends WebComponent<any, any> {

    static defaultProps: Props = {
        doc: null,
        onSuccess: noop,
        onCancel: noop,
    }

    state: State = {
        showCreateFolder: false,
        value: '',
        invalidMsg: '',
        exception: null,
        processingDoc: null,
        errCode: 0
    }

    handlers = {
        // 文件夹不存在
        [Exception.MISSING_SOURCE]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('无法执行新建操作'),
                warningContent: __('文件夹“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(item) }),
                iconType: IconType.Message
            })
        },
        // 没有新建权限
        [Exception.NO_PERMISSION_SOURCE]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('无法执行新建操作'),
                warningContent: __('您对文件夹“${docname}”没有新建权限。', { docname: docname(item) }),
                iconType: IconType.Message
            })
        },
        // 目标位置已存在同类型的同名文档
        [Exception.NAME_DUPLICATION_SAME_TYPE]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('在云端已存在同名文件夹。'),
                warningContent: __('您可以将当前文件夹“${docname}”做如下处理：', { docname: docname(item) }),
                name: Exception.NAME_DUPLICATION_SAME_TYPE,
                options: [{
                    value: Strategy.RENAME,
                    display: __('同时保留两个文档，当前文件夹重命名为“${suggestName}”', { suggestName: item.suggestName })
                }, {
                    value: Strategy.OVERWRITE,
                    display: __('使用当前文件夹合并已存在的同名文件夹')
                }, {
                    value: Strategy.SKIP,
                    display: __('取消当前文件夹的新建')
                }],
                selected: Strategy.RENAME
            }),
            // 再一次发送新建文件夹的请求，ondup = 重命名
            [Strategy.RENAME]: (item) => ({
                implement: (strategies) =>
                    this.createFolder(item.suggestName, Ondup.RENAME)
            }),
            // 再一次发送新建文件夹的请求，ondup = 合并
            [Strategy.OVERWRITE]: (item) => ({
                implement: (strategies) =>
                    this.createFolder(docname(item), Ondup.OVERWRITE)
            }),
            // 取消当前文件夹的新建
            [Strategy.SKIP]: (item) => ({
                implement: () => this.props.onSuccess()
            })
        },
        // 目标位置已存在不同类型的同名文档
        [Exception.NAME_DUPLICATION_DIFF_TYPE]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('云端已存在与当前文件夹同名的文件。'),
                warningContent: __('您可以将当前文件夹“${docname}”做如下处理：', { docname: docname(item) }),
                name: Exception.NAME_DUPLICATION_DIFF_TYPE,
                options: [{
                    value: Strategy.RENAME,
                    display: __('同时保留两个文档，当前文件夹重命名为“${suggestName}”', { suggestName: item.suggestName })
                }, {
                    value: Strategy.SKIP,
                    display: __('取消当前文件夹的新建')
                }],
                selected: Strategy.RENAME
            }),
            // 再一次发送新建文件夹的请求，ondup = 重命名
            [Strategy.RENAME]: (item) => ({
                implement: (strategies) =>
                    this.createFolder(item.suggestName, Ondup.RENAME)
            }),
            // 取消当前文件夹的新建
            [Strategy.SKIP]: (item) => ({
                implement: () => this.props.onSuccess()
            })
        },
        // 目标位置已存在没有修改权限的同类型同名文档
        [Exception.SAME_NAME_NO_PERMISSION]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('在云端已存在同名文件夹，并且您没有修改权限。'),
                warningContent: __('您可以将当前文件夹“${docname}”做如下处理：', { docname: docname(item) }),
                name: Exception.SAME_NAME_NO_PERMISSION,
                options: [{
                    value: Strategy.RENAME,
                    display: __('同时保留两个文档，当前文件夹重命名为“${suggestName}”', { suggestName: item.suggestName })
                }, {
                    value: Strategy.SKIP,
                    display: __('取消当前文件夹的新建')
                }],
                selected: Strategy.RENAME
            }),
            // 再一次发送新建文件夹的请求，ondup = 重命名
            [Strategy.RENAME]: (item) => ({
                implement: (strategies) =>
                    this.createFolder(item.suggestName, Ondup.RENAME)
            }),
            // 取消当前文件夹的新建
            [Strategy.SKIP]: (item) => ({
                implement: () => this.props.onSuccess()
            })
        },
        // 配额空间不足
        [Exception.NO_SPACE_DESTINATION]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('无法执行新建操作'),
                warningContent: __('空间配额不足。'),
                iconType: IconType.Message
            })
        },
        // 用户被冻结
        [Exception.USER_FREEZED]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('无法执行新建操作'),
                warningContent: __('您的账号已被冻结'),
                iconType: IconType.Message
            })
        },
        // 用户被冻结
        [Exception.DOC_FREEZED]: {
            [Strategy.QUERY]: (item) => ({
                warningHeader: __('无法执行新建操作'),
                warningContent: __('该文档已被冻结'),
                iconType: IconType.Message
            })
        }
    }

    strategies = {
        [Exception.NAME_DUPLICATION_SAME_TYPE]: Strategy.QUERY,
        [Exception.NAME_DUPLICATION_DIFF_TYPE]: Strategy.QUERY,
        [Exception.SAME_NAME_NO_PERMISSION]: Strategy.QUERY,
        [Exception.MISSING_SOURCE]: Strategy.QUERY,
        [Exception.NO_PERMISSION_SOURCE]: Strategy.QUERY,
        [Exception.NO_SPACE_DESTINATION]: Strategy.QUERY,
        [Exception.USER_FREEZED]: Strategy.QUERY,
        [Exception.DOC_FREEZED]: Strategy.QUERY
    }

    componentDidMount() {
        check({ docid: this.props.doc.docid, perm: 8 }).then(({ result }) => {
            if (result === 0) {
                // 有新建权限
                this.setState({
                    showCreateFolder: true
                })
            } else {
                // 没有新建权限
                this.setState({
                    showCreateFolder: false,
                    exception: Exception.NO_PERMISSION_SOURCE,
                    processingDoc: this.props.doc
                })
            }
        }, err => {
            if (err.errcode === ErrorCode.FILE_NOT_EXITST) {
                // 文件夹不存在
                this.setState({
                    showCreateFolder: false,
                    exception: Exception.MISSING_SOURCE,
                    processingDoc: this.props.doc
                })
            }
        })
    }

    /**
     * 更新输入框
     */
    updateValue(value: string): void {
        this.setState({
            value: value,
            errCode: 0
        })
    }

    /**
     * 点击“新建文件夹”弹框的确定按钮
     */
    confirm() {
        const value = trim(this.state.value)

        if (value) {
            const errCode = this.checkName(value)

            this.setState({
                errCode
            })

            if (!errCode) {
                this.createFolder(trim(this.state.value), Ondup.QUERY)
            }
        }
    }

    /**
     * 新建文件夹
     * @param name 文件夹的名称
     * @param ondup：查询、重命名、覆盖
     */
    createFolder(name: string, ondup: number) {
        create({ docid: this.props.doc.docid, name, ondup }).then((attrs) => {
            if (ondup !== Ondup.OVERWRITE) {
                // 将新建的文件夹的信息传出去
                this.props.onSuccess({ size: -1, name, ...attrs })
            } else {
                this.props.onSuccess()
            }
        }, err => {
            this.setState({
                showCreateFolder: false
            })
            switch (err.errcode) {
                case ErrorCode.NAME_DUPLICATION_SAME_TYPE: {
                    // 相同类型的同名文件夹
                    getSuggestName({ docid: this.props.doc.docid, name: name }).then(({ name: suggestName }) => {
                        this.setState({
                            exception: Exception.NAME_DUPLICATION_SAME_TYPE,
                            processingDoc: { name, suggestName }
                        })
                    })
                    break
                }
                case ErrorCode.NAME_DUPLICATION_DIFF_TYPE: {
                    // 不同类型的同名文件夹
                    getSuggestName({ docid: this.props.doc.docid, name: name }).then(({ name: suggestName }) => {
                        this.setState({
                            exception: Exception.NAME_DUPLICATION_DIFF_TYPE,
                            processingDoc: { name, suggestName }
                        })
                    })
                    break
                }
                case ErrorCode.SAME_NAME_NO_PERMISSION: {
                    // 对同类型的同名文件夹没有修改权限
                    getSuggestName({ docid: this.props.doc.docid, name: name }).then(({ name: suggestName }) => {
                        this.setState({
                            exception: Exception.SAME_NAME_NO_PERMISSION,
                            processingDoc: { name, suggestName }
                        })
                    })
                    break
                }
                case ErrorCode.FILE_NOT_EXITST: {
                    // 文件夹不存在
                    this.setState({
                        exception: Exception.MISSING_SOURCE,
                        processingDoc: this.props.doc
                    })
                    break;
                }
                case ErrorCode.NO_CREATE_PERMISSION: {
                    // 没有新建权限
                    this.setState({
                        exception: Exception.NO_PERMISSION_SOURCE,
                        processingDoc: this.props.doc
                    })
                    break
                }
                case ErrorCode.NO_SPACE_DESTINATION: {
                    // 配额空间不足
                    this.setState({
                        exception: Exception.NO_SPACE_DESTINATION,
                        processingDoc: this.props.doc
                    })
                    break
                }
                case ErrorCode.USER_FREEZED: {
                    // 用户被冻结
                    this.setState({
                        exception: Exception.USER_FREEZED,
                        processingDoc: this.props.doc
                    })
                    break;
                }
                case ErrorCode.DOC_FREEZED: {
                    // 文档被冻结
                    this.setState({
                        exception: Exception.DOC_FREEZED,
                        processingDoc: this.props.doc
                    })
                    break;
                }
                default: {
                    this.props.onSuccess()
                }
            }
        })
    }

    /**
     * 点击错误弹框的确定按钮
     */
    handleConfirmError(strategies: any, reAct: boolean) {
        if (reAct) {
            this.setState({
                exception: null
            })
        } else {
            this.props.onSuccess()
        }
    }

    /**
     * 检测输入字符是否合法
     * @param name 
     * @returns 返回错误码
     */
    private checkName(name: string): number {
        // 文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。
        if (!(/^[^\\/:*?"<>|]{0,244}$/.test(name))) {
            return ErrorCode.NameInvalid
        }

        // 文件名以.结尾
        if (/\.$/.test(name)) {
            return ErrorCode.NameEndWithDot
        }

        return 0
    }
}