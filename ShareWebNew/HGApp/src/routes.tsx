import * as React from 'react'
import { last } from 'lodash'
import { hashHistory, Router } from 'react-router'
import HomeTabs from './views/HomeTabs/view'
import ToastProvider from '../ui/ToastProvider/ui.desktop'
import views from './views'

import session from '../util/session/session'
import { setup as setupOpenApi } from '../core/openapi/openapi'

export default class Routes extends React.Component<any, any>{

    state = {
        routes: null,
        login: null
    }

    componentWillMount() {
        this.buildRoutes()
    }

    async getHomeNav() {
        const HomeNav = [
            {
                path: '/home/documents',
                label: '文档'
            },
            {
                path: '/home/user',
                label: '我的'
            }
        ]
        return HomeNav
    }

    async buildRoutes() {

        const homeNav = await this.getHomeNav()

        const routeCache = {}

        const homeRoutes = homeNav.map(({ path }) => {
            const chains = path.split('/').filter(chain => chain)
            const componentId = chains.join('.')

            return {
                path: last(chains),
                onLeave: ({ location }) => {
                    routeCache[componentId] = `${location.pathname}${location.search}`
                },
                components: views[componentId],
                indexRoute: {
                    onEnter: ({ location }, replace) => {
                        if (`${location.pathname}${location.search}` !== routeCache[componentId]) {
                            replace(routeCache[componentId] || '')
                        }
                    }
                }
            }
        })

        const routes = {
            path: '/',
            component: views['root'],
            indexRoute: {
                component: views['index']
            },
            childRoutes: [
                {
                    path: 'home',
                    onEnter: ({ location }, replace) => {
                        const login = session.get('login')
                        this.setState({
                            login
                        })
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
                        onEnter: (nextState, replace) => replace(routeCache['home.documents'] || '/home/documents')
                    },
                    components: {
                        navTabs: () => <HomeTabs nav={homeNav} />,
                        content: views['home']
                    },
                    childRoutes: homeRoutes
                },
                {
                    path: 'link',
                },
                {
                    path: 'sso',
                },
                {
                    path: '*',
                    component: () => <div>404 Not Found</div>
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