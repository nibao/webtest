import * as React from 'react'
import { last } from 'lodash'
import { hashHistory, Router } from 'react-router'
import ToastProvider from '../ui/ToastProvider/ui.mobile'
import session from '../util/session/session'
import { setTitle } from '../util/browser/browser'
import { setup as setupOpenApi } from '../core/openapi/openapi'
// import { apply as applySkin } from '../core/skin/skin';
import { resetTimer } from '../core/logout/logout'
import { getOEMConfByOptions } from '../core/oem/oem'
import HomeTabs from './views/HomeTabs/view'
import views from './views'
import __ from './locale'
import { setRouteCache, getRouteCache } from './helper'
// import { getEACPHttpsPort, getEFASTHttpsPort } from '../core/thrift/sharemgnt/sharemgnt'

export default class Routes extends React.Component<any, any>{

    state = {
        routes: null
    }

    componentWillMount() {
        // setupOpenApi({
        //     EACPPort: location.protocol === 'https:' ? await getEACPHttpsPort() : 9998,
        //     EFSPPort: location.protocol === 'https:' ? await getEFASTHttpsPort() : 9123
        // })

        // applySkin()

        this.buildRoutes()

        window.addEventListener('touchstart', resetTimer)

        resetTimer()
    }

    async getHomeNav() {
        return [
            {
                path: '/home/documents',
                label: __('文档')
            },
            {
                path: '/home/user',
                label: __('我的')
            }
        ]
    }

    async buildRoutes() {

        const [homeNav, { product }] = await Promise.all([
            this.getHomeNav(),
            getOEMConfByOptions(['product'])
        ])

        const homeRoutes = homeNav.map(({ path }) => {
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
        })

        const routes = {
            path: '/',
            component: views['/'],
            onEnter() {
                setTitle(product)
            },
            indexRoute: {
                component: views['/index']
            },
            childRoutes: [
                {
                    path: 'home',
                    onEnter: ({ location }, replace) => {
                        const login = session.get('login')
                        setupOpenApi({
                            userid: login.userid,
                            tokenid: login.tokenid
                        })

                        if (!login) {
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
                        navTabs: () => <HomeTabs nav={homeNav} />,
                        content: views['/home']
                    },
                    childRoutes: homeRoutes
                },
                {
                    path: 'link(/:link)',
                    component: views['/link']
                },
                {
                    path: 'sso',
                    component: views['/sso']
                },
                {
                    path: 'invitation(/:invitation)',
                    component: views['/invitation']
                },
                {
                    path: 'mobileclient',
                    component: views['/mobileclient']
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