import * as React from 'react'
import { Link } from 'react-router'
import RouterLinkBase from './ui.base'

export default class RouteLink extends RouterLinkBase {
    render() {
        return <Link {...this.props} onClick={this.handleClick.bind(this)} />
    }
}