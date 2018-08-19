import * as React from 'react'
import * as classnames from 'classnames'
import session from '../../../util/session/session'
import { setup as setupOpenApi } from '../../../core/openapi/openapi'
import Download from '../../../components/Download/component.mobile'
import Rename from '../../../components/Rename/component.mobile'
import CreateDir from '../../../components/CreateDir/component.mobile'
import Copy from '../../../components/Copy2/component.mobile'
import Move from '../../../components/Move2/component.mobile'
import * as styles from '../styles.css'
import __ from './locale'

export default class Root extends React.Component<any, any> {

    static defaultProps = {
        navTabs: null,
        content: null
    }

    static contextTypes = {
        toast: React.PropTypes.any
    }

    componentWillMount() {
        setupOpenApi({
            onTokenExpire: () => {
                const { history, location } = this.props

                if (location.pathname !== '/') {
                    this.context.toast(__('登录已超时，请重新登录'))
                    session.set('login', null)
                    this.setState({
                        login: null
                    })
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location)
                        }
                    }))
                }
            },
            onUserDisabled: () => {
                const { history, location } = this.props

                if (location.pathname !== '/') {
                    this.context.toast(__('用户已被禁用'))
                    session.set('login', null)
                    this.setState({
                        login: null
                    })
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location)
                        }
                    }))
                }
            },
            onDeviceBind: () => {
                const { history, location } = this.props

                if (location.pathname !== '/') {
                    this.context.toast(__('该账号已绑定设备，无法登录Web端'))
                    session.set('login', null)
                    this.setState({
                        login: null
                    })
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location)
                        }
                    }))
                }
            },
            onIPSegment: () => {
                const { history, location } = this.props

                if (location.pathname !== '/') {
                    this.context.toast(__('您受到IP 网段限制，无法登录，请联系管理员'))
                    session.set('login', null)
                    this.setState({
                        login: null
                    })
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location)
                        }
                    }))
                }
            },
            onDeviceForbid: () => {
                const { history, location } = this.props

                if (location.pathname !== '/') {
                    this.context.toast(__('管理员已禁止此类客户端登录'))
                    session.set('login', null)
                    this.setState({
                        login: null
                    })
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location)
                        }
                    }))
                }
            },
            onResourcesNotEnough: () => {
                const { history, location } = this.props

                if (location.pathname !== '/') {
                    this.context.toast(__('服务器资源不足，无法访问。'))
                    session.set('login', null)
                    this.setState({
                        login: null
                    })
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location)
                        }
                    }))
                }
            }
        })
    }

    handleDownload(url) {
        location.assign(url)
    }

    render() {
        const { navTabs, content, children } = this.props

        return (
            <div className={styles['container']}>
                <div className={classnames(styles['wrapper'], { [styles['tabless']]: !navTabs })}>
                    {
                        content || children
                    }
                </div>
                {
                    navTabs
                }
                <Download />
                <Rename />
                <CreateDir />
                <Copy />
                <Move />
            </div>
        )
    }
}