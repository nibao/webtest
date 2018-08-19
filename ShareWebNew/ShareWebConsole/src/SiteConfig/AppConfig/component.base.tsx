import * as React from 'react';
import { ECMSManagerClient, createShareMgntClient, createEVFSClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import '../../../gen-js/ShareMgnt_types';
import WebComponent from '../../webcomponent';
import __ from './locale';

export enum AppServiceAccessingAddressStatus {
    /**
     * 验证合法,没有气泡提示
     */
    Normal,

    /**
     * 没有启用应用节点
     */
    AppNodeEmpty,

    /**
     * 内外网映射地址为空
     */
    Empty,

    /**
     * 内外网映射地址不合法,包含英文字母,认为输入是 域名
     */
    ErrorEnglishLetter,

    /**
     * 内外网映射地址不合法,不包含英文字母,认为输入是 IP
     */
    ErrorNoEnglish
}

export enum ObjectStorageAccessingAddressStatus {
    /**
     * 验证合法,没有气泡提示
     */
    Normal,

    /**
     * 没有启用应用节点
     */
    AppNodeEmpty,

    /**
     * 地址为空
     */
    Empty,

    /**
     * 地址不合法,包含英文字母,认为输入是 域名
     */
    ErrorEnglishLetter,

    /**
     * 地址不合法,不包含英文字母,认为输入是 IP
     */
    ErrorNoEnglish
}

export enum WebHttpValidateState {
    /**
     * 验证合法,没有气泡提示
     */
    Normal,

    /**
     * 没有启用应用节点
     */
    AppNodeEmpty,

    /**
     * web客户端访问端口http或者https输入为空
     */
    Empty,

    /**
     * 输入不合法
     */
    InputError
}

export enum WebHttpsValidateState {
    Normal,
    AppNodeEmpty,
    Empty,
    InputError
}

export enum ObjHttpValidateState {
    /**
     * 验证合法,没有气泡提示
     */
    Normal,

    /**
     * 没有启用应用节点
     */
    AppNodeEmpty,

    /**
     * 对象存储http或者https地址为空
     */
    Empty,

    /**
     * 输入不合法
     */
    InputError
}

export enum ObjHttpsValidateState {
    Normal,
    AppNodeEmpty,
    Empty,
    InputError
}

export enum DialogStatus {
    /**
     * 合法
     */
    None,

    /**
     * 不合法,ErrorDialog 弹窗出现
     */
    ErrorDialogAppear
}

export enum VipSys {
    /**
     * vip 中 sys 值为1
     */
    VipSys1 = 1,

    /**
     * vip 中 sys 值为2
     */
    VipSys2 = 2
}

export default class AppConfigBase extends WebComponent<Console.AppConfig.Props, Console.AppConfig.State> {
    static contextTypes = {
        toast: React.PropTypes.any
    }

    static defaultProps = {

    }

    /**
     * 最后一次保存生效的应用服务值
     */
    lastAppServiceConfig = {
        appServiceAccessingAddress: '',
        webClientPort: {
            https: '',
            http: '',
        }
    }

    /**
     * 最后一次保存生效的对象存储值
     */
    lastObjectStorageConfig = {
        objectStorageAccessingAddress: '',
        objStorePort: {
            https: '',
            http: '',
        }
    }

    /**
     * 获取应用节点信息
     */
    appNodeInfo = null

    /**
     * 获取 appIp
     * 根据 aPPIP 判断应用服务是否可用
     */
    appIp = null

    /**
     * 获取应用服务和对象存储中小黄框的默认状态
     */
    defaultValidateBoxStatus = {
        appServiceAccessingAddressStatus: -1,
        objectStorageAccessingAddressStatus: -1,
        webClientHttps: -1,
        webClientHttp: -1,
        objStorageHttps: -1,
        objStorageHttp: -1,
    }

    state = {
        appServiceAccessingAddress: '',
        webClientPort: {
            https: '',
            http: ''
        },
        objectStorageAccessingAddress: '',
        objStorePort: {
            https: '',
            http: ''
        },
        appServiceAccessingAddressStatus: AppServiceAccessingAddressStatus.Normal,
        webClientHttpsStatus: WebHttpsValidateState.Normal,
        webClientHttpStatus: WebHttpValidateState.Normal,
        objectStorageAccessingAddressStatus: ObjectStorageAccessingAddressStatus.Normal,
        objStorageHttpsStatus: ObjHttpsValidateState.Normal,
        objStorageHttpStatus: ObjHttpValidateState.Normal,
        isAppServiceChanged: false,
        isObjectStorageChanged: false,
        dialogStatus: DialogStatus.None,
        errorMessage: '',
        thirdPartyOSSInfo: null,
        loadingStatus: false
    }

    async componentWillMount() {
        this.appIp = await ECMSManagerClient.get_app_master_node_ip()
        this.appNodeInfo = await ECMSManagerClient.get_app_node_info()
        this.initAppService()
        this.initObjStorage()
        this.setState({
            thirdPartyOSSInfo: await createEVFSClient({ ip: await this.getAppIp() }).GetThirdPartyOSSInfo()
        })
    }

    /**
     * 获取应用节点ip
     * @param appIp 应用节点ip
     */
    private async getAppIp() {
        if (!this.appIp) {
            return await ECMSManagerClient.get_app_master_node_ip()
        }
        return this.appIp
    }

    /**
     * 获取应用节点信息
     * @param appNodeInfo 应用节点信息
     */
    private async getAppNodeInfo() {
        if (!this.appNodeInfo) {
            return await ECMSManagerClient.get_app_node_info()
        }
        return this.appNodeInfo
    }

    /**
     * 应用服务整体初始化
     */
    private async initAppService() {
        this.initAppServiceAccessingAddress()
        this.initWeb()
    }

    /**
     * 对象存储 访问地址部分初始化
     */
    private async initObjStorage() {
        this.initObjStroageAccessingAddressing()
        this.initObj()
    }

    /**
     *  应用服务访问地址部分初始化
     */
    private async initAppServiceAccessingAddress() {
        // 调取接口获得返回的应用节点信息,返回数组非空代表应用节点开启



        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length === 0) {
            this.setState({
                appServiceAccessingAddress: '',
                appServiceAccessingAddressStatus: AppServiceAccessingAddressStatus.AppNodeEmpty
            })
        } else {
            let appServiceAccessingAddress = await createShareMgntClient({ ip: await this.getAppIp() }).GetHostName()
            this.setState({
                appServiceAccessingAddress,
                appServiceAccessingAddressStatus: AppServiceAccessingAddressStatus.Normal
            })

        }
        this.lastAppServiceConfig = {
            ...this.lastAppServiceConfig,
            appServiceAccessingAddress: this.state.appServiceAccessingAddress
        }
        this.defaultValidateBoxStatus = {
            ...this.defaultValidateBoxStatus,
            appServiceAccessingAddressStatus: this.state.appServiceAccessingAddressStatus
        }
    }

    /**
     * 应用服务 web客户端访问部分初始化
     */
    private async initWeb() {
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length === 0) {
            this.setState({
                webClientPort: {
                    https: '',
                    http: ''
                },
                webClientHttpsStatus: WebHttpsValidateState.AppNodeEmpty,
                webClientHttpStatus: WebHttpValidateState.AppNodeEmpty,
            })
        } else {
            // 设置web客户端访问https和http默认值
            const [https, http] = await createShareMgntClient({ ip: await this.getAppIp() }).GetGlobalPort()

            this.setState({
                webClientPort: {
                    https,
                    http,
                },
                webClientHttpsStatus: WebHttpsValidateState.Normal,
                webClientHttpStatus: WebHttpValidateState.Normal,
            })
        }
        this.lastAppServiceConfig = {
            ...this.lastAppServiceConfig,
            webClientPort: this.state.webClientPort
        }

        this.defaultValidateBoxStatus = {
            ...this.defaultValidateBoxStatus,
            webClientHttps: this.state.webClientHttpsStatus,
            webClientHttp: this.state.webClientHttpStatus,
        }

        this.props.changeAppConfigWebClientPorts(
            Number(this.state.webClientPort.https),
            Number(this.state.webClientPort.http),
            Number(this.lastAppServiceConfig.webClientPort.https),
            Number(this.lastAppServiceConfig.webClientPort.http),
        )
    }

    /**
     * 对象存储 访问地址 部分初始化
     */
    private async initObjStroageAccessingAddressing() {
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length === 0) {
            this.setState({
                objectStorageAccessingAddress: '',
                objectStorageAccessingAddressStatus: ObjectStorageAccessingAddressStatus.AppNodeEmpty
            })
        } else {
            this.setState({
                objectStorageAccessingAddress: await createShareMgntClient({ ip: await this.getAppIp() }).GetEossHostName(),
                objectStorageAccessingAddressStatus: ObjectStorageAccessingAddressStatus.Normal,
            })
        }
        this.lastObjectStorageConfig = {
            ...this.lastObjectStorageConfig,
            objectStorageAccessingAddress: this.state.objectStorageAccessingAddress
        }
        this.defaultValidateBoxStatus = {
            ...this.defaultValidateBoxStatus,
            objectStorageAccessingAddressStatus: this.state.objectStorageAccessingAddressStatus
        }
    }

    /**
     *  对象存储 https/http 部分初始化
     */
    private async initObj() {
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length === 0) {
            this.setState({
                objStorePort: {
                    https: '',
                    http: ''
                },
                objStorageHttpsStatus: ObjHttpsValidateState.AppNodeEmpty,
                objStorageHttpStatus: ObjHttpValidateState.AppNodeEmpty,
            })
        } else {
            // 设置对象存储https和http默认值
            const { httpsPort, httpPort } = await createShareMgntClient({ ip: await this.getAppIp() }).GetGlobalEOSSPort()

            this.setState({
                objStorePort: {
                    https: httpsPort,
                    http: httpPort
                },
                objStorageHttpsStatus: ObjHttpsValidateState.Normal,
                objStorageHttpStatus: ObjHttpValidateState.Normal,
            })
        }
        this.lastObjectStorageConfig = {
            ...this.lastObjectStorageConfig,
            objStorePort: this.state.objStorePort
        }
        this.defaultValidateBoxStatus = {
            ...this.defaultValidateBoxStatus,
            objStorageHttps: this.state.objStorageHttpsStatus,
            objStorageHttp: this.state.objStorageHttpStatus,
        }
        this.props.changeAppConfigObjPorts(
            Number(this.state.objStorePort.https),
            Number(this.state.objStorePort.http),
            Number(this.lastObjectStorageConfig.objStorePort.https),
            Number(this.lastObjectStorageConfig.objStorePort.http),
        )
    }

    /**
     * 获取输入的应用服务访问地址 
     */
    protected async changeAppServiceAccessingAddress(value) {
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length !== 0) {
            this.setState({
                appServiceAccessingAddress: value.trim(),
                appServiceAccessingAddressStatus: AppServiceAccessingAddressStatus.Normal,
                isAppServiceChanged: true
            })
        }
    }

    /**
     * 验证输入的访问地址是否合法
     */
    private isIpValidate(ip) {
        /**
         * 如果输入IP中包含除 0-9 . 之外的其他字符
         */
        if (/[^0-9\.]/.test(ip)) {
            return false
        } else {
            const ipArray = ip.split('.')
            if (ipArray.length === 4) {
                return !ipArray.some(ip => {
                    if (ip === '') {
                        return true
                    } else {
                        return Number(ip) < 0 || Number(ip) > 255
                    }
                })
            } else {
                return false
            }
        }
    }

    /**
     * 检验输入地址中是否包含英文字母
     */
    private isAddressIncludeEnLetter(address) {
        return /[a-z]/gi.test(address)
    }

    /**
     * 验证域名是否合法
     */
    private isDomainNameValidate(domain) {
        return /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/.test(domain)
    }

    /**
     * 应用服务点击保存触发事件
     */
    protected async completeAppService() {
        if (!(
            (this.isIpValidate(this.state.appServiceAccessingAddress)
                || this.isDomainNameValidate(this.state.appServiceAccessingAddress))
            && this.isPortValidate(this.state.webClientPort.http)
            && this.isPortValidate(this.state.webClientPort.https)
        )) {
            let appServiceAccessingAddressStatusTemp = this.state.appServiceAccessingAddressStatus
            let webClientHttpsStatusTemp = this.state.webClientHttpsStatus
            let webClientHttpStatusTemp = this.state.webClientHttpStatus
            // 验证应用服务中访问地址合法性
            if (!(this.isIpValidate(this.state.appServiceAccessingAddress))) {
                if (this.state.appServiceAccessingAddress.length === 0) {
                    appServiceAccessingAddressStatusTemp = AppServiceAccessingAddressStatus.Empty
                } else {
                    if (this.isAddressIncludeEnLetter(this.state.appServiceAccessingAddress)) {
                        if (this.isDomainNameValidate(this.state.appServiceAccessingAddress)) {
                            appServiceAccessingAddressStatusTemp = AppServiceAccessingAddressStatus.Normal
                        } else {
                            appServiceAccessingAddressStatusTemp = AppServiceAccessingAddressStatus.ErrorEnglishLetter
                        }
                    } else {
                        appServiceAccessingAddressStatusTemp = AppServiceAccessingAddressStatus.ErrorNoEnglish
                    }
                }
            }
            // 验证应用服务中 Web客户端 https 端口合法性
            if (!this.isPortValidate(this.state.webClientPort.https)) {
                this.state.webClientPort.https === '' ?
                    webClientHttpsStatusTemp = WebHttpsValidateState.Empty
                    : webClientHttpsStatusTemp = WebHttpsValidateState.InputError
            }

            // 验证应用服务中 Web客户端 http 端口合法性            
            if (!this.isPortValidate(this.state.webClientPort.http)) {
                this.state.webClientPort.http === '' ?
                    webClientHttpStatusTemp = WebHttpValidateState.Empty
                    : webClientHttpStatusTemp = WebHttpValidateState.InputError
            }

            this.setState({
                appServiceAccessingAddressStatus: appServiceAccessingAddressStatusTemp,
                webClientHttpsStatus: webClientHttpsStatusTemp,
                webClientHttpStatus: webClientHttpStatusTemp
            })
        } else {
            if (
                this.state.appServiceAccessingAddress !== this.lastAppServiceConfig.appServiceAccessingAddress
                || Number(this.state.webClientPort.https) !== Number(this.lastAppServiceConfig.webClientPort.https)
                || Number(this.state.webClientPort.http) !== Number(this.lastAppServiceConfig.webClientPort.http)
            ) {
                // 在 地址 https http 中，如果只有地址发生了更改，那弹出保存成功提示且记录地址相关日志
                if (this.state.appServiceAccessingAddress !== this.lastAppServiceConfig.appServiceAccessingAddress
                    && (
                        Number(this.state.webClientPort.https) === Number(this.lastAppServiceConfig.webClientPort.https)
                        && Number(this.state.webClientPort.http) === Number(this.lastAppServiceConfig.webClientPort.http)
                    )
                ) {

                    // 点击了保存之后，要冻结整个界面，用添加转圈圈的方式冻结界面
                    this.setState({
                        loadingStatus: true
                    })

                    try {
                        await createShareMgntClient({ ip: await this.getAppIp() }).SetHostName(this.state.appServiceAccessingAddress)

                        // 保存成功,保存/取消 按钮消失
                        this.setState({
                            isAppServiceChanged: false,
                            loadingStatus: false
                        })
                        this.context.toast(__('保存成功。'), { code: "\uf02f", size: 24, color: 'green' })
                        // 记日志
                        manageLog({
                            level: ncTLogLevel['NCT_LL_INFO'],
                            opType: ncTManagementType['NCT_MNT_SET'],
                            msg: __('设置 应用服务 访问地址 成功'),
                            exMsg: __('应用服务 访问地址：${appServiceAccessingAddress}', {
                                'appServiceAccessingAddress': this.state.appServiceAccessingAddress,
                            })
                        })

                        this.lastAppServiceConfig = {
                            appServiceAccessingAddress: this.state.appServiceAccessingAddress,
                            webClientPort: this.state.webClientPort
                        }
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg,
                            dialogStatus: DialogStatus.ErrorDialogAppear
                        })
                    }
                } else {
                    // 在因为端口更改需要更新防火墙规则时，出现 正在保存 的转圈圈提醒，在接口调用之后转圈圈消失，然后 FireWallConfig 组件接着出现 正在更新防火墙规则 的转圈圈提示
                    this.setState({
                        loadingStatus: true
                    })

                    // 如果 https/http 发生了更改，那会触发更新防火墙规则的函数，然后会处理 保存成功 及 日志记录的事情
                    try {
                        await createShareMgntClient({ ip: await this.getAppIp() }).SetHostName(this.state.appServiceAccessingAddress)
                        await createShareMgntClient({ ip: await this.getAppIp() }).SetGlobalPort(Number(this.state.webClientPort.http), Number(this.state.webClientPort.https))

                        // 保存成功,保存/取消 按钮消失
                        this.setState({
                            isAppServiceChanged: false,
                            loadingStatus: false
                        })
                        // 记日志
                        // 当地址发生改变时只记录地址部分日志，端口日志会在更新防火墙规则之后再记录
                        this.state.appServiceAccessingAddress !== this.lastAppServiceConfig.appServiceAccessingAddress ?
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_SET'],
                                msg: __('设置 应用服务 访问地址 成功'),
                                exMsg: __('应用服务 访问地址：${appServiceAccessingAddress}', {
                                    'appServiceAccessingAddress': this.state.appServiceAccessingAddress,
                                })
                            })
                            : null

                        this.props.changeAppConfigWebClientPorts(
                            Number(this.state.webClientPort.https),
                            Number(this.state.webClientPort.http),
                            Number(this.lastAppServiceConfig.webClientPort.https),
                            Number(this.lastAppServiceConfig.webClientPort.http),
                        )
                        this.lastAppServiceConfig = {
                            appServiceAccessingAddress: this.state.appServiceAccessingAddress,
                            webClientPort: this.state.webClientPort
                        }
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg,
                            dialogStatus: DialogStatus.ErrorDialogAppear,
                            loadingStatus: false
                        })
                    }
                }
            }
        }
    }

    /**
     * 获取输入的 对象存储访问地址
     */
    protected async changeObjStorageAccessingAddress(value) {
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length !== 0) {
            this.setState({
                objectStorageAccessingAddress: value.trim(),
                objectStorageAccessingAddressStatus: ObjectStorageAccessingAddressStatus.Normal,
                isObjectStorageChanged: true
            })
        }
    }

    /**
     * 获取输入的web客户端访问https端口
     */
    protected async changeWebHttps(value) {
        const { webClientPort } = this.state
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length !== 0) {
            this.setState({
                webClientPort: {
                    ...webClientPort,
                    https: value.trim(),
                },
                webClientHttpsStatus: WebHttpValidateState.Normal,
                isAppServiceChanged: true
            })
        }
    }

    /**
     * 获取输入的web客户端访问http端口
     */
    protected async changeWebHttp(value) {
        const { webClientPort } = this.state
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length !== 0) {
            this.setState({
                webClientPort: {
                    ...webClientPort,
                    http: value.trim(),
                },
                webClientHttpStatus: WebHttpValidateState.Normal,
                isAppServiceChanged: true
            })
        }
    }

    /**
     * 验证输入的http或者https端口号是是否合法
     */
    private isPortValidate(value) {
        const port = Number(value)
        if (port !== Math.floor(value)) {
            return false
        }
        return port >= 1 && port <= 65535
    }

    /**
     * 获取输入的对象存储http端口
     */
    protected async changeObjHttp(value) {
        const { objStorePort } = this.state
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length !== 0) {
            this.setState({
                objStorePort: {
                    ...objStorePort,
                    http: value.trim(),
                },
                objStorageHttpStatus: ObjHttpsValidateState.Normal,
                isObjectStorageChanged: true
            })
        }
    }

    /**
     * 获取输入的对象存储https端口
     */
    protected async changeObjHttps(value) {
        const { objStorePort } = this.state
        const appNodeInfo = await this.getAppNodeInfo()

        if (appNodeInfo.length !== 0) {
            this.setState({
                objStorePort: {
                    ...objStorePort,
                    https: value.trim(),
                },
                objStorageHttpsStatus: ObjHttpsValidateState.Normal,
                isObjectStorageChanged: true
            })
        }
    }

    /**
     * 对象存储点击保存触发事件
     */
    protected async completeObjectStorage() {
        if (!(
            (this.isIpValidate(this.state.objectStorageAccessingAddress)
                || this.isDomainNameValidate(this.state.objectStorageAccessingAddress))
            && this.isPortValidate(this.state.objStorePort.http)
            && this.isPortValidate(this.state.objStorePort.https)
        )) {
            let objectStorageAccessingAddressStatusTemp = this.state.objectStorageAccessingAddressStatus
            let objStorageHttpsStatusTemp = this.state.objStorageHttpsStatus
            let objStorageHttpStatusTemp = this.state.objStorageHttpStatus
            if (!(this.isIpValidate(this.state.objectStorageAccessingAddress))) {
                if (this.state.objectStorageAccessingAddress === '') {
                    objectStorageAccessingAddressStatusTemp = ObjectStorageAccessingAddressStatus.Empty
                } else {
                    if (this.isAddressIncludeEnLetter(this.state.objectStorageAccessingAddress)) {
                        if (this.isDomainNameValidate(this.state.objectStorageAccessingAddress)) {
                            objectStorageAccessingAddressStatusTemp = ObjectStorageAccessingAddressStatus.Normal
                        } else {
                            objectStorageAccessingAddressStatusTemp = ObjectStorageAccessingAddressStatus.ErrorEnglishLetter
                        }
                    } else {
                        objectStorageAccessingAddressStatusTemp = ObjectStorageAccessingAddressStatus.ErrorNoEnglish
                    }
                }
            }

            if (!this.isPortValidate(this.state.objStorePort.https)) {
                this.state.objStorePort.https === '' ?
                    objStorageHttpsStatusTemp = ObjHttpsValidateState.Empty
                    : objStorageHttpsStatusTemp = ObjHttpsValidateState.InputError
            }
            if (!this.isPortValidate(this.state.objStorePort.http)) {
                this.state.objStorePort.http === '' ?
                    objStorageHttpStatusTemp = ObjHttpValidateState.Empty
                    : objStorageHttpStatusTemp = ObjHttpValidateState.InputError
            }
            this.setState({
                objectStorageAccessingAddressStatus: objectStorageAccessingAddressStatusTemp,
                objStorageHttpsStatus: objStorageHttpsStatusTemp,
                objStorageHttpStatus: objStorageHttpStatusTemp
            })
        } else {
            // 如果点击保存时，端口并没有改变，那并不向后端提供的接口传入数据,也不需要向用户做任何提示
            if (!
                (Number(this.state.objStorePort.http) === Number(this.lastObjectStorageConfig.objStorePort.http)
                    && Number(this.state.objStorePort.https) === Number(this.lastObjectStorageConfig.objStorePort.https)
                    && (this.state.objectStorageAccessingAddress === this.lastObjectStorageConfig.objectStorageAccessingAddress)
                )) {
                // 在 地址 https http 中，如果只有地址发生了更改，那弹出保存成功提示且记录地址相关日志
                if (this.state.objectStorageAccessingAddress !== this.lastObjectStorageConfig.objectStorageAccessingAddress
                    && (
                        Number(this.state.objStorePort.http) === Number(this.lastObjectStorageConfig.objStorePort.http)
                        && Number(this.state.objStorePort.https) === Number(this.lastObjectStorageConfig.objStorePort.https)
                    )
                ) {
                    // 点击了保存之后，要冻结整个界面，用添加转圈圈的方式冻结界面
                    this.setState({
                        loadingStatus: true
                    })

                    try {
                        await createShareMgntClient({ ip: await this.getAppIp() }).SetEossHostName(this.state.objectStorageAccessingAddress)

                        // 保存成功,保存/取消 按钮消失
                        this.setState({
                            isObjectStorageChanged: false,
                            loadingStatus: false
                        })
                        this.context.toast(__('保存成功。'), { code: "\uf02f", size: 24, color: 'green' })
                        // 记日志
                        manageLog({
                            level: ncTLogLevel['NCT_LL_INFO'],
                            opType: ncTManagementType['NCT_MNT_SET'],
                            msg: __('设置 对象存储 访问地址 成功'),
                            exMsg: __('对象存储 访问地址：${objectStorageAccessingAddress}', {
                                'objectStorageAccessingAddress': this.state.objectStorageAccessingAddress,
                            })
                        })

                        this.lastObjectStorageConfig = {
                            objectStorageAccessingAddress: this.state.objectStorageAccessingAddress,
                            objStorePort: this.state.objStorePort
                        }
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg,
                            dialogStatus: DialogStatus.ErrorDialogAppear,
                        })
                    }
                } else {
                    this.setState({
                        loadingStatus: true
                    })

                    // 如果 https/http 发生了更改，那会触发更新防火墙规则的函数，然后会处理 保存成功 及 日志记录的事情
                    try {
                        await createShareMgntClient({ ip: await this.getAppIp() }).SetEossHostName(this.state.objectStorageAccessingAddress)
                        await createShareMgntClient({ ip: await this.getAppIp() }).SetGlobalEOSSPort(new ncTEOSSPortInfo({ httpPort: Number(this.state.objStorePort.http), httpsPort: Number(this.state.objStorePort.https) }))

                        // 保存成功,保存/取消 按钮消失
                        this.setState({
                            isObjectStorageChanged: false,
                            loadingStatus: false
                        })
                        // 记日志
                        // 当地址发生改变时只记录地址部分日志，端口日志会在更新防火墙规则之后再记录
                        this.state.objectStorageAccessingAddress !== this.lastObjectStorageConfig.objectStorageAccessingAddress ?
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_SET'],
                                msg: __('设置 对象存储 访问地址 成功'),
                                exMsg: __('对象存储 访问地址：${objectStorageAccessingAddress}', {
                                    'objectStorageAccessingAddress': this.state.objectStorageAccessingAddress,
                                })
                            })
                            : null

                        this.props.changeAppConfigObjPorts(
                            Number(this.state.objStorePort.https),
                            Number(this.state.objStorePort.http),
                            Number(this.lastObjectStorageConfig.objStorePort.https),
                            Number(this.lastObjectStorageConfig.objStorePort.http),
                        )
                        this.lastObjectStorageConfig = {
                            objectStorageAccessingAddress: this.state.objectStorageAccessingAddress,
                            objStorePort: this.state.objStorePort
                        }
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg,
                            dialogStatus: DialogStatus.ErrorDialogAppear,
                            loadingStatus: false
                        })
                    }
                }
            }
        }
    }

    /**
     * 关闭弹窗触发事件
     */
    protected closeDialog() {
        this.setState({
            dialogStatus: DialogStatus.None
        })
    }

    /**
     * 应用服务取消按钮点击时触发事件
     */
    protected cancelAppService() {
        this.setState({
            appServiceAccessingAddress: this.lastAppServiceConfig.appServiceAccessingAddress,
            webClientPort: this.lastAppServiceConfig.webClientPort,
            appServiceAccessingAddressStatus: this.defaultValidateBoxStatus.appServiceAccessingAddressStatus,
            webClientHttpsStatus: this.defaultValidateBoxStatus.webClientHttps,
            webClientHttpStatus: this.defaultValidateBoxStatus.webClientHttp,
            isAppServiceChanged: false,
        })
    }

    /**
     * 对象存储取消按钮点击时触发事件
     */
    protected cancelObjectStorage() {
        this.setState({
            objectStorageAccessingAddress: this.lastObjectStorageConfig.objectStorageAccessingAddress,
            objStorePort: this.lastObjectStorageConfig.objStorePort,
            objectStorageAccessingAddressStatus: this.defaultValidateBoxStatus.objectStorageAccessingAddressStatus,
            objStorageHttpsStatus: this.defaultValidateBoxStatus.objStorageHttps,
            objStorageHttpStatus: this.defaultValidateBoxStatus.objStorageHttp,
            isObjectStorageChanged: false,
        })
    }

    /**
     * 记日志
     * @param updateSuccess 规则更新成功的旧的端口号
     */
    private recordLog(updateSuccess) {
        const { webClientPort, objStorePort } = this.state

        // 记日志
        // 记录被更新成功部分的日志
        if (updateSuccess[0][0] === 'webClientHttp' || updateSuccess[0][0] === 'webClientHttps') {
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('设置 应用服务 访问地址 成功'),
                exMsg: updateSuccess.length === 1 ?
                    updateSuccess[0][0] === 'webClientHttps' ?
                        __('Web客户端访问https：${webClientPortHttps}', {
                            'webClientPortHttps': Number(webClientPort.https)
                        }) : __('Web客户端访问http：${webClientPortHttp}', {
                            'webClientPortHttp': Number(webClientPort.http)
                        })
                    : __('Web客户端访问https：${webClientPortHttps}，Web客户端访问http：${webClientPortHttp}', {
                        'webClientPortHttps': Number(webClientPort.https),
                        'webClientPortHttp': Number(webClientPort.http)
                    })
            })
        } else {
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('设置 对象存储 访问地址 成功'),
                exMsg: updateSuccess.length === 1 ?
                    updateSuccess[0][0] === 'objStorageHttps' ?
                        __('对象存储https：${objStorePortHttps}', {
                            'objStorePortHttps': Number(objStorePort.https),
                        })
                        : __('对象存储http：${objStorePortHttp}', {
                            'objStorePortHttp': Number(objStorePort.http)
                        })
                    : __('对象存储https：${objStorePortHttps}，对象存储http：${objStorePortHttp}', {
                        'objStorePortHttps': Number(objStorePort.https),
                        'objStorePortHttp': Number(objStorePort.http)
                    })
            })
        }
    }

    /**
     * 当由于更改端口而更新防火墙规则，且防火墙规则更新失败时，还原端口值为最近一次可用的端口信息
     */
    private async returnToOriginalData(updateFail) {
        const { webClientPort, objStorePort } = this.state

        if (updateFail[0][0] === 'webClientHttp' || updateFail[0][0] === 'webClientHttps') {
            let webClientPortHttpsReturned = webClientPort.https,
                webClientPortHttpReturned = webClientPort.http

            if (updateFail.length === 1) {
                webClientPortHttpsReturned = updateFail[0][0] === 'webClientHttps' ? updateFail[0][1] : webClientPortHttpsReturned
                webClientPortHttpReturned = updateFail[0][0] === 'webClientHttp' ? updateFail[0][1] : webClientPortHttpReturned
            } else {
                webClientPortHttpsReturned = updateFail[0][0] === 'webClientHttps' ? updateFail[0][1] : updateFail[1][1]
                webClientPortHttpReturned = updateFail[0][0] === 'webClientHttp' ? updateFail[0][1] : updateFail[1][1]
            }

            try {
                // 在数据库和界面进行数据返回
                await createShareMgntClient({ ip: await this.getAppIp() }).SetGlobalPort(Number(webClientPortHttpReturned), Number(webClientPortHttpsReturned))
                this.setState({
                    webClientPort: {
                        https: webClientPortHttpsReturned,
                        http: webClientPortHttpReturned
                    }
                })
                // 更新最近一次保存成功的值
                this.lastAppServiceConfig = {
                    ...this.lastAppServiceConfig,
                    webClientPort: {
                        https: webClientPortHttpsReturned,
                        http: webClientPortHttpReturned
                    }
                }
            } catch (ex) {
                this.setState({
                    errorMessage: ex.expMsg,
                    dialogStatus: DialogStatus.ErrorDialogAppear
                })
            }
        } else {
            let objStorePortHttpsReturned = objStorePort.https,
                objStorePortHttpReturned = objStorePort.http

            if (updateFail.length === 1) {
                objStorePortHttpsReturned = updateFail[0][0] === 'objStorageHttps' ? updateFail[0][1] : objStorePortHttpsReturned
                objStorePortHttpReturned = updateFail[0][0] === 'objStorageHttp' ? updateFail[0][1] : objStorePortHttpReturned
            } else {
                objStorePortHttpsReturned = updateFail[0][0] === 'objStorageHttps' ? updateFail[0][1] : updateFail[1][1]
                objStorePortHttpReturned = updateFail[0][0] === 'objStorageHttp' ? updateFail[0][1] : updateFail[1][1]
            }

            try {
                await createShareMgntClient({ ip: await this.getAppIp() }).SetGlobalEOSSPort(new ncTEOSSPortInfo({ httpPort: Number(objStorePortHttpReturned), httpsPort: Number(objStorePortHttpsReturned) }))
                this.setState({
                    objStorePort: {
                        ...objStorePort,
                        https: objStorePortHttpsReturned,
                        http: objStorePortHttpReturned
                    }
                })
                // 更新最近一次保存成功的值                
                this.lastObjectStorageConfig = {
                    ...this.lastObjectStorageConfig,
                    objStorePort: {
                        https: objStorePortHttpsReturned,
                        http: objStorePortHttpReturned
                    }
                }
            } catch (ex) {
                this.setState({
                    errorMessage: ex.expMsg,
                    dialogStatus: DialogStatus.ErrorDialogAppear
                })
            }
        }
    }

    /**
     * 根据更新防火墙是否成功状态，确定记录日志还是还原数据
     */
    protected recodeLogOrReturnData(updateSuccess, updateFail, shouldUpdateCount) {
        if (shouldUpdateCount !== 0) {
            // 只有当没有规则更新失败时才提示保存成功 
            if (updateFail.length === 0) {
                this.context.toast(__('保存成功。'), { code: "\uf02f", size: 24, color: 'green' })
            }

            // 只要有规则更新成功，就记录日志
            updateSuccess.length !== 0 ?
                this.recordLog(updateSuccess)
                : null

            // 只要有规则更新失败，就要将更新失败的数据在界面和数据库进行回退
            updateFail.length !== 0 ?
                this.returnToOriginalData(updateFail)
                : null
        }
    }
}
