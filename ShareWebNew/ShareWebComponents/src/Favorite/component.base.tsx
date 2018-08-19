import * as React from 'react'
import { noop } from 'lodash'
import { check, del, add } from '../../core/apis/efshttp/favorites/favorites'

export default class FavoriteBase extends React.Component<Components.Favorite.Props, Components.Favorite.State> {

    static defaultProps = {
        doc: null,
        onFavoriteChange: noop,
        favorited: undefined,
    }

    state = {
        doc: null,
        favorited: false,
        errorCode: undefined,
    }

    /**
     * PC端没有收藏权限弹出的提示窗口
     */
    noPermissionsWindow: UI.NWWindow.NWWindow

    async componentWillMount() {
        const doc = this.props.doc
        const [{ favorited }] = await check({ docids: [doc.docid] })
        this.setState({
            favorited,
            doc,
        })
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.doc !== nextProps.doc) {
            const [{ favorited }] = await check({ docids: [nextProps.doc.docid] })
            this.setState({
                favorited,
                doc: nextProps.doc
            })
        }

        if (this.props.favorited !== nextProps.favorited) {
            this.setState({
                favorited: nextProps.favorited,
            })
        }
    }

    /**
     * 取消收藏
     */
    async handleCancelFavorited(doc: Core.Docs.Doc) {
        try {
            await del({ docid: doc.docid })
            this.setState({
                favorited: false
            }, () => {
                this.props.onFavoriteChange([doc], this.state.favorited)
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * 收藏
     */
    async handleFavorited(doc: Core.Docs.Doc) {
        try {
            await add({ docid: doc.docid })
            this.setState({
                favorited: true
            }, () => {
                this.props.onFavoriteChange([doc], this.state.favorited)
            })
        }
        catch (err) {
            this.setState({
                errorCode: err.errcode
            })
        }
    }
}




