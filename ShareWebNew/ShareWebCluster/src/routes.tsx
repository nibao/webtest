import * as React from 'react';
import { Router, hashHistory } from 'react-router';
import session from '../util/session/session';
import { setTitle } from '../util/browser/browser';
import { getOEMConfByOptions } from '../core/oem/oem';
import { ECMSManagerClient, createShareSiteClient } from '../core/thrift2/thrift2';
import HeaderBar from '../console/HeaderBar/component.view';
import ToastProvider from '../ui/ToastProvider/ui.desktop'

export default class Routes extends React.Component<any, any> {
    state = {
        sites: null,  // 站点信息
        nodes: null,  // 节点信息
        expand: {}, // 展开状态
    }

    appSysStatus: boolean
    haNodes: ReadonlyArray<Core.ECMSManager.ncTHaNodeInfo>  // 当前站点的所有高可用节点

    routes = [
        {
            path: '/',
            onEnter: this.getProduct,
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./views/Root/view').default);
                });
            },
            indexRoute: {
                onEnter: this.clearAuth,
                getComponents: async (nextState, callback) => {
                    require.ensure([], require => {
                        const IndexView = require('./views/Index/view').default;
                        callback(null, {
                            header: ({ location }) => (
                                <HeaderBar
                                    path={location.pathname}
                                />
                            ),
                            main: ({ location, history }) => (
                                <IndexView
                                    location={location}
                                    history={history}
                                />
                            )
                        })
                    })
                }
            },
            childRoutes: [
                {
                    path: 'home',
                    getComponents: async (nextState, callback) => {
                        require.ensure([], require => {
                            const HomeView = require('./views/Home/view').default;
                            const NavTree = require('./views/NavTree/view').default;
                            callback(null, {
                                header: ({ location }) => (
                                    <HeaderBar
                                        path={location.pathname}
                                    />
                                ),
                                main: ({ location, children }) => (
                                    <HomeView
                                        location={location}
                                        navTree={
                                            <NavTree
                                                sites={this.state.sites}
                                                nodes={this.state.nodes}
                                                haNodes={this.haNodes}
                                                expand={this.state.expand}
                                                onExpand={this.expand.bind(this)}
                                                onExpandSite={this.expandSite.bind(this)}
                                            />
                                        }
                                    >
                                        {children}
                                    </HomeView>
                                )
                            })
                        })
                    },
                    onEnter: (nextState, replace) => this.checkAuth(nextState, replace),
                    indexRoute: {
                        onEnter: async (nextState, replace) => {
                            const { sites } = this.state;
                            // 实现登录后导航树展开状态
                            this.expand(null, ['home', 'home/system', `system/${sites[0].id}`, `system/${sites[0].id}/server`], true)
                            hashHistory.replace(`/home/system/${sites[0].id}`)
                        }
                    },
                    getChildRoutes: async (nextState, callback) => {
                        await this.getSites();
                        callback(null, [{
                            path: 'system',
                            onEnter: () => {
                                const pathChain = nextState.location.pathname.split('/').slice(1);
                                this.expand(null, pathChain.reduce((pre, chain, i, chains) => [...pre, chains.slice(0, i + 1).join('/')], []), true)
                            },
                            indexRoute: {
                                getComponent: (nextState, callback) => {
                                    require.ensure([], require => {
                                        const SiteManagement = require('../console/SiteManagement/component.desktop').default;
                                        callback(null, () =>
                                            <SiteManagement
                                                doRedirectServers={this.doServerRedirect.bind(this)}
                                                onSiteConfigSuccess={this.handleUpdateNavTree.bind(this)}
                                            />
                                        );
                                    })
                                }
                            },
                            getChildRoutes: async (nextState, callback) => {
                                const { sites } = this.state;

                                callback(null, sites.map(site => {
                                    return {
                                        path: site.id,
                                        params: site,
                                        indexRoute: {
                                            onEnter: async () => {
                                                await this.getNodes()
                                            },
                                            getComponent: (nextState, callback) => {
                                                require.ensure([], require => {
                                                    const System = require('./views/System/view').default;
                                                    callback(null, System);
                                                })
                                            }
                                        },
                                        getChildRoutes: async (nextState, callback) => {
                                            const nodeInfo = await this.getNodes();

                                            callback(null, [
                                                {
                                                    path: 'server', // 服务器管理
                                                    indexRoute: {
                                                        getComponent: (nextState, callback) => {
                                                            require.ensure([], require => {
                                                                const Server = require('../console/Server/component.view').default;
                                                                callback(null, () => {
                                                                    return <Server
                                                                        onUpdateNodeConfig={() => this.handleUpdateNavTree({ currentPath: nextState.location.pathname })}
                                                                    />
                                                                });
                                                            })
                                                        }
                                                    },
                                                    childRoutes: nodeInfo && nodeInfo.map(node => ({
                                                        path: node.node_ip,
                                                        getComponent: (nextState, callback) => {
                                                            require.ensure([], require => {
                                                                const NodeManagement = require('../console/NodeManagement/component.view').default
                                                                callback(null, () => <NodeManagement node={node} />);
                                                            })
                                                        }
                                                    }))
                                                },
                                                {
                                                    path: 'database', // 数据库子系统
                                                    indexRoute: {
                                                        getComponent: (nextState, callback) => {
                                                            require.ensure([], require => {
                                                                const DatabaseSubsystem = require('../console/DatabaseSubsystem/component.desktop').default;
                                                                callback(null, () => <DatabaseSubsystem
                                                                    doRedirectServers={this.doServerRedirect.bind(this)}
                                                                />);
                                                            })
                                                        }
                                                    }
                                                },
                                                // 暂时屏蔽应用子系统路由
                                                // {
                                                //     path: 'application', // 应用子系统
                                                //     indexRoute: {
                                                //         getComponent: (nextState, callback) => {
                                                //             require.ensure([], require => {
                                                //                 callback(null, () => <div>应用子系统</div>);
                                                //             })
                                                //         }
                                                //     }
                                                // },
                                                {
                                                    path: 'storage', // 存储子系统
                                                    indexRoute: {
                                                        getComponent: (nextState, callback) => {
                                                            require.ensure([], require => {
                                                                const StorageSubSystem = require('../console/StorageSubSystem/component.view').default;
                                                                callback(null, () => <StorageSubSystem />);
                                                            })
                                                        }
                                                    }
                                                },
                                                {
                                                    path: 'siteconfig', // 站点配置
                                                    indexRoute: {
                                                        getComponent: (nextState, callback) => {
                                                            require.ensure([], require => {
                                                                const SiteConfig = require('../console/SiteConfig/component.view').default;
                                                                callback(null, () => <SiteConfig />);
                                                            })
                                                        }
                                                    }
                                                },
                                                {
                                                    path: 'siteupdate', // 站点升级
                                                    indexRoute: {
                                                        getComponent: (nextState, callback) => {
                                                            require.ensure([], require => {
                                                                const SiteUpgrade = require('../console/SiteUpgrade/component.view').default;
                                                                callback(null, () => (
                                                                    <SiteUpgrade
                                                                        doRedirectServers={this.doServerRedirect.bind(this)}
                                                                        doSystemDetailRedirect={this.doSystemDetailRedirect.bind(this)}
                                                                    />
                                                                ));
                                                            })
                                                        }
                                                    }
                                                }
                                            ])
                                        }
                                    }
                                }))
                            }
                        }])
                    }
                }
            ]
        }
    ]

    componentWillMount() {
        this.getSites();
    }

    /**
     * 获取OEM产品名称
     */
    async getProduct() {
        setTitle((await getOEMConfByOptions(['product'])).product);
    }

    /**
     * 获取应用服务可用状态
     */
    async getAppSysStatus() {
        if (typeof this.appSysStatus === 'undefined') {
            // 获取应用系统主节点ip (注意：接口不拋错, 若没有查找到可用节点ip,返回为空字符串""，表示当前应用服务不可用)
            this.appSysStatus = await ECMSManagerClient.get_app_master_node_ip() === '' ? false : true
        }

        return this.appSysStatus
    }

    /**
     * 清除 uuid 或 用户信息
     */
    clearAuth() {
        session.remove('userid');
        session.remove('username');
        session.remove('displayname');
        session.remove('userInfo');
    }

    /**
     * 检查userInfo是否存在
     */
    checkAuth(nextState, replace) {
        if (!session.has('userInfo')) {
            replace({ pathname: '/' })
        }
    }

    /**
     * 切换tab页
     */
    handleTabChange(tab, location) {
        hashHistory.push(hashHistory.createPath({
            ...location,
            query: { tab }
        }))
    }

    /**
     * 更新NavTree信息
     */
    async handleUpdateNavTree({ currentPath = '' }: { currentPath: string } = {}) {
        await Promise.all([
            this.getSites(true),
            this.getNodes(true)
        ]);
        if (currentPath) { // 重新加载路由
            const [, home, system, siteId, ...rest] = currentPath.split('/');
            hashHistory.replace([, home, system, this.state.sites[0].id, ...rest].join('/'));
        }
    }
    /**
     * 获取站点信息
     */
    async getSites(withCacheReload: boolean = false) {
        if (withCacheReload || !this.state.sites) {
            const appIp = await ECMSManagerClient.get_app_master_node_ip();
            if (appIp !== '') {
                const sites = await createShareSiteClient({ ip: appIp }).GetSiteInfo();
                await new Promise(resolve => this.setState({ sites }, resolve))
            } else {
                await new Promise(resolve =>
                    this.setState({
                        sites: [{ id: '127.0.0.1', name: 'localhost', type: 0 }]
                    }, resolve))
            }
        }
        return this.state.sites
    }

    /**
     * 获取站点内部节点信息
     */
    async getNodes(withCacheReload: boolean = false) {
        if (withCacheReload || !this.state.nodes) {
            const siteNodes = await ECMSManagerClient.get_all_node_info()
            this.haNodes = await ECMSManagerClient.get_ha_node_info()
            await new Promise(resolve => this.setState({
                nodes: siteNodes
            }, resolve))
        }
        return this.state.nodes
    }

    /**
     * 控制导航树展开状态
     */
    expand(e, nodeIds, expanded?) {
        if (typeof nodeIds === 'string') {
            nodeIds = [nodeIds]
        }
        if (!e || e && !e.defaultPrevented) {
            e && e.preventDefault();
            this.setState({
                expand: nodeIds.reduce((expand, nodeId) =>
                    ({ ...expand, [nodeId]: typeof expanded === 'undefined' ? !this.state.expand[nodeId] : expanded }), this.state.expand)
            })
        }
    }

    /**
     * 展开站点
     */
    expandSite(e, id) {
        if (id === this.state.sites[0].id) {
            this.getNodes();
            this.expand(e, `home/system/${id}`);
        }
    }

    doServerRedirect() {
        hashHistory.replace(`/home/system/${this.state.sites[0].id}/server`)
    }

    /**
     * 打开监控详情
     */
    async doSystemDetailRedirect() {

        let nodeInfo = await ECMSManagerClient.get_all_node_info()
        const OIP = nodeInfo.find((value) => {
            if (value.role_ecms === 1) {
                return value
            }
        }).node_ip

        window.open(`http://${OIP}:10049/zabbix/zabbix.php?action=dashboard.view`);
    }

    render() {
        return (
            <ToastProvider>
                <Router
                    ref="router"
                    routes={this.routes}
                    history={hashHistory}
                />
            </ToastProvider>
        )
    }
}