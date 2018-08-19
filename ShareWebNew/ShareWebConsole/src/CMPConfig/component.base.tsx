import * as React from 'react';
import { ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { isDomain, IP, positiveInteger } from '../../util/validators/validators'
import WebComponent from '../webcomponent';
import __ from './locale';

export enum ValidateState {
    Normal,
    Empty,
    InvalidDomain,
    InvalidIp,
    InvalidPort
}

export const ValidateMessages = {
    [ValidateState.Empty]: __('此输入项不允许为空。'),
    [ValidateState.InvalidDomain]: __('域名只能包含 英文、数字 及 -. 字符，长度范围 3~100 个字符，请重新输入。'),
    [ValidateState.InvalidIp]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入。'),
    [ValidateState.InvalidPort]: __('端口号必须是 1~65535 之间的整数，请重新输入。'),
}

export const TestErrorType = {
    // 测试连接失败，指定的服务器无法访问
    CmpUnauthError: 22301,
    // 测试连接失败，指定的服务器连接失败
    CmpConnectError: 22302,
    // 租户账号或者租户密码错误
    CmpTenantError: 22311,
    // CMP平台已有该节点，不可重复接入
    CmpRepeatError: 22312,
    // 该节点已授权，不可用其他租户接入
    CmpAuthorizedError: 22313,
    // 请求超时
    CmpOvertime: 22314
}

export default class CMPConfigBase extends WebComponent<any, any> {
    state = {
        hostInfo: null,
        changed: false,
        tested: false,
        testSuccess: false,
        validateState: {
            host: ValidateState.Normal,
            port: ValidateState.Normal,
            tenantName: ValidateState.Normal,
            tenantPwd: ValidateState.Normal
        },
        testErrorCode: 0,
        saveErrorCode: 0
    }

    defaultHostInfo = {
        // CMP服务器地址
        host: '',

        // CMP服务器端口
        port: null,

        // CMP租户账号
        tenantName: '',

        // CMP租户密码
        tenantPwd: ''
    }

    componentWillMount() {
        this.getCMPConfig();
    }

    /**
     * 获取CMP服务器信息
     */
    async getCMPConfig() {
        let { host, port, tenantName, tenantPwd } = await ShareMgnt('CMP_GetHostInfo');
        this.defaultHostInfo = { ...this.defaultHostInfo, host, port, tenantName, tenantPwd };
        this.setState({ 
            hostInfo: { 
                host: this.defaultHostInfo.host, 
                port: this.defaultHostInfo.port, 
                tenantName: this.defaultHostInfo.tenantName,
                tenantPwd: this.defaultHostInfo.tenantPwd
            } 
        });
    }

    /**
     * 检查输入有效性
     */
    validateCheck() {
        let { hostInfo, validateState } = this.state;
        let validateHost = hostInfo.host && (isDomain(hostInfo.host) || IP(hostInfo.host));
        let validatePort = (hostInfo.port && positiveInteger(hostInfo.port) && hostInfo.port < 65536);
        let validatetenantName = hostInfo.tenantName;
        let validatePsw = hostInfo.tenantPwd;
        if (validateHost && validatePort && validatetenantName && validatePsw) {
            return true;
        } else {          
            this.setState({
                validateState: {
                    host: validateHost ? ValidateState.Normal : hostInfo.host ? /^(\d{1,3}(\.)?)+$/.test(hostInfo.host) ?
                        ValidateState.InvalidIp : ValidateState.InvalidDomain
                        : ValidateState.Empty,
                    port: validatePort ? ValidateState.Normal : hostInfo.port ? ValidateState.InvalidPort : ValidateState.Empty,
                    tenantName: validatetenantName ? ValidateState.Normal : ValidateState.Empty,
                    tenantPwd: validatePsw ? ValidateState.Normal : ValidateState.Empty
                }
            })
            return false;
        }
    }

    /**
     * 输入框输入值
     * @param hostInfo 输入值的属性
     */
    handleChange(hostInfo = {}) {
        let { validateState, tested } = this.state;
        this.setState({
            changed: true,
            hostInfo: { ...this.state.hostInfo, ...hostInfo },
            tested: ('host' in hostInfo && 'port' in hostInfo && 'tenantName' in hostInfo && 'tenantPwd' in hostInfo) ? false : tested,
            validateState: {
                host: 'host' in hostInfo ? ValidateState.Normal : validateState.host,
                port: 'port' in hostInfo ? ValidateState.Normal : validateState.port,
                tenantName: 'tenantName' in hostInfo ? ValidateState.Normal : validateState.tenantName,
                tenantPwd: 'tenantPwd' in hostInfo ? ValidateState.Normal : validateState.tenantPwd
            }
        })
    }

    /**
     * 测试CMP服务器连接
     */
    async handleTest() {
        if (this.validateCheck()) {
            this.setState({ tested: false })
            try {
                await ShareMgnt(
                    'CMP_Test', 
                    [{
                        ncTCMPHostInfo: {
                            host: this.state.hostInfo.host, 
                            port: Number(this.state.hostInfo.port),
                            tenantName: this.state.hostInfo.tenantName,
                            tenantPwd: this.state.hostInfo.tenantPwd
                        }
                    }]
                );
                this.setState({
                    tested: true,
                    testSuccess: true
                })
            } catch (ex) {
                if (ex && ex.error && ex.error.errID) {
                    this.setState({ testErrorCode: ex.error.errID, testSuccess: false });
                }
            } finally {
                this.setState({ tested: true });
            }
        }
    }

    /**
     * 设置CMP服务器信息
     */
    async handleSave() {
        let { hostInfo, validateState } = this.state;
        if (this.validateCheck()) {
            CoverLayer(1, __('正在设置......'));
            try {
                await ShareMgnt(
                    'CMP_SetHostInfo', 
                    [{
                        ncTCMPHostInfo: {
                            host: this.state.hostInfo.host, 
                            port: Number(this.state.hostInfo.port),
                            tenantName: this.state.hostInfo.tenantName,
                            tenantPwd: this.state.hostInfo.tenantPwd
                        }
                    }]
                );
                manageLog(
                    ManagementOps.SET, 
                    __('设置 CMP服务器配置 成功'), 
                    __('CMP"${host}", 租户账号"${tenantName}"', {'host': hostInfo.host, 'tenantName': hostInfo.tenantName}),
                    Level.INFO
                );
                this.defaultHostInfo = { 
                    ...this.defaultHostInfo, 
                    host: hostInfo.host, 
                    port: hostInfo.port,
                    tenantName: hostInfo.tenantName,
                    tenantPwd: hostInfo.tenantPwd 
                };
                this.setState({ changed: false });
            } catch (ex) {
                if (ex && ex.error && ex.error.errID) {
                    this.setState({ saveErrorCode: ex.error.errID });
                }
            } finally {
                this.setState({
                    tested: false,
                    validateState: {
                        host: ValidateState.Normal,
                        port: ValidateState.Normal,
                        tenantName: ValidateState.Normal,
                        tenantPwd: ValidateState.Normal
                    }
                });
            }
            CoverLayer(0);
        }
    }

    async confirmConfigError() {
        this.setState({ saveErrorCode: 0 });
    }

    handleCancel() {
        this.setState({
            hostInfo: { ...this.defaultHostInfo },
            validateState: {
                host: ValidateState.Normal,
                port: ValidateState.Normal,
                tenantName: ValidateState.Normal,
                tenantPwd: ValidateState.Normal
            },
            tested: false
        }, () => {
            this.setState({
                changed: false
            });
        });
    }
}