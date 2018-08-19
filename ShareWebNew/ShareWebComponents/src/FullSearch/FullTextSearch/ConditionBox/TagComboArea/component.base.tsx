import * as React from 'react';
import { uniq, filter, isEqual } from 'lodash';
import WebComponent from '../../../../webcomponent';
import { tagSuggest } from '../../../../../core/apis/efshttp/search/search';

// 无法使用FlexTextBox，因为FlexTextBox组件返回的是上一次输入的值，无法根据当前输入值去请求建议标签
// 如：当前输入框为‘asd’，当用户继续输入‘f’字符时，返回的是‘asd’字符
export default class TagComboAreaBase extends WebComponent<Components.FullTextSearch.TagComboArea.Props, Components.FullTextSearch.TagComboArea.State> {
    static defaultProps = {
        searchTags: []
    }

    state = {
        /**
         * 外部文档标签块
         */
        tagKeys: this.props.searchTags,

        /**
         * 输入框文档标签块
         */
        tagInputKeys: [],

        /**
         * 是否选择添加文档标签块输入框
         */
        isTagInput: false,

        /**
         * 输入框聚焦状态
         */
        tagInputFocus: false,

        /**
         * 下拉菜单锚点
         */
        tagInputAnchor: null,

        /**
         * 通过接口获取到的建议标签列表
         */
        tagSuggestions: null,

        /**
         * 输入框的值
         */
        tagInputValue: '',

        /**
         * 是否显示建议标签列表
         */
        isTagSuggestionShow: false,

        /**
         * 边框警告
         */
        tagInputWarning: false,

    }

    // 延迟触发标签搜索的定时器
    tagSearchTimeout: number | null = null;

    // 最多可以允许的标签数量
    maxTagsCount = 30;

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.searchTags, nextProps.searchTags)) {
            this.setState({
                tagKeys: nextProps.searchTags
            })
        }

    }

    /**
     * 重置方法
     */
    resetState() {
        this.setState({
            /**
             * 外部文档标签块
             */
            tagKeys: [],

            /**
             * 输入框文档标签块
             */
            tagInputKeys: [],

            /**
             * 是否选择添加文档标签块输入框
             */
            isTagInput: false,

            /**
             * 输入框聚焦状态
             */
            tagInputFocus: false,

            /**
             * 下拉菜单锚点
             */
            tagInputAnchor: null,

            /**
             * 通过接口获取到的建议标签列表
             */
            tagSuggestions: null,

            /**
             * 输入框的值
             */
            tagInputValue: '',

            /**
             * 是否显示建议标签列表
             */
            isTagSuggestionShow: false,
        })
    }

    /**
     * 删除外部标签块
     */
    protected handleDeleteTag(key) {
        let { tagKeys } = this.state;
        this.setState({
            tagKeys: filter(tagKeys, o => o !== key)
        }, () => {
            this.props.onChange(this.state.tagKeys);
        });
    }

    /**
     * 点击显示标签输入框
     */
    protected handleClickTagAddBtn() {
        this.setState({
            isTagInput: true,
            tagInputValue: '',
            tagInputAnchor: null,
            tagSuggestions: null
        }, () => {
            this.refs.tagInput.focus();
            this.props.onTagInputStatusChange(this.state.isTagInput);
        });
    }

    /**
     * 标签输入框聚焦
     */
    protected handleTagInputFocus(e) {
        this.setState({
            tagInputAnchor: e.currentTarget,
            isTagSuggestionShow: true,
            tagInputFocus: true,
            tagInputWarning: false
        })
    }

    /**
     * 标签输入框失焦
     */
    protected handleTagInputBlur(e) {
        this.setState({
            tagInputFocus: false
        })
    }

    /**
     * 删除输入框内部标签块
     */
    protected handleDeleteTagInputKeys(key) {
        this.setState({
            tagInputKeys: filter(this.state.tagInputKeys, o => o !== key)
        });
    }

    /**
     * 输入框变化事件
     */
    protected handleTagInputChange(value) {
        // 延迟搜索定时器
        if (this.tagSearchTimeout) {
            clearTimeout(this.tagSearchTimeout);
        }

        let tag = value;

        if (tag.length > 19) {
            return;
        }

        this.setState({
            tagInputValue: tag,
        }, async () => {

            if (tag) {
                // 延迟搜索定时器
                this.tagSearchTimeout = setTimeout(async () => {
                    let { suggestions } = await tagSuggest({ prefix: tag.replace(/^[\s\n\t]+/g, ''), count: 10 });
                    this.setState({
                        tagSuggestions: suggestions
                    })
                }, 300);

            } else {
                this.setState({
                    tagSuggestions: null
                })
            }

        })

    }

    /**
     * 输入框按键事件
     */
    protected handleTagInputKeyDown(e) {
        let tag = e.target.value;

        if (e.keyCode === 8 && !tag) { // 若输入按键为Backspace，删除最近添加的标签块
            let { tagInputKeys } = this.state;
            this.setState({
                tagInputKeys: tagInputKeys.slice(0, tagInputKeys.length - 1)
            })
        }
    }

    /**
     * 将输入框内部标签组转换为外部标签组
     */
    protected handleConfirmAddTag() {
        // 将标签输入框的值，分割数组，去除无效值，
        let { tagKeys, tagInputKeys } = this.state;
        tagKeys = uniq(tagKeys.concat(tagInputKeys))

        this.setState({
            tagKeys,
            tagSuggestions: null,
            isTagInput: false,
            tagInputKeys: [],
            isTagSuggestionShow: false
        }, () => {
            // 向父组件传递真实文档标签参数
            this.props.onChange(this.state.tagKeys);
            this.props.onTagInputStatusChange(this.state.isTagInput);
        });
    }

    /**
     * 取消将输入框内部标签组转换为外部标签组
     */
    protected handleCancelAddTag() {
        this.setState({
            tagSuggestions: null,
            isTagInput: false,
            tagInputKeys: [],
            isTagSuggestionShow: false
        }, () => {
            this.props.onTagInputStatusChange(this.state.isTagInput);
        });
    }

    /**
     * 点击隐藏标签建议下拉菜单
     */
    protected handleHideTagSuggestionMenu() {
        this.setState({
            isTagSuggestionShow: false
        })
    }

    /**
     * 选择某个建议标签项，加入输入框内部标签块组内
     */
    protected handleClickTagSuggestionMenu(singleSuggestion) {

        // 如果外部标签组 + 内部标签组的数量达到上限，则不能进行添加
        this.setState({
            tagInputKeys: this.state.tagKeys.length + this.state.tagInputKeys.length >= this.maxTagsCount ? this.state.tagInputKeys : uniq(this.state.tagInputKeys.concat(singleSuggestion)),
            isTagSuggestionShow: false,
            tagSuggestions: null,
            tagInputValue: ''
        }, () => {
            this.refs.tagInput.focus();
        })
    }

    /**
     * 红色边框警告
     */
    protected showWarningBorder() {
        this.setState({
            tagInputWarning: true
        })
    }
}