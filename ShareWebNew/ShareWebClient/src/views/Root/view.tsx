import * as React from 'react'
import * as classnames from 'classnames'
import session from '../../../util/session/session'
import { PureComponent } from '../../../ui/decorators'
import Download from '../../../components/Download/component.desktop'
import Rename from '../../../components/Rename/component.desktop'
import { setup as setupOpenApi } from '../../../core/openapi/openapi'
import __ from './locale'
import * as styles from './styles.css'

@PureComponent
export default class Root extends React.Component<any, any>{

    static defaultProps = {
        header: null,
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
                    this.context.toast(__('登录已超时'))
                    const login = session.get('login')
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/',
                        query: {
                            redirect: history.createPath(location),
                            lastLogin: login.userid
                        }
                    }))
                }
            },
            onUserDisabled: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('用户已被禁用'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            },
            onIPSegment: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('您受到IP网段限制，无法登录，请联系管理员'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            },
            onDeviceForbid: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('管理员已禁止此类客户端登录'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            },
            onDeviceBind: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('该账号已绑定设备，无法登录Web端'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            },
            onForeignLogin: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('当前帐号在另一地点登录，您被迫下线！'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            },
            onNetWorkChange: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('您所在的网络环境已改变，请重新登录。'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            },
            onResourcesNotEnough: () => {
                const { history, location } = this.props
                if (location.pathname !== '/') {
                    this.context.toast(__('服务器资源不足，无法访问。'))
                    session.set('login', null)
                    history.replace(history.createPath({
                        pathname: '/'
                    }))
                }
            }

        })
    }

    render() {
        const { header, content, children } = this.props
        return (
            <div className={styles['container']}>
                {
                    header
                }
                <div className={classnames(styles['wrapper'], { [styles['headless']]: !header })}>
                    {
                        content || children
                    }
                </div>
                <Download />
                <Rename />
            </div>
        )
    }
}