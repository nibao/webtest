import * as React from 'react'
import { noop, trim } from 'lodash'
import { list, del } from '../../core/apis/efshttp/favorites/favorites'
import __ from './locale'

export default class MyFavoritesBase extends React.Component<Components.MyFavorites.Props, Components.MyFavorites.State> {

    static defaultProps = {
        doDirOpen: noop,
        doFilePreview: noop,
        doShare: noop,
        doLinkShare: noop,
        onFavoriteCancel: noop,
        favoritedDocid: undefined,
        favorited: undefined,
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        favoritesDocs: null,
        filterResults: [],
        searchKey: '',
        downloadDoc: null,
        selections: [],
        contextMenuPosition: [0, 0],
        showContextMenu: false,
    }

    /**
     * 页面加载时向后台请求收藏列表数据
     */
    async componentWillMount() {
        this.initFavorites()
    }

    componentWillReceiveProps({ docs, favorited }) {
        if (docs && docs !== undefined && (this.props.docs !== docs || favorited !== this.props.favorited)) {
            // 当执行的是收藏操作时，重新加载数据；当执行的是取消收藏操作时，直接从加载的favoritesDocs中过滤掉取消收藏的项
            if (favorited) {
                this.initFavorites();
            } else {
                this.setState({
                    favoritesDocs: this.state.favoritesDocs.filter(info => info.docid !== docs[0].docid)
                })
            }
        }
    }

    /**
     * 更新收藏列表数据 
     */
    private async initFavorites() {
        this.setState({
            favoritesDocs: (await list()).reverse()
        })
    }

    /**
     * 处理取消收藏
     * @param {Core.APIs.EFSHTTP.FavoritesInfo} data 被取消收藏的文件或者文件夹
     */
    protected async handleCancelFavorite(data: Core.APIs.EFSHTTP.FavoritesInfo) {
        const { filterResults, favoritesDocs } = this.state
        // 从后端删除收藏文件
        try {
            await del({ docid: data.docid })

            // 更新显示列表，当搜索结果长度不为0时，从搜索结果中过滤删除的数据，更新显示
            if (filterResults.length !== 0) {
                const newFilterResults: ReadonlyArray<Core.APIs.EFSHTTP.FavoritesInfo> = filterResults.filter(item => {
                    return item.docid !== data.docid
                })

                this.setState({
                    filterResults: newFilterResults,
                })
            }

            // 将收藏数据更新为取消收藏后的结果
            const newDatas: ReadonlyArray<Core.APIs.EFSHTTP.FavoritesInfo> = favoritesDocs.filter(item => {
                return item.docid !== data.docid
            })

            this.setState({
                favoritesDocs: newDatas,
            })

            if (typeof this.context.toast === 'function') {
                this.context.toast(__('取消收藏'))
            }

            this.props.onFavoriteCancel([data])

        } catch (error) {
            throw error
        }
    }

    /**
     * 搜索功能
     * @param {string} searchKey 输入的字符串
     */
    protected handleSearchBoxChange(searchKey: string) {
        const formatSearchKey = trim(searchKey)

        this.setState({
            searchKey: formatSearchKey
        })

        if (formatSearchKey) {
            this.setState({
                filterResults: this.state.favoritesDocs.filter((item) => {
                    return item.name.indexOf(formatSearchKey) !== -1
                }),

            })
        }
    }

    /**
     * 打开右键菜单，并设定其显示位置
     */
    protected handleContextMenu(e) {
        e.preventDefault()
        this.setState({
            contextMenuPosition: [e.clientX, e.clientY],
            showContextMenu: true
        })
    }

    /**
     * 关闭右键菜单
     */
    protected closeContextMenu() {
        this.setState({
            showContextMenu: false
        })
    }
}



