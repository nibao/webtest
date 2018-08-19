import * as React from 'react';
import { last, uniq, filter, noop, trim } from 'lodash';
import { tagSuggest } from '../../core/apis/efshttp/search/search'
import { testIllegalCharacter, ErrorCode } from '../../core/tag/tag';
import __ from './locale'

export default class TagAdderConfigBase extends React.Component<Components.TagAdderConfig.Props, any> {
    static defaultProps = {
        maxTags: null,
        height: 108,
        onWarning: noop,
        width: 350,
        onUpdateTags: noop,
    }

    stillActive: boolean;

    state: Components.TagAdderConfig.State = {
        tags: [],
        results: null,
        inputValue: '',
        width: 10,
        labelValue: ''
    }

    componentDidMount() {
        // 默认input聚焦
        this.refs.input.focus()
    }

    /**
     * 新增一个标签
     */
    addTag(tag: string): void {
        if (tag) {
            const tags = uniq([...this.state.tags, tag])
            if (tags.length > this.props.maxTags) {
                this.props.onWarning(ErrorCode.TAGS_REACH_UPPER_LIMIT)
            } else {
                this.setState({
                    tags
                }, () => this.props.onUpdateTags(tags))
            }
        }

    }

    /**
     * 删除一个标签
     */
    removeTag(tag: string): void {
        this.setState({
            tags: filter(this.state.tags, o => o !== tag)
        }, () => {
            this.props.onWarning(0)
            this.props.onUpdateTags(this.state.tags)
        });
    }


    /**
     * 按下键盘
     */
    keyDownHandler(e) {
        const input = this.refs.input.value;

        // 按下enter键，增加Chip
        if (e.keyCode === 13) {
            this.addTag(trim(input));
            this.setState({
                inputValue: '',
                results: null,
                width: 10
            })

            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        }
        // 按下backspace, 删除输入或Chip 
        else if (e.keyCode === 8) {
            if (!input) {
                if (this.state.tags.length) {
                    this.removeTag(last(this.state.tags));
                }
            }
        }
    }

    /**
     * 更新input的值
     */
    updateValue(value: string): void {
        this.updateInputValue(value);

        const trimValue = trim(value)

        if (trimValue) {
            tagSuggest({ prefix: trimValue }).then(({ suggestions }) => {
                this.setState({
                    results: suggestions
                })
            })
        } else {
            this.setState({
                results: null
            })
        }
    }

    updateInputValue(value: string): void {
        this.setState({
            inputValue: value,
            labelValue: value
        }, () => {
            this.setState({
                width: this.refs.label.offsetWidth ? (this.refs.label.offsetWidth + 20) : 20,
                labelValue: ''
            })
        })
    }

    /**
     * 选择搜索下拉结果
     */
    select(value: string): void {
        this.updateInputValue(value)
        this.setState({
            results: null
        })
        this.stillActive = true;
    }

    changeHandler(e) {
        const value = this.refs.input.value

        if (value.length < 20) {
            if (testIllegalCharacter(value)) {
                this.props.onWarning(ErrorCode.ILLEGAL_CHARACTER)
                this.setState({
                    results: null
                })
            } else {
                // 允许输入小于20位、不含特殊字符
                this.props.onWarning(0)
                this.updateValue(value);
            }
        }
    }

    clickHandler(e) {
        const value = this.refs.input.value;
        const trimValue = trim(value)

        if (trimValue) {
            tagSuggest({ prefix: trimValue }).then(({ suggestions }) => {
                this.setState({
                    inputValue: value,
                    results: suggestions
                })
            })
        }
    }

    blurHandler(e) {
        this.setState({
            results: null
        })
        if (this.stillActive) {
            this.stillActive = false;
            this.refs.input.focus()
        }
    }
}