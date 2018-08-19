import * as React from 'react'
import { noop, filter } from 'lodash'
import __ from './locale'

let index = 0;
export default class ComboSearchBoxBase extends React.Component<UI.ComboSearchBox.Props, UI.ComboSearchBox.State> {
    static defaultProps = {
        keys: [],
        placeholder: __('搜索'),
        onComboChange: noop,
        renderOption: noop,
        renderComboItem: noop,
    }

    state = {
        value: '',
        searchAnchor: null,
        searchValue: [],
        isSearchFocus: false,
        isSearchMenu: false,
    }

    timeout = null;

    /**
     * 当接收到的searchValue发生改变的时，更新显示
     */
    componentWillReceiveProps({ searchValue, searchKey }) {
        if (searchValue !== this.state.searchValue) {
            this.setState({
                searchValue
            })
        }
        if (searchKey !== this.state.value) {
            this.setState({
                value: searchKey
            })
        }
    }
    /**
     * 搜素框获得焦点时触发,获取聚焦元素并设置聚焦状态为true
     */
    protected handleSearchBoxFocus(e) {
        this.setState({
            searchAnchor: e.currentTarget,
            isSearchMenu: true,
            isSearchFocus: true,
        })
    }

    /**
     * 搜索框失去焦点时触发，聚焦状态设置为false
     */
    protected handleSearchBoxBlur() {
        // 如果当面面板是打开状态
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            if (this.state.value) {
                this.setState({
                    isSearchFocus: false,
                    isSearchMenu: false
                })
            } else {
                this.setState({
                    isSearchFocus: false
                })
            }

        }, 200)
    }

    /**
     * 点击删除每一项搜索关键字时触发
     * @param {any} key 删除项的信息 
     */
    protected handleItemDelete(e, key) {
        // 筛选出非删除项
        const newValue = filter([...this.state.searchValue], (item) => {
            return item['index'] !== key['index']
        })

        this.setState({
            searchValue: newValue
        }, () => {
            this.props.onComboChange(this.state.searchValue, this.state.value)
        })
    }

    /**
     * 监听搜索框变化
     */
    protected handleSearchInputChange(value) {
        this.setState({
            value
        })
    }

    /**
     * 当输入框中有键按下时
     */
    protected handleInputKeyDown(e) {
        const { keys } = this.props
        const { value, searchValue } = this.state
        //当按下删除键，搜索框的值（value）为空，且searchValue的长度不为0，从后向前依次删除生成的每一项搜索关键字
        if (e.keyCode === 8 && !value && searchValue.length !== 0) {
            this.setState({
                searchValue: searchValue.slice(0, searchValue.length - 1)
            }, () => {
                this.props.onComboChange(this.state.searchValue, this.state.value)
            });
        }

        //当按下enter键且value值不为空时
        if (e.keyCode === 13 && value) {
            const newValue = keys && keys.length !== 0
                ?
                {
                    index: index++,
                    key: keys[0],
                    value: value
                }
                :
                {
                    index: index++,
                    value: value
                }
            this.setState({
                searchValue: [...searchValue, newValue],
                value: ''
            }, () => {
                this.refs.searchInput.focus()
                this.props.onComboChange(this.state.searchValue, this.state.value)
            })
        }
    }

    /**
     * 清空全部搜索关键词
     */
    protected handleTotalDelete() {
        this.setState({
            value: '',
            searchValue: [],
        }, () => {
            this.props.onComboChange(this.state.searchValue, this.state.value)
        })
    }

    /**
     * 选择下拉框中相应的搜索条件时触发
     * @param key 
     * @param value 
     */
    protected handleSearchItemClick(key, value) {
        const newValue = {
            index: index++,
            key: key,
            value: value
        }
        this.setState({
            searchValue: [...this.state.searchValue, newValue],
            value: ''
        }, () => {
            this.refs.searchInput.focus()
            this.props.onComboChange(this.state.searchValue, this.state.value)
        })
    }
}