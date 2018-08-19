import * as React from 'react';
import { noop } from 'lodash';
import * as fs from '../../core/filesystem/filesystem'
import { copy as copyFile, getSuggestName, metaData } from '../../core/apis/efshttp/file/file';
import { copy as copyDir, getSuggestName as getDirSuggestName, attribute } from '../../core/apis/efshttp/dir/dir';
import { docname, isDir } from '../../core/docs/docs';
import { getErrorMessage } from '../../core/errcode/errcode'
import { calcGNSLevel, ViewDocType } from '../../core/entrydoc/entrydoc';
import { Exception, Strategy, IconType } from '../ExceptionStrategy/component.base';
import WebComponent from '../webcomponent';
import __ from './locale';

enum ErrorCode {
    MISSING_SOURCE = 404006,             // 源文件不存在
    NO_PERMISSION_SOURCE = 403002,       // 源文件没有复制权限
    MISSING_DESTINATION = 404013,        // 目标文件夹不存在
    NO_PERMISSION_DESTINATION = 403056,  // 没有权限操作目标位置的对象
    NO_SPACE_DESTINATION = 403001,       // 目标位置配额空间不足
    SAME_TYPE_SAME_NAME = 403039,        // 存在同类型的同名文件名
    DIFFER_TYPE_SAME_NAME = 403041,      // 存在不同类型的同名文件夹
    COPY_TO_SELF = 403054,               // 复制到自身或其的子文件夹
    SAME_NAME_NO_PERMISSION = 403040,    // 对同名文件没有修改权限
    LOCKED = 403031,                     // 文件已被锁定
    LACK_OF_CSF = 403065,                // 密级权限不足
    COPY_TO_WATERMARK_LIBRARY = 403168,  // 无法将文件/文件夹复制到水印文档库
    USER_FREEZED = 403171,               // 用户已被冻结 
    DOC_FREEZED = 403172,                 // 文档已被冻结
}

enum Ondup {
    QUERY = 1,   // 询问
    RENAME,      // 重命名
    OVERWRITE,   // 覆盖
}

export default class CopyBase extends WebComponent<Components.Copy.Props, Components.Copy.State> {
    static defaultProps = {
        docs: null,
        sort: {
            by: 'name',

            sort: 'asc',
        },
        selectRange: [ViewDocType.UserDoc, ViewDocType.GroupDoc, ViewDocType.ShareGroup, ViewDocType.ShareDoc, ViewDocType.CustomDoc, ViewDocType.ArchiveDoc],
        onSuccess: noop,
        onCancel: noop,
        onSingleCopyComplete: noop,
    }

    state = {
        selection: null,
        showCopyToDialog: true,
        exception: null,
        processingDoc: null,
        showLoading: false,
    }

    resolve = noop

    handlers = null

    ondup: Ondup = null

    interrupt: boolean;     // 是否中断整个批量复制

    strategies = null

    result = {
        success: []
    }

    /**
     * 开始复制
     */
    confirm() {
        this.setState({
            showLoading: true,
            showCopyToDialog: false,
        })

        const { selection } = this.state;
        const docs = this.props.docs;

        // 初始所有的异常的状态都是QUERY
        this.strategies = {
            [Exception.NAME_DUPLICATION_SAME_TYPE]: Strategy.QUERY,
            [Exception.MISSING_SOURCE]: Strategy.QUERY,
            [Exception.NO_PERMISSION_SOURCE]: Strategy.QUERY,
            [Exception.MISSING_DESTINATION]: Strategy.QUERY,
            [Exception.NO_PERMISSION_DESTINATION]: Strategy.QUERY,
            [Exception.NO_SPACE_DESTINATION]: Strategy.QUERY,
            [Exception.NAME_DUPLICATION_DIFF_TYPE]: Strategy.QUERY,
            [Exception.SAME_NAME_NO_PERMISSION]: Strategy.QUERY,
            [Exception.LOCKED]: Strategy.QUERY,
            [Exception.LACK_OF_CSF]: Strategy.QUERY,
            [Exception.COPY_OR_MOVE_TO_SELF]: Strategy.QUERY,
            [Exception.COPY_TO_WATERMARK_LIBRARY]: Strategy.QUERY,
            [Exception.USER_FREEZED]: Strategy.QUERY,
            [Exception.DOC_FREEZED]: Strategy.QUERY,
        }

        this.handlers = this.formatterHandlers(docs.length !== 1)

        docs.reduce((prev, doc) => {
            return prev.then(() => {
                if (this.interrupt) {
                    return Promise.resolve()
                }

                return new Promise((resolve) => {
                    this.copyFile(doc, this.state.selection, this.strategies, { resolve })
                })
            })
        }, Promise.resolve())
            .then(() => {
                this.setState({
                    showLoading: false
                })
                this.props.onSuccess(this.result, this.state.selection)
            })
    }

    copyFile(doc: Core.Docs.Doc, selection: Core.Docs.Doc, strategies: any, { ondup, resolve }: { ondup?: Ondup, resolve?: any }) {
        let sameDirRename: boolean;
        if (!ondup) {
            if (doc.docid.indexOf(selection.docid) !== -1 && (calcGNSLevel(doc.docid) - calcGNSLevel(selection.docid) === 1)) {
                // 目标位置与起始位置相同, 自动重命名
                sameDirRename = true;
                this.ondup = Ondup.RENAME
            } else if (strategies[Exception.NAME_DUPLICATION_DIFF_TYPE] === Strategy.RENAME || strategies[Exception.SAME_NAME_NO_PERMISSION] === Strategy.RENAME) {
                this.ondup = Ondup.RENAME
            } else {
                this.ondup = (strategies[Exception.NAME_DUPLICATION_SAME_TYPE] === Strategy.SKIP
                    ? Ondup.QUERY
                    : this.strategies[Exception.NAME_DUPLICATION_SAME_TYPE])
            }
        } else {
            this.ondup = ondup
        }

        return (isDir(doc)
            ? copyDir({ docid: doc.docid, destparent: selection.docid, ondup: this.ondup })
            : copyFile({ docid: doc.docid, destparent: selection.docid, ondup: this.ondup }))
            .then(docInfo => {
                this.result = { ...this.result, success: [...this.result.success, doc] }

                const newDoc = {
                    ...doc,
                    ...docInfo
                }
                // 在fs中加入newDoc
                fs.insert(newDoc)
                this.props.onSingleCopyComplete(newDoc)
                if (resolve) {
                    resolve()
                }
            }, err => {
                switch (err.errcode) {
                    // 文件不存在 
                    case ErrorCode.MISSING_SOURCE: {
                        this.handleException(strategies, Exception.MISSING_SOURCE, selection, doc, { resolve })
                        break;
                    }
                    // 对源文件没有复制权限
                    case ErrorCode.NO_PERMISSION_SOURCE: {
                        this.handleException(strategies, Exception.NO_PERMISSION_SOURCE, selection, doc, { resolve })
                        break;
                    }
                    // 目标文件夹不存在,中断整个复制
                    case ErrorCode.MISSING_DESTINATION: {
                        this.interrupt = true
                        this.handleException(strategies, Exception.MISSING_DESTINATION, selection, doc, { resolve })
                        break;
                    }
                    // 目标文件夹没有新建权限,中断整个复制
                    case ErrorCode.NO_PERMISSION_DESTINATION: {
                        this.interrupt = true
                        this.handleException(strategies, Exception.NO_PERMISSION_DESTINATION, selection, { ...doc, destination: selection }, { resolve })
                        break;
                    }
                    // 目标位置配额空间不足,中断整个复制
                    case ErrorCode.NO_SPACE_DESTINATION: {
                        this.interrupt = true
                        this.handleException(strategies, Exception.NO_SPACE_DESTINATION, selection, doc, { resolve })
                        break;
                    }
                    // 存在同类型的同名文件名 
                    case ErrorCode.SAME_TYPE_SAME_NAME: {
                        this.handleException(strategies, Exception.NAME_DUPLICATION_SAME_TYPE, selection, doc, { resolve, name_Duplication: true })
                        break;
                    }
                    // 存在不同类型的同名文件名
                    case ErrorCode.DIFFER_TYPE_SAME_NAME: {
                        this.handleException(strategies, Exception.NAME_DUPLICATION_DIFF_TYPE, selection, doc, { resolve, name_Duplication: true })
                        break;
                    }
                    // 复制到自身或其的子文件夹,中断整个操作
                    case ErrorCode.COPY_TO_SELF: {
                        this.interrupt = true
                        this.handleException(strategies, Exception.COPY_OR_MOVE_TO_SELF, selection, { ...doc, destination: selection }, { resolve })
                        break;
                    }
                    // 对同名文件没有修改权限
                    case ErrorCode.SAME_NAME_NO_PERMISSION: {
                        this.handleException(strategies, Exception.SAME_NAME_NO_PERMISSION, selection, doc, { resolve, name_Duplication: true })
                        break;
                    }
                    // 目标文件夹的同名文件被锁定
                    case ErrorCode.LOCKED: {
                        this.handleException(strategies, Exception.LOCKED, selection, { ...doc, locker: /is locked by ([^\/\\:*?\"<>|]+)[(（)]/.exec(err.causemsg)[1].replace(/\s/g, '') }, { resolve })
                        break;
                    }
                    // (1)对同名文件密级不足, 无法覆盖 (2)复制文件夹，对该文件夹下的有些文件密级不足，无法复制
                    case ErrorCode.LACK_OF_CSF: {
                        this.handleException(strategies, Exception.LACK_OF_CSF, selection, doc, { resolve })
                        break;
                    }
                    // 无法将文件复制到水印文档库
                    case ErrorCode.COPY_TO_WATERMARK_LIBRARY: {
                        this.handleException(strategies, Exception.COPY_TO_WATERMARK_LIBRARY, selection, doc, { resolve })
                        break;
                    }
                    // 用户被冻结,中断整个复制
                    case ErrorCode.USER_FREEZED: {
                        this.interrupt = true
                        this.handleException(strategies, Exception.USER_FREEZED, selection, doc, { resolve })
                        break;
                    }

                    // 文档被冻结,中断整个复制
                    case ErrorCode.DOC_FREEZED: {
                        this.interrupt = true
                        this.handleException(strategies, Exception.DOC_FREEZED, selection, doc, { resolve })
                        break;
                    }

                    default: {
                        if (resolve) {
                            resolve()
                        }
                    }

                }
            })
    }

    handleException(strategies, exception: Exception, selection: Core.Docs.Doc, doc: Core.Docs.Doc, { resolve, name_Duplication }: { resolve?: any, name_Duplication?: boolean } = null): void {
        if (strategies[exception] === Strategy.QUERY) {
            if (name_Duplication) {
                (isDir(doc)
                    ? getDirSuggestName({ docid: selection.docid, name: docname(doc) })
                    : getSuggestName({ docid: selection.docid, name: docname(doc) }))
                    .then(({ name }) => {
                        this.setState({
                            processingDoc: { ...doc, suggestName: name },
                            exception
                        })
                    })
            } else {
                this.setState({
                    processingDoc: doc,
                    exception
                })
            }
            if (resolve) {
                this.resolve = resolve;
            }
        } else {
            if (resolve) {
                resolve()
            }
        }
    }

    /**
     * 获取handlers 
     */
    formatterHandlers(multiCopy: boolean) {
        return {
            // 文件不存在
            [Exception.MISSING_SOURCE]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: isDir(item)
                        ? __('文件夹“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(item) })
                        : __('文件“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('跳过之后所有相同的冲突提示') : null,
                    iconType: IconType.Message
                })
            },
            // 对文件没有复制权限
            [Exception.NO_PERMISSION_SOURCE]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: isDir(item)
                        ? __('您对文件夹“${docname}”没有复制权限。', { docname: docname(item) })
                        : __('您对文件“${docname}”没有复制权限。', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('跳过之后所有相同的冲突提示') : null,
                    iconType: IconType.Message
                })
            },
            // 目标文件夹不存在
            [Exception.MISSING_DESTINATION]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: __('您选择的目标文件夹不存在，可能其所在路径发生变更。'),
                    iconType: IconType.Message
                })
            },
            // 目标文件夹没有新建权限
            [Exception.NO_PERMISSION_DESTINATION]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: __('您对选择的目标文件夹“${folderName}”没有新建权限。', { folderName: docname(item.destination) }),
                    iconType: IconType.Message
                })
            },
            // 目标位置配额空间不足
            [Exception.NO_SPACE_DESTINATION]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: __('您选择的目标位置配额空间不足。'),
                    iconType: IconType.Message
                })
            },
            // 目标位置已存在同类型的同名文档
            [Exception.NAME_DUPLICATION_SAME_TYPE]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('目标位置已存在同名文档'),
                    warningContent: isDir(item)
                        ? __('您可以将当前文件夹“${docname}”做如下处理：', { docname: docname(item) })
                        : __('您可以将当前文件“${docname}”做如下处理：', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('为之后所有相同的冲突执行此操作') : null,
                    name: Exception.NAME_DUPLICATION_SAME_TYPE,
                    showCancelBtn: true,
                    options: [{
                        value: Strategy.RENAME,
                        display: isDir(item)
                            ? __('复制并保留，当前文件夹重命名为“${newname}”', { newname: item.suggestName })
                            : __('复制并保留，当前文件重命名为“${newname}”', { newname: item.suggestName })
                    }, {
                        value: Strategy.OVERWRITE,
                        display: isDir(item)
                            ? __('复制并合并，将当前文件夹与同名文件夹合并')
                            : __('复制并替换，将当前文件覆盖同名文件')
                    }, {
                        value: Strategy.SKIP,
                        display: __('不要复制，跳过当前操作')
                    }],
                    selected: Strategy.RENAME
                }),
                // 再一次发送复制文件的请求，ondup = 重命名
                [Strategy.RENAME]: (item) => ({
                    implement: (strategies) =>
                        this.copyFile(item, this.state.selection, strategies, { ondup: Ondup.RENAME, resolve: this.resolve })
                }),
                // 再一次发送复制文件的请求，ondup = 覆盖
                [Strategy.OVERWRITE]: (item) => ({
                    implement: (strategies) =>
                        this.copyFile(item, this.state.selection, strategies, { ondup: Ondup.OVERWRITE, resolve: this.resolve })
                }),
                // 跳过这个文件
                [Strategy.SKIP]: (item) => ({
                    implement: () => Promise.resolve().then(() => this.resolve())
                })
            },
            // 目标位置存在不同类型的同名文档
            [Exception.NAME_DUPLICATION_DIFF_TYPE]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: isDir(item)
                        ? __('目标位置已存在与当前文件夹同名的文件')
                        : __('目标位置已存在与当前文件同名的文件夹'),
                    warningContent: isDir(item)
                        ? __('您可以将当前文件夹“${docname}”做如下处理：', { docname: docname(item) })
                        : __('您可以将当前文件“${docname}”做如下处理：', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('为之后所有相同的冲突执行此操作') : null,
                    showCancelBtn: true,
                    name: Exception.NAME_DUPLICATION_SAME_TYPE,
                    options: [{
                        value: Strategy.RENAME,
                        display: isDir(item)
                            ? __('复制并保留，当前文件夹重命名为“${newname}”', { newname: item.suggestName })
                            : __('复制并保留，当前文件重命名为“${newname}”', { newname: item.suggestName })
                    }, {
                        value: Strategy.SKIP,
                        display: __('不要复制，跳过当前操作')
                    }],
                    selected: Strategy.RENAME
                }),
                // 再一次发送复制文件的请求，ondup = 重命名
                [Strategy.RENAME]: (item) => ({
                    implement: (strategies) =>
                        this.copyFile(item, this.state.selection, strategies, { ondup: Ondup.RENAME, resolve: this.resolve })
                }),
                // 跳过这个文件
                [Strategy.SKIP]: (item) => ({
                    implement: () => Promise.resolve().then(() => this.resolve())
                })
            },
            // 对同名文件没有修改权限
            [Exception.SAME_NAME_NO_PERMISSION]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('目标位置已存在同名文档，但您对其没有修改权限'),
                    warningContent: isDir(item)
                        ? __('您可以将当前文件夹“${docname}”做如下处理：', { docname: docname(item) })
                        : __('您可以将当前文件“${docname}”做如下处理：', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('为之后所有相同的冲突执行此操作') : null,
                    showCancelBtn: true,
                    name: Exception.NAME_DUPLICATION_SAME_TYPE,
                    options: [{
                        value: Strategy.RENAME,
                        display: isDir(item)
                            ? __('复制并保留，当前文件夹重命名为“${newname}”', { newname: item.suggestName })
                            : __('复制并保留，当前文件重命名为“${newname}”', { newname: item.suggestName })
                    }, {
                        value: Strategy.SKIP,
                        display: __('不要复制，跳过当前操作')
                    }],
                    selected: Strategy.RENAME
                }),
                // 再一次发送复制文件的请求，ondup = 重命名
                [Strategy.RENAME]: (item) => ({
                    implement: (strategies) =>
                        this.copyFile(item, this.state.selection, strategies, { ondup: Ondup.RENAME, resolve: this.resolve })

                }),
                // 跳过这个文件
                [Strategy.SKIP]: (item) => ({
                    implement: () => Promise.resolve().then(() => this.resolve())
                })
            },
            // 复制到自身或其的子文件夹
            [Exception.COPY_OR_MOVE_TO_SELF]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: __('您选择的目标文件夹“${target}”是当前文件夹“${docname}”自身或其子文件夹。', { target: docname(item.destination), docname: docname(item) }),
                    iconType: IconType.Message
                })
            },
            // 文件已被锁定, 无法覆盖
            [Exception.LOCKED]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行覆盖操作'),
                    warningContent: __('文件“${docname}”已被“${locker}”锁定。', { docname: docname(item), locker: item.locker }),
                    warningFooter: multiCopy ? __('跳过之后所有相同的冲突提示') : null,
                    iconType: IconType.Message
                })
            },
            // (1)对同名文件密级不足, 无法覆盖 (2)复制文件夹，对该文件夹下的有些文件密级不足，无法复制
            [Exception.LACK_OF_CSF]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: this.ondup === Ondup.OVERWRITE ? __('无法执行覆盖操作') : __('无法执行复制操作'),
                    warningContent: isDir(item)
                        ? __('您对文件夹“${docname}”下某些子文件的密级权限不足。', { docname: docname(item) })
                        : __('您对同名文件“${docname}”的密级权限不足。', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('跳过之后所有相同的冲突提示') : null,
                    iconType: IconType.Message
                })
            },
            // 无法将文件/文件夹复制到水印文档库
            [Exception.COPY_TO_WATERMARK_LIBRARY]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: __('您对水印目录下的文件“${docname}”没有修改权限，无法将水印文件复制到水印目录范围外。', { docname: docname(item) }),
                    warningFooter: multiCopy ? __('跳过之后所有相同的冲突提示') : null,
                    iconType: IconType.Message
                })
            },
            [Exception.USER_FREEZED]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: getErrorMessage(403171),
                    iconType: IconType.Message
                })
            },
            [Exception.DOC_FREEZED]: {
                [Strategy.QUERY]: (item) => ({
                    warningHeader: __('无法执行复制操作'),
                    warningContent: getErrorMessage(403172),
                    iconType: IconType.Message
                })
            }
        }
    }

    /**
     * 在错误弹框中点击“确定”
     */
    handleExceptionConfirm(strategies, reAct: boolean): void {
        this.setState({
            exception: null,
        })
        this.strategies = strategies;
        if (!reAct) {
            this.resolve()
        }

    }

    cancelAllCopies() {
        this.interrupt = true;
        this.setState({
            exception: null
        })
        this.resolve()
    }
}