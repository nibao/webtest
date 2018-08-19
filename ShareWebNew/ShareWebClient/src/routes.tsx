import * as React from 'react'
import { last } from 'lodash'
import { hashHistory, Router } from 'react-router'
import ToastProvider from '../ui/ToastProvider/ui.desktop'
import HeadView from './views/Head/view'
import SSOView from './views/SSO/view'
import SideNav from '../components/SideNav/component.desktop'
import views from './views'
import session from '../util/session/session'
import { setTitle, bindEvent } from '../util/browser/browser'
import { setup as setupOpenApi } from '../core/openapi/openapi'
import { getOEMConfByOptions } from '../core/oem/oem'
import { getHomeNav, getRouteCache, setRouteCache } from './helper'
import { resetTimer } from '../core/logout/logout'


export default class Routes extends React.Component<any, any>{

    state = {
        routes: null
    }

    componentDidMount() {
        this.buildRoutes()
        bindEvent(window, 'click', resetTimer)
        resetTimer()
    }

    /**
     * 根据Home导航构建路由
     */
    async buildRoutes() {

        const [homeNav, { product }] = await Promise.all([
            getHomeNav(),
            getOEMConfByOptions(['product']),
        ])

        const homeRoutes = homeNav.map(({ path, childNav }) => {
            const childRoutes = childNav ? childNav.map(({ path }) => {
                return {
                    path,
                    onLeave: ({ location }) => {
                        setRouteCache(path, `${location.pathname}${location.search}`)
                    },
                    component: views[path],
                    indexRoute: {
                        onEnter: ({ location }, replace) => {
                            if (`${location.pathname}${location.search}` !== getRouteCache(path)) {
                                replace(getRouteCache(path) || '')
                            }
                        }
                    }
                }
            }) : []

            return {
                path,
                onLeave: ({ location }) => {
                    setRouteCache(path, `${location.pathname}${location.search}`)
                },
                components: {
                    sidebar: childNav && childNav.length ? () => <SideNav nav={childNav} /> : null,
                    main: views[path]
                },
                indexRoute: {
                    onEnter: ({ location }, replace) => {
                        if (childNav && childNav[0]) {
                            replace(getRouteCache(path) || childNav[0].path)
                        }
                    }
                },
                childRoutes,
            }
        })

        const routes = {
            path: '/',
            component: views['/'],
            onEnter() {
                setTitle(product)
            },
            indexRoute: {
                components: {
                    header: HeadView,
                    content: views['/index']
                }
            },
            childRoutes: [
                {
                    path: 'home',
                    onEnter: ({ location }, replace) => {
                        const login = session.get('login')
                        if (login) {
                            setupOpenApi({
                                userid: login.userid,
                                tokenid: login.tokenid
                            })
                        } else {
                            replace(hashHistory.createPath({
                                pathname: '/',
                                query: {
                                    redirect: hashHistory.createPath(location)
                                }
                            }))
                        }
                    },
                    indexRoute: {
                        onEnter: (nextState, replace) => replace('/home/documents')
                    },
                    components: {
                        header: HeadView,
                        content: views['/home']
                    },
                    childRoutes: homeRoutes
                },
                {
                    path: 'link(/:link)',
                    components: {
                        header: HeadView,
                        content: views['/link']
                    }
                },
                {
                    path: 'demo',
                    onEnter: ({ location }, replace) => {
                        const login = session.get('login')
                        if (login) {
                            setupOpenApi({
                                userid: login.userid,
                                tokenid: login.tokenid
                            })
                        }
                    },
                    component: require('./views/Demo/view').default
                },
                {
                    path: 'sso',
                    components: {
                        header: SSOView,
                        content: views['/sso']
                    }
                },
                {
                    path: 'login',
                    component: views['/login']
                },
                {
                    path: 'getfiles',
                    component: views['/getfiles']
                },
                {
                    path: 'preview',
                    onEnter: ({ location }, replace) => {
                        const login = session.get('login')
                        if (login) {
                            setupOpenApi({
                                userid: login.userid,
                                tokenid: login.tokenid
                            })
                        } else {
                            replace(hashHistory.createPath({
                                pathname: '/',
                                query: {
                                    redirect: hashHistory.createPath(location)
                                }
                            }))
                        }
                    },
                    component: views['/preview']
                },
                {
                    path: 'useragreement',
                    component: views['/useragreement']
                },
                {
                    path: '*',
                    components: {
                        content: () => <div>404 Not Found</div>
                    }
                }
            ]
        }

        this.setState({
            routes
        })
    }

    render() {
        const { routes } = this.state
        return (
            <ToastProvider>
                {
                    routes ?
                        <Router history={hashHistory} routes={routes} /> :
                        null
                }
            </ToastProvider>
        )
    }
}