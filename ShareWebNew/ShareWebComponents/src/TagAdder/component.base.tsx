import * as React from 'react';
import { noop, uniq, trim } from 'lodash'
import { getConfig } from '../../core/config/config';
import { testIllegalCharacter, ReqStatus, ErrorCode } from '../../core/tag/tag'
import { tagSuggest } from '../../core/apis/efshttp/search/search'
import { docname } from '../../core/docs/docs'
import { addTags } from '../../core/apis/efshttp/file/file'
import { Exception, Strategy, IconType } from '../ExceptionStrategy/component.base';
import __ from './locale';

export default class TagAdderBase extends React.Component<Components.TagAdder.Props, Components.TagAdder.State> {

    static defaultProps = {
        docs: [],

        onCloseDialog: noop
    }

    state = {
        tags: [],

        results: [],

        value: '',

        showBorder: false,

        warningCode: 0,

        showSuccessMessage: false,

        showSuccessMessageClient: false,

        exception: 0,

        /**
         * 初始所有的异常的状态都是QUERY
         */
        strategies: {
            [Exception.MISSING_SOURCE]: Strategy.QUERY,
            [Exception.NO_PERMISSION_SOURCE]: Strategy.QUERY,
            [Exception.TAGS_REACH_UPPER_LIMIT]: Strategy.QUERY,
            [Exception.LACK_OF_CSF]: Strategy.QUERY
        },

        processingDoc: null,

        reqStatus: 0
    }

    handlers = {}

    maxTags: number = 30;   // 允许设置的最大标签数

    resolve = noop

    docs: Core.Docs.Docs = this.props.docs;   // 批量添加标签：点击“添加”按钮，经检查 存在且有权限的文件

    successDocs: Core.Docs.Docs = [];   // 批量添加标签：添加成功的文件

    async componentWillMount() {
        this.maxTags = await getConfig('tag_max_num')

        this.setState({
            reqStatus: ReqStatus.Pending
        })
    }

    /**
     * 更新标签
     */
    protected updateTags(tags: Array<string>): void {
        this.setState({
            tags
        })
    }

    protected handleWarning(warningCode: number) {
        if (this.state.warningCode !== warningCode) {
            this.setState({
                warningCode
            })
        }
    }



    /**
     * 搜索函数
     * @param key 搜索关键字
     */
    protected loader(key: string) {
        if (key) {
            return tagSuggest({ prefix: key })
        }
        else {
            return Promise.resolve();
        }
    }

    /**
     * 数据加载完成触发
     * @param result 搜索结果
     */
    protected handleLoad(result: any): void {
        if (result && result.suggestions && result.suggestions.length) {
            // 搜索结果不为空数组， 显示
            this.setState({
                results: result.suggestions,
            })
        } else {
            this.setState({
                results: [],
            });
            this.refs.autocomplete.toggleActive(false);
        }
    }

    /** 
     * 选中下拉框内容
     * @param data选中的数据
     */
    protected handleClick(data: string): void {
        this.refs.autocomplete.toggleActive(false);
        this.setState({
            results: [],
            value: data
        });
    }

    /**
     * 滚动到最下面
     */
    private scrollBottom() {
        this.refs.tags.scrollTop = this.refs.tags.scrollHeight - this.refs.tags.clientHeight
    }

    /**
     * 点击“添加”按钮，添加一个标签
     */
    protected addOneTagChip(e, selectIndex: number): void {
        if (selectIndex >= 0) {
            this.handleClick(this.state.results[selectIndex])
        } else {
            const tag = trim(this.state.value)
            const tags = uniq([...this.state.tags, tag])

            this.setState({
                warningCode: null
            })

            this.refs.autocomplete.toggleActive(false);

            // 判断标签个数是否超过限制，如果超过限制，出现提示信息
            if (tags.length > this.maxTags) {
                // 添加的标签数超过限制
                this.setState({
                    warningCode: ErrorCode.TAGS_REACH_UPPER_LIMIT
                })
            } else {
                // 清空输入框的值
                this.refs.autocomplete.clearInput()

                if (!this.state.tags.some((value) => value === tag)) {
                    // 标签未添加过
                    this.setState({
                        tags,
                        results: []
                    }, () => {
                        this.showTagBorder()
                        this.scrollBottom()
                    })
                } else {
                    // 标签已添加过
                    this.setState({
                        results: []
                    })
                }
            }
        }
    }

    /**
     * 移除标签
     */
    protected removeTag(value: string): void {
        const tags = this.state.tags.filter((tag) => tag !== value)

        this.setState({
            tags,
            warningCode: null
        }, () => {
            this.showTagBorder()
        })

    }

    /**
     * 更新输入框的内容
     */
    protected updateValue(value: string): void {
        this.setState({
            value: value,
            warningCode: null
        })
    }

    // 输入小于20位，且不含非法字符
    protected validator(value): boolean {
        if (value.length < 20) {
            if (testIllegalCharacter(trim(value))) {

                this.setState({
                    warningCode: ErrorCode.ILLEGAL_CHARACTER,
                    results: []
                })
                this.refs.autocomplete.toggleActive(false);

                return false
            }

            return true
        }

        return false
    }

    /**
     * 显示标签边框
     */
    private showTagBorder() {
        this.setState({
            showBorder: this.refs.tags.scrollHeight > this.refs.tags.offsetHeight
        })
    }

    /**
     * 点击“确定”按钮，添加标签
     * 多个文件操作：批量添加标签
     * @param tags 要添加的标签
     * @param maxTags 允许添加的最大标签数
     */
    protected addTags(): void {
        this.setState({
            reqStatus: ReqStatus.OK
        })

        const { tags } = this.state;

        this.successDocs = [];
        this.setState({
            showAdderDialog: false
        })
        this.docs.reduce((prev, doc) => {
            return prev.then(() => this.addTagsForOneFile(tags, doc, this.maxTags))
        }, Promise.resolve())
            .then(() => {
                if (this.successDocs && this.successDocs.length) {
                    this.setState({
                        showSuccessMessage: true,
                        showSuccessMessageClient: true
                    })

                    setTimeout(() => {
                        this.setState({
                            showSuccessMessage: false
                        })

                        this.props.onCloseDialog()
                    }, 2000)
                } else {
                    this.props.onCloseDialog()
                }
            })
    }

    /**
     * 多个文件操作：单个文件添加多个标签
     * @param tags 要添加的标签
     * @param maxTags 允许添加的最大标签数
     */
    private addTagsForOneFile(tags: Array<any>, doc: Core.Docs.Doc, maxTags: number) {
        return new Promise((resolve, reject) => addTags({ docid: doc.docid, tags }).then(({ unsettagnum, unsettags }) => {
            if (!unsettagnum) {
                // 添加成功
                this.successDocs = [...this.successDocs, doc]
                resolve()
            } else {
                // 标签超出范围
                this.handleException(this.state.strategies, Exception.TAGS_REACH_UPPER_LIMIT, { ...doc, maxTags, unsettagnum }, resolve)

            }
        }, err => {
            switch (err.errcode) {
                case ErrorCode.FileNotExist: {
                    // 文件不存在
                    this.handleException(this.state.strategies, Exception.MISSING_SOURCE, doc, resolve)
                    break;
                }
                case ErrorCode.NO_EDIT_PERMISSION: {
                    // 没有修改权限
                    this.handleException(this.state.strategies, Exception.NO_PERMISSION_SOURCE, doc, resolve)
                    break;
                }
                case ErrorCode.LACK_OF_CSF: {
                    // 密级不足
                    this.handleException(this.state.strategies, Exception.LACK_OF_CSF, doc, resolve)
                    break;
                }
                default: {
                    resolve()
                }
            }
        }))
    }

    private handleException(strategies: any, exception: Exception, doc: Core.Docs.Doc, resolve: any) {
        if (strategies[exception] === Strategy.QUERY) {
            // 如果是查询状态
            this.handlers = this.formatterHandlers(doc)

            this.setState({
                processingDoc: doc,
                exception,
            })

            this.resolve = resolve
        } else {
            resolve()
        }
    }


    /**
     * 获取handlers 
     */
    private formatterHandlers(item: Core.Docs.Doc) {
        return {
            // 文件不存在
            [Exception.MISSING_SOURCE]: {
                [Strategy.QUERY]: {
                    warningContent: __('文件“${docname}”已不存在，系统将自动跳过，继续对其他文件进行标签设置。', { docname: docname(item) }),
                    warningFooter: __('跳过之后所有的相同冲突提示'),
                    iconType: IconType.Message
                }
            },
            // 没有修改权限
            [Exception.NO_PERMISSION_SOURCE]: {
                [Strategy.QUERY]: {
                    warningContent: __('您对文件“${docname}”没有修改权限，系统将自动跳过，继续对其他文件进行标签设置。', { docname: docname(item) }),
                    warningFooter: __('跳过之后所有的相同冲突提示'),
                    iconType: IconType.Message
                }
            },
            // 标签个数达到上限
            [Exception.TAGS_REACH_UPPER_LIMIT]: {
                [Strategy.QUERY]: {
                    warningContent: __('文件“${docname}”的标签个数已达上限(${number}个)，剩余标签(${remainTagsNum}个)不再继续添加，系统将跳过该文件对其他文件进行标签设置。', { docname: docname(item), number: item.maxTags, remainTagsNum: item.unsettagnum }),
                    warningFooter: __('跳过之后所有的相同冲突提示'),
                    iconType: IconType.Message
                }
            },
            // 密级不足
            [Exception.LACK_OF_CSF]: {
                [Strategy.QUERY]: {
                    warningContent: __('您对文件“${docname}”的密级不足，系统将自动跳过，继续对其他文件进行标签设置。', { docname: docname(item) }),
                    warningFooter: __('跳过之后所有的相同冲突提示'),
                    iconType: IconType.Message
                },
            }
        }
    }

    /**
     * 多个文件操作：更新strategies
     */
    protected updateStrategies(strategies): void {
        this.setState({
            strategies,
            exception: null
        })
        this.resolve()
    }
}