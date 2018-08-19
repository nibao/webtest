import * as React from 'react';
import { reduce, isFunction, isBoolean, isUndefined } from 'lodash';
import { getNWWindow } from '../util/nw/nw';
import { evalQuery, } from '../util/http/http';
import { shallowEqual } from '../util/accessor/accessor';
import { timer } from '../util/timer/timer';
import { PureComponent } from '../ui/decorators';
import { SyncMode } from '../core/client/client';
import { buildWebClientURI } from '../core/config/config';
import { setup as setupOpenAPI, getOpenAPIConfig } from '../core/openapi/openapi';
import { getTokenId, openUrlByChrome } from '../core/apis/client/tmp/tmp';
import { getSyncTaskNum } from '../core/apis/client/sync/sync';
import { getUnsyncLogNum } from '../core/apis/client/cache/cache';
import { getGlobalServer, getLocalServerById } from '../core/apis/client/config/config';
import { getFullInfo } from '../core/user/user';
import { Status } from './constants';

/**
 * 组件参数
 */
interface ComponentConfig {
    /**
     * 组件id
     */
    id: string;

    /**
     * 组件名
     */
    name: string;

    /**
     * 组件窗口参数
     */
    fields: {
        [key: string]: any;
    }

    /**
     * 组件参数
     */
    props: {
        [key: string]: any;
    }

    /**
     * 窗口实例
     */
    window?: UI.NWWindow.NWWindow;

    /**
     * 窗口的生命周期
     */
    stage: ComponentStage;
}

/**
 * 注册一个组件
 */
type Register = (name: string, renderComponent: RenderComponent) => void;

/**
 * 更新App状态
 * @param callback 
 */
type setAppState = (callback: (state, setState) => any) => any;

/**
 * 创建一个组件实例
 * @param props 组件参数
 * @param unmount 组件卸载函数，调用将销毁组件
 */
type RenderComponent = (props: any, { unmountComponent, updateApp }: { unmountComponent: () => any, updateApp: setAppState }) => React.ReactElement<any>

/**
 * 解注册一个组件
 * @param name 组件名
 */
type Unregister = (name: string) => void;

/**
 * 检查组件是否注册过
 * @param name 组件名
 */
type Exists = (name: string) => boolean;


interface AppFactory {
    (): React.Component;

    /**
     * 已注册的组件列表
     */
    registerations: {
        [name: string]: RenderComponent;
    };

    register: Register;

    unregister: Unregister;

    exists: Exists;
}

interface AppState {
    /**
     * 组件实例集合
     */
    components: {
        [key: string]: ComponentConfig;
    };

    /**
     * 当前登陆AnyShare的用户信息
     */
    user?: object;

    /**
     * 应用状态
     */
    status?: Status;

    /**
     * 网络是否连通
     */
    isOnline?: boolean;

    /**
     * 同步状态
     */
    sync?: {
        mode: SyncMode;

        num?: number;
    };

    /**
     * 提示配置项
     */
    config?: {
        /**
         * 非直传上传是否提示
         */
        skipDirectTransferTip: boolean;
    }
}

/**
 * 组件渲染的生命周期状态
 */
enum ComponentStage {
    /**
     * 接收到创建组件的请求，但未正式开始渲染
     */
    Received,

    /**
     * 开始渲染请求，但未渲染完成
     */
    Rendering,

    /**
     * 组件创建请求被取消，已经接受但未开始渲染的组件将不进入渲染，渲染中的组件将在完成后被卸载
     */
    Canceled,

    /**
     * 组件渲染完成，正常显示
     */
    Done,
}



/**
 * 计算窗口特性
 * @param query 
 */
function evalFields(query) {

    return reduce(evalQuery(query), (result, value, key) => {
        if (isUndefined(value)) {
            return result
        } else {
            switch (key) {
                case 'width':
                case 'height':
                case 'title':
                    return {
                        ...result,
                        [key]: value,
                    }

                case 'hide':
                    return {
                        ...result,
                        show: isBoolean(value) ? !value : true,
                    }

                case 'frameless':
                    return {
                        ...result,
                        frame: isBoolean(value) ? !value : true,
                    }

                default:
                    return result
            }
        }
    }, {})
}

const AppFactory: AppFactory = () => {

    @PureComponent
    class App extends React.Component<any, AppState> {
        constructor({ service }, context) {
            super({ service }, context);

            service
                /**
                 * 用来提供给外部检测服务是否存活
                 * 如果服务未启动，无法得到响应，调用方应处理网络异常
                 */
                .head('/ping', (_request, response) => {
                    response.send(null)
                })
                /**
                 * 更新App离线/在线状态
                 */
                .put('/status', async ({ body: { status } }, response) => {
                    switch (status) {
                        case Status.Online:

                            try {
                                // PC在程序启动时，HTTP服务尚未准备好，直接调用GetTokenId接口会导致卡死，因此在status变为上线时才去获取tokenID
                                const { globalServerConfig: { lastServer } } = await getGlobalServer();
                                const { localServerConfig: { eacpPort, efspPort, userId } } = await getLocalServerById({ serverId: lastServer });
                                const { tokenId } = await getTokenId();

                                setupOpenAPI({
                                    host: `https://${lastServer}`,
                                    EACPPort: eacpPort,
                                    EFSPPort: efspPort,
                                    userid: userId,
                                    tokenid: tokenId,
                                });

                                this.updateUser();

                                this.setState({ status }, () => {

                                    // 开始获取同步信息
                                    this.stopFetchSyncInfo = timer(this.getSync.bind(this))

                                })
                            } catch (ex) {
                            } finally {
                                response.end(null)
                            }
                            break

                        case Status.Offline:
                            await this.offline()

                            response.end(null)

                            break

                        default:
                            this.setState({ status }, () => response.end(null))
                            break

                    }
                })

                /**
                 * 配置服务器地址，更新globalServerConfig
                 */
                .put('/config', async ({ }, response) => {
                    try {
                        const { globalServerConfig: { lastServer } } = await getGlobalServer();
                        setupOpenAPI({
                            host: `https://${lastServer}`
                        })
                    } catch (ex) {
                        alert(JSON.stringify(ex))
                    }
                    response.end(null);
                })
                /**
                 * 当前所在目录或者选中项发生变化通知客户端
                 */
                .put('/explorer/:id', ({ params: { id }, body: { directory = null, selection = [] } }, response) => {
                    // 暂时只处理<SideBar />的选择变化
                    const sidebarID = `sidebar/${id}`;
                    const existingComponent = this.state.components[sidebarID];

                    if (!existingComponent || existingComponent.name !== 'sidebar') {
                        response.status(404);
                        response.end(null);
                    } else {
                        const { props } = existingComponent;
                        const nextProps = { ...props, directory, docs: selection };

                        this.setState({
                            components: {
                                ...this.state.components,
                                [sidebarID]: {
                                    ...existingComponent,
                                    props: nextProps,
                                }
                            }
                        }, () => { response.end(null) });
                    }
                })
                .delete('/app', (_request, response) => {
                    this.setState({ components: {} }, () => {
                        response.end(null);
                        nw.App.quit();
                    })
                })
                /**
                 * 预览
                 */
                .post('/preview/:id', async ({ body: { doc: { docid } } }, response) => {
                    const { locale, userid, tokenid, } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale'])

                    openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: `/home/documents/all?gns=${encodeURIComponent(docid.replace(/^gns\:\/\//, ''))}`, lang: locale, platform: 'pc' } }) });

                    response.send(null)
                })
                /**
                 * 挂载组件
                 * // TODO 多选情况下ID如何确定 
                 */
                .post('/:name/:id?', ({ params: { name, id }, body, query }, response) => {
                    // 创建了一个不存在的组件
                    if (!AppFactory.exists(name)) {
                        response.status(404)
                        response.end(null)
                    }
                    else {
                        const componentID = id ? `${name}/${id}` : `${name}`
                        const component = this.state.components[componentID]

                        if (component) {

                            if (component.stage !== ComponentStage.Done) {
                                response.status(503)
                            }
                            else {
                                const componentWindow = component.window

                                if (componentWindow) {
                                    componentWindow.restore()
                                    componentWindow.focus()
                                }
                            }

                            response.end(null)
                        } else {
                            this.setState({
                                components: {
                                    ...this.state.components,
                                    [componentID]: {
                                        name,
                                        id: componentID,
                                        props: body,
                                        fields: {
                                            ...evalFields(query),
                                            onLoaded: async (nwWindow) => {
                                                const component = this.state.components[componentID]

                                                if (component) {
                                                    if (component.stage === ComponentStage.Canceled) {
                                                        this.unmountComponent(componentID)
                                                        // 标记为资源已经被移除
                                                        response.status(410)
                                                    } else {
                                                        component.stage = ComponentStage.Done
                                                        component.window = nwWindow
                                                    }
                                                }

                                                response.send(null)
                                            }
                                        },
                                        stage: ComponentStage.Received
                                    },
                                }
                            }, () => {
                                const component = this.state.components[componentID]

                                if (component.stage !== ComponentStage.Canceled) {
                                    component.stage = ComponentStage.Rendering
                                }
                            })
                        }
                    }
                })
                /**
                 * 更新已经打开的组件
                 */
                .put('/:name/:id?', ({ params: { name, id }, body, query }, response) => {
                    const componentID = id ? `${name}/${id}` : `${name}`;

                    if (!this.state.components.hasOwnProperty(componentID)) {
                        response.status(404);
                        response.end(null)
                    } else {
                        const component = this.state.components[componentID];

                        // 组件已经实例化并且窗口存在
                        if (component !== null) {
                            const { props, fields } = component;
                            const nextProps = { ...props, ...body };
                            const nextFields = { ...fields, ...evalFields(query) }

                            this.setState({
                                components: {
                                    ...this.state.components,
                                    [componentID]: {
                                        ...component,
                                        props: nextProps,
                                        fields: nextFields,
                                    }
                                }
                            }, () => response.end(null));
                        } else {
                            response.status(404);
                            response.end(null)
                        }
                    }
                })
                /**
                 * 关闭组件
                 */
                .delete('/:name/:id?', ({ params: { name, id } }, response) => {
                    const componentID = id ? `${name}/${id}` : `${name}`;
                    const component = this.state.components[componentID];

                    if (component) {
                        // 如果组件已经渲染，则直接卸载
                        if (component.stage === ComponentStage.Done) {
                            this.unmountComponent(componentID, () => response.end(null))
                        }
                        // 否则只做取消渲染的标记，由渲染完成后的回调来执行卸载
                        else {
                            component.stage = ComponentStage.Canceled
                        }
                    }

                    response.end(null)
                })
        }

        state: AppState = {
            components: {},

            config: {
                skipDirectTransferTip: false
            },

            sync: {
                mode: SyncMode.Synced,
            }

        }

        /**
         * 定时获取同步状态定时器销毁函数
         */
        stopFetchSyncInfo: () => void;

        componentDidMount() {

            window.addEventListener('online', () => {
                this.setState({
                    isOnline: true
                })
            })

            window.addEventListener('offline', () => {
                this.setState({
                    isOnline: false
                })
            })
        }

        componentWillUnmount() {
            if (isFunction(this.stopFetchSyncInfo)) {
                this.stopFetchSyncInfo();

                delete this.stopFetchSyncInfo;
            }
        }

        /**
         * 更新当前登陆的用户信息
         */
        private async updateUser() {
            this.setState({
                user: await getFullInfo()
            })
        }

        /**
         * 侧边栏离线
         */
        private offline() {
            return new Promise((resolve) => {
                if (isFunction(this.stopFetchSyncInfo)) {
                    this.stopFetchSyncInfo();
                    delete this.stopFetchSyncInfo;
                }

                this.setState({
                    status: Status.Offline
                }, resolve)
            })
        }

        /**
         * 获取同步状态
         */
        private getSync() {

            return new Promise(async (resolve) => {
                try {
                    const { num } = await getSyncTaskNum();
                    let nextSyncState;

                    if (num !== 0) {
                        nextSyncState = {
                            mode: SyncMode.Syncing,
                            num
                        }
                    }
                    else {
                        const { num } = await getUnsyncLogNum({ relPath: '' });

                        if (num === 0) {
                            nextSyncState = {
                                mode: SyncMode.Synced
                            }
                        } else {
                            nextSyncState = {
                                mode: SyncMode.UnSynced,
                                num
                            }
                        }
                    }

                    // 由于nextSyncState每次都是新的对象，且getSync()会轮询执行，因此如果nextSyncState没有变化的时候不需要执行setState重新render
                    if (!shallowEqual(this.state.sync, nextSyncState)) {
                        this.setState({
                            sync: nextSyncState
                        }, resolve)
                    } else {
                        resolve()
                    }
                } catch (ex) {
                    // PC服务启动后，获取同步状态接口仍然可能报错，因此捕获异常后resolve
                    resolve()
                }
            })
        }

        /**
         * 卸载一个组件
         * @param component 组件配置
         */
        private unmountComponent(id, callback?: () => any) {
            const {
                [id]: unmounted,
                ...nextComponents
            } = this.state.components

            this.setState({
                components: nextComponents
            }, () => {
                if (isFunction(callback)) {
                    callback()
                }
            })
        }

        render() {
            return (
                <div>
                    {

                        Object.entries(this.state.components).map(([id, { name, props, fields }]) => {
                            const Component = AppFactory.registerations[name]
                            const unmountComponent = this.unmountComponent.bind(this, id)

                            /**
                             * 更新App状态
                             * @param callback 更新回调，接受当前app的state，以及this绑定为app的setState方法
                             * @example
                             * ```js
                             * <Component 
                             *     onSomethingHappend={foo => callback((state, setAppState) => setAppState({ foo: foo }))}
                             * />
                             * ```
                             */
                            const updateApp = (callback) => callback(this.state, this.setState.bind(this))

                            return isFunction(Component) ? (
                                <Component
                                    id={id}
                                    key={id}
                                    fields={fields}
                                    props={{
                                        ...props,
                                        sync: this.state.sync,
                                        status: this.state.status,
                                        isOnline: this.state.isOnline,
                                        user: this.state.user,
                                        skipDirectTransferTip: this.state.config.skipDirectTransferTip
                                    }}
                                    updateApp={updateApp}
                                    unmountComponent={unmountComponent}
                                />
                            ) : null
                        })
                    }
                </div>
            )
        }
    }

    return App
}

AppFactory.registerations = {};


AppFactory.register = (name, renderComponent) => {
    AppFactory.registerations[name] = renderComponent;
}

AppFactory.unregister = (name) => {
    delete AppFactory.registerations[name];
}

AppFactory.exists = (name) => {
    return !!AppFactory.registerations[name];
}

export default AppFactory;