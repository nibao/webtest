import * as React from 'react'
import { trim, noop } from 'lodash'
import { testIllegalCharacter, ErrorCode } from '../../../core/tag/tag'


export default class ConfigBase extends React.Component<TagEditor.Config.ViewProps, any> {
    static defaultProps = {
        value: '',

        results: [],

        errCode: 0,

        tags: [],

        maxTags: 30,

        loader: noop,

        onLoad: noop,

        onUpdateValue: noop,

        onSelect: noop,

        onEnter: noop,

        onAddTag: noop,

        onRemoveTag: noop
    }

    state = {
        showBorder: false,

        tags: this.props.tags,

        errCode: 0
    }

    doc: Core.Docs.Doc = this.props.doc

    autocomplete: HTMLInputElement;

    tagsArea: HTMLInputElement;

    componentDidMount() {
        this.showTagBorder()
    }

    componentWillReceiveProps({ tags, errCode, results }) {
        if (this.props.tags.length !== tags.length) {
            // 判断是否新增了标签
            const addtag = tags.length > this.props.tags.length

            this.setState({
                tags
            }, () => {
                this.showTagBorder()

                // 如果新增了标签，滚动到底部
                if (addtag) {
                    this.scrollBottom()
                }
            })
        }

        if (errCode && errCode !== this.state.errCode) {
            this.setState({
                errCode
            })
        }

        if (!results || !results.length) {
            this.toggleAutocompleteActive(false)
        }
    }

    /**
     * 显示标签边框
     */
    protected showTagBorder() {
        this.setState({
            showBorder: this.tagsArea.scrollHeight > this.tagsArea.offsetHeight
        })
    }

    /**
     * 滚动到最下面
     */
    private scrollBottom() {
        this.tagsArea.scrollTop = this.tagsArea.scrollHeight - this.tagsArea.clientHeight
    }

    /**
     * 切换aucocomplete隐藏or显示
     */
    protected toggleAutocompleteActive(flag: boolean) {
        this.autocomplete.toggleActive(flag)
    }

    // 输入小于20位，且不含非法字符
    protected validator(value: string): boolean {
        if (value.length < 20) {
            if (testIllegalCharacter(trim(value))) {
                this.setState({
                    errCode: ErrorCode.ILLEGAL_CHARACTER
                })
                this.toggleAutocompleteActive(false)
                return false
            }

            return true
        }

        return false
    }

    /**
     * 清空输入框的值
     */
    protected clearInput() {
        this.autocomplete.clearInput()
    }
}