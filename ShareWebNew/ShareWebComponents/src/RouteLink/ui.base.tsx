import * as React from 'react'
import { Link } from 'react-router'

export default class RouterLinkBase extends React.Component<any, any>{

    static defaultProps = {
        disableWhenActived: false
    }

    static contextTypes = Link.contextTypes

    handleClick(event) {
        const router = this.context.router
        if (this.props.disableWhenActived && router) {
            const { to, query, hash, state, onlyActiveOnIndex } = this.props
            const location = (query || hash || state) ? { pathname: to, query: query, hash: hash, state: state } : to
            if (router.isActive(location, onlyActiveOnIndex)) {
                event.preventDefault()
            }
        }
    }
}