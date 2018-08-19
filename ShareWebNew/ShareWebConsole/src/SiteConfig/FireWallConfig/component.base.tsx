import * as React from 'react';
import { values } from 'lodash';
import '../../../gen-js/ECMSManager_types';
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import { IP, subNetMask } from '../../../util/validators/validators'
import WebComponent from '../../webcomponent';
import { transformDataGridRoleSys, transformDataGridSourceNet, transformServicePortInfo } from './helper';
import __ from './locale';

export enum ServicePortInfoValidateState {
    /**
     * 输入合法
     */
    Normal,

    /**
     * 输入非法
     */
    Error
}

export enum PortDescInfoValidate {
    Normal,
    Error
}

export enum SourceIpInfoValidate {
    Normal,
    Error
}

export enum SubnetMaskInfoValidate {
    Normal,
    Error
}

export enum ShowAccessingRuleDialogStatus {
    /**
     * 添加规则和编辑规则弹窗都不出现
     */
    None,

    /**
     * 添加规则弹窗出现
     */
    AddAccessingDialogAppear,

    /**
     * 编辑规则弹窗出现
     */
    EditAccessingDialogAppear,

    /**
     * 删除规则时警告提示弹窗出现
     */
    DeleteAccessingConfirmDialogAppear,

    /**
     * 添加/编辑/删除 出错时，错误弹窗出现
     */
    ErrorDialogAppear
}

export enum ErrorMsgType {
    /**
     * 正常情况,没有 ErrorDialog 的情况
     */
    None,

    /**
     * 添加 失败时
     */
    AddError,

    /**
     * 编辑 失败时
     */
    EditError,

    /**
     * 删除 失败时
     */
    DeleteError,

    /**
     * 更新 失败时
     */
    UpdateError,

    /**
     * 开启防火墙 失败时
     */
    OpenFireWallError,

    /**
     * 关闭防火墙 失败时
     */
    CloseFireWallError
}

export enum ProgressType {
    /**
     * 没有 ProgressCircle 
     */
    None,

    /**
     * 正在添加防火墙规则
     */
    Adding,

    /**
     * 正在编辑规则防火墙规则
     */
    Editing,

    /**
     * 正在删除防火墙规则
     */
    Deleting,

    /**
     * 正在更新访问规则
     */
    Updating,

    /**
     * 正在开启防火墙
     */
    Opening,

    /**
     * 正在关闭防火墙
     */
    Closing
}

export default class FireWallConfigBase extends WebComponent<Console.FireWallConfig.Props, Console.FireWallConfig.State> {
    static contextTypes = {
        toast: React.PropTypes.any
    }

    static defaultProps = {

    }

    state = {
        fireWallStatus: true,
        record: null,
        errorMsg: '',
        errorMsgTitle: ErrorMsgType.None,
        validateState: {
            servicePortInfo: ServicePortInfoValidateState.Normal,
            portDescInfo: PortDescInfoValidate.Normal,
            sourceIpInfo: SourceIpInfoValidate.Normal,
            subnetMaskInfo: SubnetMaskInfoValidate.Normal,
        },
        showAccessingRuleDialog: ShowAccessingRuleDialogStatus.None,
        fireWallAccessingRules: [],
        missingAppPorts: [],
        progressCircleTips: ProgressType.None,
    }
    oldRecord = null
    fireWallStatus = false

    componentWillMount() {
        this.initFireWallRules()
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.portsFromAppConfig.webClientHttps !== this.props.oldAppPortsFromAppConfig.webClientHttps
            || nextProps.portsFromAppConfig.webClientHttp !== this.props.oldAppPortsFromAppConfig.webClientHttp
            || nextProps.portsFromAppConfig.objStorageHttps !== this.props.oldAppPortsFromAppConfig.objStorageHttps
            || nextProps.portsFromAppConfig.objStorageHttp !== this.props.oldAppPortsFromAppConfig.objStorageHttp
        ) {
            this.initFireWallRules()
        }
    }

    /**
     * 更新防火墙列表信息
     */
    protected async updateFireWallRules(oldAppPorts, currentAppPorts) {
        const oldPortsMap = _.pairs(oldAppPorts)
        let updateSuccess = [],
            updateFail = [],
            shouldUpdateCount = 0

        await this.state.fireWallAccessingRules.reduce(async (prePromise, item, index) => {
            const pre = await prePromise
            const oldPortMap = oldPortsMap.find(([key, port]) => port === item.port)
            const shouldUpdate = oldPortMap && (item.role_sys === 'app' || item.role_sys === 'storage') && currentAppPorts[oldPortMap[0]] !== oldPortMap[1]

            if (shouldUpdate) {
                shouldUpdateCount++

                this.setState({
                    progressCircleTips: ProgressType.Updating
                })
                try {
                    const newRule = { ...item, port: currentAppPorts[oldPortMap[0]] }
                    await ECMSManagerClient.update_firewall_rule(new ncTFirewallInfo(item), new ncTFirewallInfo(newRule))

                    const nextFireWallAccessingRules = [...pre, newRule, ...this.state.fireWallAccessingRules.slice(index + 1)]
                    const missingAppPorts = await this.getPortMissing(nextFireWallAccessingRules)

                    this.setState({
                        fireWallAccessingRules: nextFireWallAccessingRules,
                        missingAppPorts,
                        progressCircleTips: ProgressType.None
                    })
                    updateSuccess.push(oldPortMap)

                    return [...pre, newRule]
                } catch (ex) {
                    this.setState({
                        showAccessingRuleDialog: ShowAccessingRuleDialogStatus.ErrorDialogAppear,
                        errorMsgTitle: ErrorMsgType.UpdateError,
                        errorMsg: ex.expMsg,
                        progressCircleTips: ProgressType.None
                    })
                    updateFail.push(oldPortMap)

                    return [...pre, item]
                }
            }
            return [...pre, item]
        }, Promise.resolve([]))

        this.props.fireWallUpdateStatus(updateSuccess, updateFail, shouldUpdateCount)
    }

    /**
     * 获取防火墙规则，并将缺少的端口信息存到 missingAppPorts state 状态中
     */
    private async initFireWallRules() {
        // 初始化防火墙列表信息
        const [
            fireWallStatus,
            dbFireWallRule,
            basicFireWallRule,
            ecmsFireWallRule,
            storageFireWallRule,
            appFireWallRule
        ] = await Promise.all([
            ECMSManagerClient.get_firewall_status(),
            ECMSManagerClient.get_firewall_rule('db'),
            ECMSManagerClient.get_firewall_rule('basic'),
            ECMSManagerClient.get_firewall_rule('ecms'),
            ECMSManagerClient.get_firewall_rule('storage'),
            ECMSManagerClient.get_firewall_rule('app')
        ])

        let portMissing = await this.getPortMissing([...ecmsFireWallRule, ...appFireWallRule, ...storageFireWallRule, ...dbFireWallRule, ...basicFireWallRule])

        this.setState({
            fireWallStatus,
            fireWallAccessingRules: [...ecmsFireWallRule, ...appFireWallRule, ...storageFireWallRule, ...dbFireWallRule, ...basicFireWallRule],
            missingAppPorts: portMissing
        })
    }

    /**
     * 获取到缺少的端口号，并存放到一个 state 状态中
     */
    private async getPortMissing(fireWallAccessingRules) {
        // 将 app 和 storage 两个子系统的端口过滤出来放到 const 中，然后再从这两个子系统中找缺少的端口是什么
        const appRules = fireWallAccessingRules.filter(rule => rule.role_sys === 'app')
        const storageRules = fireWallAccessingRules.filter(rule => rule.role_sys === 'storage')
        const appNodeInfo = await ECMSManagerClient.get_app_node_info()
        let appShouldUpdatePorts: Array<number> = []
        let storageShouldUpdatePorts: Array<number> = []

        // 如果应用节点没有开启，那 Web客户端访问 和 对象存储 的四个端口都为空，此时，无论防火墙规则如何删除/编辑/添加 添加访问规则右侧端口提示文字都不会出现
        if (appNodeInfo.length !== 0) {
            appShouldUpdatePorts = [this.props.portsFromAppConfig.webClientHttps, this.props.portsFromAppConfig.webClientHttp].filter(item => {
                return !(appRules.some(rule => rule.port === item))
            })
        }
        if (appNodeInfo.length !== 0) {
            storageShouldUpdatePorts = [this.props.portsFromAppConfig.objStorageHttps, this.props.portsFromAppConfig.objStorageHttp].filter(item => {
                return !(storageRules.some(rule => rule.port === item))
            })
        }
        return [...appShouldUpdatePorts, ...storageShouldUpdatePorts]
    }

    /**
     * 如果数据 record 这个对象中的端口号为 8080,则这个端口号不可编辑或者删除,所以去掉 编辑 删除的图标
     */
    protected isDataGridOperationUIIconDisplay(record) {
        return record.port === 8080 ? false : true
    }

    /**
     * 初始化添加访问规则
     */
    protected initAddRule() {
        if (this.state.fireWallStatus) {
            this.setState({
                showAccessingRuleDialog: ShowAccessingRuleDialogStatus.AddAccessingDialogAppear,
                record: {
                    role_sys: 'basic',
                    port: '',
                    protocol: 'tcp',
                    service_desc: '',
                    source_net: '',
                }
            })
            this.initValidateBox()
        }
    }

    /**
     * 初始化编辑访问规则
     */
    protected initEditRule(record) {
        this.setState({
            showAccessingRuleDialog: ShowAccessingRuleDialogStatus.EditAccessingDialogAppear,
            record,
        })
        this.initValidateBox()
        this.oldRecord = record
    }

    /**
     * 初始化 ValidateBox 状态
     */
    private initValidateBox() {
        this.setState({
            validateState: {
                servicePortInfo: ServicePortInfoValidateState.Normal,
                portDescInfo: PortDescInfoValidate.Normal,
                sourceIpInfo: SourceIpInfoValidate.Normal,
                subnetMaskInfo: SubnetMaskInfoValidate.Normal,
            }
        })
    }

    /**
     * 更新 role_sys 的值
     */
    protected updateRoleSys(value) {
        let { record } = this.state
        this.setState({
            record: {
                ...record,
                role_sys: value
            }
        })
    }

    /**
     * 更新 port 值
     */
    protected updatePort(value) {
        let { validateState, record } = this.state
        if (value !== '') {
            this.setState({
                record: {
                    ...record,
                    port: value
                },
                validateState: {
                    ...validateState,
                    servicePortInfo: ServicePortInfoValidateState.Normal,
                }
            })
            // 当 服务端口为空时,端口协议 为空&&灰化&&如果有错误提示则错误消失
        } else {
            this.setState({
                record: {
                    ...record,
                    port: value,
                    service_desc: '',
                },
                validateState: {
                    ...validateState,
                    servicePortInfo: ServicePortInfoValidateState.Normal,
                    portDescInfo: PortDescInfoValidate.Normal,
                }
            })
        }
    }

    /**
     * 更新 Protocol 值
     */
    protected updateProtocol(value) {
        let { record } = this.state
        this.setState({
            record: {
                ...record,
                protocol: value
            }
        })
    }

    /**
     * 验证输入的http或者https端口号是否合法
     */
    private isPortValidate(value) {
        const port = Number(value)
        if (port !== Math.floor(value)) {
            return false
        }
        if (value === '') {
            return true
        }
        return port >= 1 && port <= 65535
    }

    /**
     * 验证输入的端口描述信息是否合法
     */
    protected isPortDescValidate(value) {
        return value.length <= 100 ? true : false
    }

    /**
     * 验证 源IP 是否合法,空为合法
     * @param ip 源IP
     */
    private isIpValidate(ip) {
        if (ip === '') {
            return true
        }
        return IP(ip)
    }

    /**
     * 验证 子网掩码 是否合法,空为合法
     * @param subMask 子网掩码
     */
    private isSubNetMaskValidate(subMask) {
        if (subMask === '') {
            return true
        }
        return subNetMask(subMask)
    }

    /**
     * 添加访问规则/编辑访问规则 完成事件
     */
    protected async completeAccessingRuleDialog() {
        let { validateState } = this.state
        let validateStateTemp = validateState

        if (!this.isPortValidate(this.state.record.port)) {
            validateStateTemp = {
                ...validateStateTemp,
                servicePortInfo: ServicePortInfoValidateState.Error,
            }
        }
        if (!this.isPortDescValidate(this.state.record.service_desc)) {
            validateStateTemp = {
                ...validateStateTemp,
                portDescInfo: PortDescInfoValidate.Error,
            }
        }
        if (!this.isIpValidate(this.getSourceIp(this.state.record.source_net))) {
            validateStateTemp = {
                ...validateStateTemp,
                sourceIpInfo: SourceIpInfoValidate.Error,
            }
        }
        if (!this.isSubNetMaskValidate(this.getSubNet(this.state.record.source_net))) {
            validateStateTemp = {
                ...validateStateTemp,
                subnetMaskInfo: SubnetMaskInfoValidate.Error,
            }
        }
        if (this.state.record.port === '') {
            validateStateTemp = {
                ...validateStateTemp,
                servicePortInfo: ServicePortInfoValidateState.Normal,
            }
        }
        if (this.getSourceIp(this.state.record.source_net) === '' || this.getSubNet(this.state.record.source_net) === '') {
            validateStateTemp = {
                ...validateStateTemp,
                sourceIpInfo: SourceIpInfoValidate.Normal,
                subnetMaskInfo: SubnetMaskInfoValidate.Normal,
            }
        }

        this.setState({
            validateState: validateStateTemp
        })

        // 当输入都合法的时候，点击【确定】，调用后端接口并向接口传入数据
        if (
            this.isPortValidate(this.state.record.port)
            && this.isPortDescValidate(this.state.record.service_desc)
            && this.isIpValidate(this.getSourceIp(this.state.record.source_net))
            && this.isSubNetMaskValidate(this.getSubNet(this.state.record.source_net))
        ) {
            // 添加防火墙规则的时候，ip 和 子网掩码是分别输入的，传入参数的时候需要将两个输入合并为一个参数传入
            const source_net_temp = this.getSourceNet()
            const paramsObjTemp = {
                role_sys: (this.state.record.role_sys || 'basic'),
                port: Number(this.state.record.port),
                protocol: this.state.record.protocol,
                service_desc: this.state.record.service_desc,
                source_net: source_net_temp,
                dest_net: '',
            }
            // 添加成功，则刷新列表，并且记录管理日志；添加失败，弹出错误提示窗口
            if (this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.AddAccessingDialogAppear) {
                this.setState({
                    showAccessingRuleDialog: ShowAccessingRuleDialogStatus.None,
                    progressCircleTips: ProgressType.Adding
                })
                try {
                    await ECMSManagerClient.add_firewall_rule(new ncTFirewallInfo(paramsObjTemp))

                    let fireWallAccessingRulesTemp = this.state.fireWallAccessingRules
                    fireWallAccessingRulesTemp.splice(
                        1,
                        0,
                        paramsObjTemp
                    )
                    this.setState({
                        fireWallAccessingRules: fireWallAccessingRulesTemp,
                        progressCircleTips: ProgressType.None,
                        missingAppPorts: await this.getPortMissing(fireWallAccessingRulesTemp)
                    })
                    // 添加成功，记录管理日志
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('添加 访问规则 成功'),
                        exMsg: __('所属子系统：${role_sys}，端口：${port}，端口描述：${service_desc}，协议：${protocol}，源IP/掩码：${source_net_temp}', {
                            'role_sys': transformDataGridRoleSys(this.state.record.role_sys),
                            'port': transformServicePortInfo(this.state.record.port),
                            'service_desc': this.state.record.service_desc,
                            'protocol': this.state.record.protocol,
                            'source_net_temp': transformDataGridSourceNet(source_net_temp)
                        })
                    })
                } catch (ex) {
                    this.setState({
                        showAccessingRuleDialog: ShowAccessingRuleDialogStatus.ErrorDialogAppear,
                        errorMsgTitle: ErrorMsgType.AddError,
                        errorMsg: ex.expMsg,
                        progressCircleTips: ProgressType.None
                    })
                }
            }

            // 编辑成功，则刷新列表，并且记录管理日志；编辑失败，弹出错误提示窗口
            if (this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.EditAccessingDialogAppear) {
                this.setState({
                    progressCircleTips: ProgressType.Editing,
                    showAccessingRuleDialog: ShowAccessingRuleDialogStatus.None,
                })
                try {
                    await ECMSManagerClient.update_firewall_rule(new ncTFirewallInfo(this.oldRecord), new ncTFirewallInfo(paramsObjTemp))

                    let fireWallAccessingRulesTemp = this.state.fireWallAccessingRules.reduce((preInfo, currentValue) => {
                        return currentValue.port === this.oldRecord.port ? [...preInfo, paramsObjTemp] : [...preInfo, currentValue]
                    }, [])

                    this.setState({
                        fireWallAccessingRules: fireWallAccessingRulesTemp,
                        progressCircleTips: ProgressType.None,
                        missingAppPorts: await this.getPortMissing(fireWallAccessingRulesTemp)
                    })
                    // 编辑成功，记录管理日志   
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('编辑 访问规则 成功'),
                        exMsg: __('所属子系统：${role_sys}，端口：${port}，端口描述：${service_desc}，协议：${protocol}，源IP/掩码：${source_net_temp}', {
                            'role_sys': transformDataGridRoleSys(this.state.record.role_sys),
                            'port': transformServicePortInfo(this.state.record.port),
                            'service_desc': this.state.record.service_desc,
                            'protocol': this.state.record.protocol,
                            'source_net_temp': transformDataGridSourceNet(source_net_temp)
                        })
                    })
                } catch (ex) {
                    this.setState({
                        showAccessingRuleDialog: ShowAccessingRuleDialogStatus.ErrorDialogAppear,
                        errorMsgTitle: ErrorMsgType.EditError,
                        errorMsg: ex.expMsg,
                        progressCircleTips: ProgressType.None
                    })
                }
            }
        }
    }

    /**
     * 更新 record 值
     */
    protected updateServiceDesc(value) {
        let { validateState, record } = this.state

        this.setState({
            record: {
                ...record,
                service_desc: value,
            },
            validateState: {
                ...validateState,
                portDescInfo: PortDescInfoValidate.Normal,
            }
        })
    }

    /**
     * 由于 sourceIp 发生改变而更新 sourceNet 值
     */
    protected updateSourceNetFromSourceIp(value) {
        let { validateState, record } = this.state

        // 如果源IP输入为空，则子网掩码灰化并且是内容为空&&灰化&&如果之前有错误提示的，错误提示要消失
        if (value === '') {
            this.setState({
                record: {
                    ...record,
                    source_net: '',
                },
                validateState: {
                    ...validateState,
                    sourceIpInfo: SourceIpInfoValidate.Normal,
                    subnetMaskInfo: SubnetMaskInfoValidate.Normal,
                }
            })
        } else {
            this.setState({
                record: {
                    ...record,
                    source_net: this.getSourceNetFromSourceIp(value)
                },
                validateState: {
                    ...validateState,
                    sourceIpInfo: SourceIpInfoValidate.Normal,
                }
            })
        }
    }

    /**
     * 由于 subNet 改变而更改 sourceNet
     */
    protected updateSourceNetFromSubNet(value) {
        let { validateState, record } = this.state

        this.setState({
            record: {
                ...record,
                source_net: this.getSourceNetFromSubNet(value)
            },
            validateState: {
                ...validateState,
                subnetMaskInfo: SubnetMaskInfoValidate.Normal,
            }
        })
    }

    /**
     * 当用户点击删除编辑规则并确定删除时，列表中应该更新状态
     * 若删除失败，则出现错误提示的弹窗
     */
    protected async completeConfirmDialog() {
        try {
            this.setState({
                showAccessingRuleDialog: ShowAccessingRuleDialogStatus.None,
                progressCircleTips: ProgressType.Deleting
            })
            await ECMSManagerClient.del_firewall_rule(new ncTFirewallInfo(this.oldRecord))
            let fireWallAccessingRulesTemp = this.state.fireWallAccessingRules.filter(item => {
                return (item.port === this.oldRecord.port && item.protocol === this.oldRecord.protocol) ? false : true
            })

            this.setState({
                fireWallAccessingRules: fireWallAccessingRulesTemp,
                progressCircleTips: ProgressType.None,
                missingAppPorts: await this.getPortMissing(fireWallAccessingRulesTemp)

            })
            // 删除成功,记录管理日志
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('删除 访问规则 成功'),
                exMsg: __('所属子系统：${role_sys}，端口：${port}，端口描述：${service_desc}，协议：${protocol}，源IP/掩码：${source_net_temp}', {
                    'role_sys': transformDataGridRoleSys(this.oldRecord.role_sys),
                    'port': transformServicePortInfo(this.oldRecord.port),
                    'service_desc': this.oldRecord.service_desc,
                    'protocol': this.oldRecord.protocol,
                    'source_net_temp': transformDataGridSourceNet(this.oldRecord.source_net)
                })
            })
        } catch (ex) {
            this.setState({
                showAccessingRuleDialog: ShowAccessingRuleDialogStatus.ErrorDialogAppear,
                errorMsgTitle: ErrorMsgType.DeleteError,
                errorMsg: ex.expMsg,
                progressCircleTips: ProgressType.None
            })
        }
    }

    /**
     * 点击删除图标时，渲染与删除操作有关的 state 状态值
     */
    protected async initDeleteDialog(record) {
        this.setState({
            showAccessingRuleDialog: ShowAccessingRuleDialogStatus.DeleteAccessingConfirmDialogAppear,
        })
        this.oldRecord = record
    }

    /**
     * 弹窗消失
     */
    protected dialogDisappear() {
        this.setState({
            showAccessingRuleDialog: ShowAccessingRuleDialogStatus.None
        })
    }

    /**
     * 当用户手动更改防火墙开关按钮时触发事件
     */
    protected async switchFirewall() {
        // 因为在 setState 之后 state 状态还没有立即更改，所以对现在的 fireWallStatus 进行取反然后调用后端接口和记录日志
        if (!this.state.fireWallStatus) {
            this.setState({
                progressCircleTips: ProgressType.Opening
            })
            try {
                await ECMSManagerClient.enable_firewall()
                this.setState({
                    fireWallStatus: await ECMSManagerClient.get_firewall_status(),
                    progressCircleTips: ProgressType.None

                })
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('启用 内置防火墙 成功'),
                    exMsg: ''
                })
            } catch (ex) {
                this.setState({
                    showAccessingRuleDialog: ShowAccessingRuleDialogStatus.ErrorDialogAppear,
                    errorMsgTitle: ErrorMsgType.OpenFireWallError,
                    errorMsg: ex.expMsg,
                    progressCircleTips: ProgressType.None
                })
            }
        } else {
            this.setState({
                progressCircleTips: ProgressType.Closing
            })
            try {
                await ECMSManagerClient.disable_firewall()
                this.setState({
                    fireWallStatus: await ECMSManagerClient.get_firewall_status(),
                    progressCircleTips: ProgressType.None
                })
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('关闭 内置防火墙 成功'),
                    exMsg: ''
                })
            } catch (ex) {
                this.setState({
                    showAccessingRuleDialog: ShowAccessingRuleDialogStatus.ErrorDialogAppear,
                    errorMsgTitle: ErrorMsgType.CloseFireWallError,
                    errorMsg: ex.expMsg,
                    progressCircleTips: ProgressType.None
                })
            }
        }
    }

    /**
     * 根据 source_net 获得源IP
     * @param source_net 源IP/掩码
     */
    protected getSourceIp(source_net) {
        return source_net ? source_net.split('/')[0] : ''
    }

    /**
     * 根据 source_net 获得掩码
     * @param source_net 源IP/掩码
     */
    protected getSubNet(source_net) {
        return source_net ? source_net.split('/')[1] : ''
    }

    /**
     * 根据 sourceIp 获得 source_net
     * @param sourceIp 源IP
     */
    protected getSourceNetFromSourceIp(sourceIp) {
        return sourceIp ? `${sourceIp}/${this.getSubNet(this.state.record.source_net)}` : ''
    }

    /**
     * 根据 subNet 获得 source_net
     * @param subNet 掩码
     */
    protected getSourceNetFromSubNet(subNet) {
        return subNet ? `${this.getSourceIp(this.state.record.source_net)}/${subNet}` : ''
    }

    /**
     * 不需要参数获取 source_net
     */
    private getSourceNet() {
        return this.state.record.source_net ? `${this.getSourceIp(this.state.record.source_net)}/${this.getSubNet(this.state.record.source_net)}` : ''
    }
}