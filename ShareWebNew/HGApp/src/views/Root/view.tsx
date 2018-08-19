import * as React from 'react'
import * as classnames from 'classnames'
import session from '../../../util/session/session'
import { setup as setupOpenApi } from '../../../core/openapi/openapi'
import * as styles from '../styles.css'

export default class Root extends React.Component<any, any>{

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
                    this.context.toast('登录超时')
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
            </div>
        )
    }
}