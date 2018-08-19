import * as React from 'react';
import * as _ from 'lodash';
import WebComponent from '../../../webcomponent';

export default class SearchBoxBase extends WebComponent<Components.FullSearch.FullTextSearch.SearchBox.Props, Components.FullSearch.FullTextSearch.SearchBox.State> {


    state = {

        /**
         * 搜索历史菜单锚点
         */
        searchHistoryAnchor: null,

        /**
         * 是否显示搜索历史
         */
        enbaleSearchHistory: false,

        /**
         * 搜索历史数组
         */
        searchHistory: null,

        /**
         * 搜索关键字
         */
        keys: this.props.keys,

        /**
         * 搜索框聚焦状态
         */
        searchInputFoucsStatus: false,

    }

    /**
     * 延迟触发关键词搜索历史的定时器
     */
    keySearchTimeout: number | null = null;

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.keys, nextProps.keys)) {
            this.setState({
                keys: nextProps.keys
            })
        }

    }

    /**
     * 聚焦搜索框
     */
    protected handleSearchFocus(e) {
        this.props.onWarningChange()
        let value = this.state.keys;

        let searchHistory = !value.trim() ? this.getLatestSearchInputHistory(value) : []

        this.setState({
            searchHistory: searchHistory,
            searchHistoryAnchor: e.currentTarget,
            searchInputFoucsStatus: true
        })

    }

    /**
     * 失焦搜索框
     */
    protected handleSearchBlur(e) {
        this.setState({
            searchInputFoucsStatus: false
        })
    }

    /**
     * 匹配关键词历史中搜索时间权重最大的关键词 
     * @value: 关键词
     * @limit: 最大数量
     */
    protected getLatestSearchInputHistory(value, limit = 5) {

        // value = value.trim();

        // // 将之前存储的搜索历史JSON字符串先转成JSON对象再进行操作
        // let history = JSON.parse(localStorage.getItem('searchHistory'));
        // history = history ? history : {};

        // /** 
        //  *  如果关键词存在，则获取指定关键词的搜索历史
        //  *  如果关键词不存在，则根据搜索时间权重获取权重最高（即最近）的搜索历史关键词
        //  *  遍历对象，找到所有匹配关键词的键-值对
        //  */
        // let historyKeys = value ? Object.keys(history).filter((key) => key.includes(value)) : Object.keys(history);

        // // 根据值（搜索时间权重），找出最近的搜索关键词历史
        // historyKeys.sort((a, b) => { return history[a] < history[b] ? 1 : -1 })

        // // 截取前5个搜索关键词历史
        // return historyKeys.slice(0, limit);

        // let fakeHistoryKeys = ['搜索历史纪录', '是不可能', '存在的', 'tan90']
        let fakeHistoryKeys = [];
        return fakeHistoryKeys;
    }

    /**
     * 搜索框清空按钮
     */
    protected handleEmptySearchValue(e) {
        this.setState({
            keys: '',
            searchHistory: null
        }, () => {
            this.props.change('')
        })
    }

    /**
     * 监听搜索框键盘响应，回车触发搜索
     */
    protected handleSearchEnter(e) {
        this.props.search({ start: 0, keys: this.state.keys })
    }

    /**
     * 监听搜索框变化
     */
    protected handleSearchInputChange(value) {
        this.props.change(value)
    }

    /**
     * 搜索历史函数
     */
    protected handleLoadSearchHistory(value) {
        // 获取最后一个以空格分割的字符串
        let valueArr = value.split(' ');
        let lastString = valueArr[valueArr.length - 1];

        // TODO: 根据搜索词，获取匹配关键词
        // let searchHistory = this.getLatestSearchInputHistory(lastString);

        // this.setState({
        //     searchHistory: searchHistory
        // })
    }

    /**
     * 点击隐藏搜索历史菜单
     */
    protected handleHideSearchHistoryMenu(e) {
        this.setState({
            searchHistory: null
        })
    }

    /**
     * 点击选中某项搜索历史
     */
    protected handleClickSearchHistoryMenu(singleSearchHistory, e) {
        let value = this.state.keys.split(' ');
        let lastString = value[value.length - 1];

        /**
         * 最后一项是空格，则追加搜索历史
         * 最后一项是字符串，则替换搜索历史
         */
        let newInputValue = lastString === '' ?
            value.join(' ') + singleSearchHistory
            :
            (
                value[value.length - 1] = singleSearchHistory,
                value.join(' ')
            )

        this.setState({
            searchHistory: null,
            keys: newInputValue
        }, () => {
            this.refs.searchInput.focus();
        })
    }

    /**
     * 点击搜索按钮
     */
    protected async handleClickSearchBtn() {
        this.props.search({ start: 0, keys: this.state.keys });
    }

    /**
     * 点击重置按钮
     */
    protected handleClickResetBtn() {
        this.props.reset();
    }

    /**
     * 验证函数
     */
    protected handleValidator(value) {
        return value.replace(/\s/g, '').length < 101;

    }


}