import * as React from 'react';
import { noop, trim, uniq } from 'lodash';
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { check } from '../../core/apis/eachttp/perm/perm';
import { tagSuggest } from '../../core/apis/efshttp/search/search'
import { addTag, deleteTag } from '../../core/apis/efshttp/file/file'
import { attribute } from '../../core/apis/efshttp/file/file';
import { getConfig } from '../../core/config/config';
import { ReqStatus } from '../../core/tag/tag'

export default class TagEditorBase extends React.Component<Components.TagEditor.Props, any> {
    static defaultProps = {
        onCloseDialog: noop,

        onUpdateTags: noop
    }

    state: Components.TagEditor.State = {
        results: [],

        value: '',

        tags: [],

        duplicateTag: false,

        reqStatus: ReqStatus.Pending
    }

    maxTags: number;   // 允许设置的最大标签数

    timer: number;    // 定时器

    doc: Core.Docs.Doc = this.props.doc

    componentDidMount() {
        this.checkPermission()
    }

    /**
     * 检查是否具有修改权限
     */
    private async checkPermission() {

        try {
            const [{ result }, maxTags] = await Promise.all([
                check({ docid: this.doc.docid, perm: 16 }),
                getConfig('tag_max_num')
            ])

            if (result === 0) {
                // 有修改权限
                this.maxTags = maxTags
                const { tags } = await attribute({ docid: this.doc.docid })

                this.setState({
                    reqStatus: ReqStatus.OK,
                    tags
                })
            } else {
                // 无修改权限
                this.setState({
                    reqStatus: ErrorCode.PermissionRestricted
                })
            }
        }
        catch (err) {
            this.setState({
                reqStatus: err.errcode
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
                errCode: 0
            })
        } else {
            this.setState({
                results: []
            });
        }
    }

    /** 
     * 选中下拉框内容
     * @param data选中的数据
     */
    protected handleClick(data: string): void {
        this.setState({
            results: [],
            value: data
        });
    }

    /**
     * 点击“添加”按钮，添加标签
     */
    protected async addTag(e: KeyboardEvent | MouseEvent, selectIndex: number): void {
        if (selectIndex >= 0) {
            this.handleClick(this.state.results[selectIndex])
        } else {
            const tag = trim(this.state.value)

            if (tag) {
                const tags = uniq([...this.state.tags, tag])
                this.setState({
                    errCode: 0
                })

                // 判断标签个数是否超过限制，如果超过限制，出现提示信息
                if (tags.length > this.maxTags) {
                    // 添加的标签数超过限制
                    this.setState({
                        errCode: ErrorCode.TagsNumExceeded
                    })
                } else {
                    if (!this.state.tags.some((value) => value === tag)) {
                        // 标签未添加过
                        try {
                            await addTag({ docid: this.doc.docid, tag })

                            this.setState({
                                tags,
                                results: []
                            }, () => {
                                this.props.onUpdateTags(tags, this.doc)
                            })
                        }
                        catch ({ errcode }) {
                            this.setState({
                                errCode: errcode
                            })
                        }
                    } else {
                        // 标签已添加过
                        this.setState({
                            results: [],
                            duplicateTag: true
                        })

                        if (!this.timer) {
                            this.timer = setTimeout(() => {
                                this.setState({
                                    duplicateTag: false
                                })
                                this.timer = 0
                            }, 2000)
                        }
                    }
                }
            }
        }
    }

    /**
     * 移除标签
     */
    protected async removeTag(value: string): void {
        this.setState({
            errCode: 0
        })

        try {
            await deleteTag({ docid: this.doc.docid, tag: value })

            const tags = this.state.tags.filter((tag) => tag !== value)

            this.setState({
                tags
            }, () => {
                this.props.onUpdateTags(tags, this.doc)
            })
        }
        catch ({ errcode }) {
            this.setState({
                errCode: errcode
            })
        }
    }

    /**
     * 更新输入框的内容
     */
    protected updateValue(value: string): void {
        this.setState({
            errCode: 0,
            value
        })
    }
}