import * as React from 'react';
import { find } from 'lodash';
import WebComponent from '../../../webcomponent';
import { getConfig } from '../../../../core/config/config';
import { copy } from '../../../../util/clipboard/clipboard';
import { download } from '../../../../core/download/download'
import { splitGNS } from '../../../../core/entrydoc/entrydoc';
import __ from './locale';
import { ShareType } from '../helper';


export default class ResultBoxBase extends WebComponent<Components.FullSearch.FullTextSearch.ResultBox.Props, Components.FullSearch.FullTextSearch.ResultBox.State> {
    static defaultProps = {
        isLoading: false
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
         * 搜索结果选中项
         */
        resultSelection: [],

        /**
         * 排序选中项
         * {
         *      name: 'xxx'
         *      value: 'size' | '-size' ...
         * }
         */
        sortSelection: { name: __('按匹配度排序'), value: '' },

        /**
         * 搜索结果收藏对象
         */
        resultCollections: {},

        /**
         * 鼠标是否移入排序按钮
         */
        isMouseEnterSortBtn: false
    }

    componentWillMount() {
        (async () => {
            // 获取配置
            this.configs = await getConfig();


        })();

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.resultCollections !== nextProps.resultCollections) {
            this.setState({
                resultCollections: nextProps.resultCollections
            })
        }

    }

    configs = {};

    /**
     * 点击收藏按钮
     */
    protected handleClickCollectButton(e, doc) {
        this.props.onClickCollect(doc);
    }


    /**
     * 点击选中搜索结果按钮
     */
    protected handleSelectResult(selections) {
        this.setState({
            resultSelection: selections
        })
    }

    /**
     * 点击内链分享按钮
     */
    protected handleClickShareButton(e, doc) {
        e.stopPropagation();

        this.setState({
            resultSelection: [doc]
        }, () => {
            this.props.onShareDocChange(ShareType.SHARE, doc)
        })
    }

    /**
    * 点击外链按钮
    */
    protected handleClickLinkButton(e, doc) {
        e.stopPropagation();

        this.setState({
            resultSelection: [doc]
        }, () => {
            this.props.onShareDocChange(ShareType.LINKSHARE, doc)
        })
    }

    /**
    * 点击下载按钮
    */
    protected handleClickDownloadButton(e, doc) {

        let { resultSelection } = this.state;
        e.stopPropagation();

        if (find(resultSelection, (selection) => { return selection === doc })) {
            download(resultSelection)
        } else {
            download(doc)
            // 如果选择下载的文件未处于选中状态，更新当前选中状态为该文件，且更新当前下载对象为该文件
            this.setState({
                resultSelection: [doc]
            })
        }
    }

    /**
     * 进行复制文件路径操作
     */
    protected async handleClickCopyPathButton(doc) {

        // 这里调用文件转换协议接口会导致copy函数永假
        // 拼接文件路径
        let path = `${doc['parentpath'].slice(6)}/ ${doc['basename']}${doc['ext']}`;


        // 获取配置下的前缀名
        let prefix = this.configs['internal_link_prefix'];

        // 复制到剪贴板
        copy(prefix + path) ?
            this.context.toast('复制内链地址成功')
            :
            null

    }

    /**
     * 选择排序选项
     */
    protected handleClickSortSelection(type) {
        this.setState({
            sortSelection: type
        })
        this.props.onSortSelect(type);
    }

    /**
     * 鼠标移入按钮
     */
    protected handleOnMouseEnter() {
        this.setState({
            isMouseEnterSortBtn: true
        })
    }

    /**
     * 鼠标移出按钮
     */
    protected handleOnMouseLeave() {
        this.setState({
            isMouseEnterSortBtn: false
        })
    }

    /**
     * 点击标签块显示按钮
     */
    protected handleClickShowTags(doc) {
        this.props.onClickShowTags(doc)
    }

    /**
     * 点击标签块添加至文档标签条件内
     */
    protected handleClickAddTags(tag) {
        this.props.onClickAddTags(tag)
    }

}