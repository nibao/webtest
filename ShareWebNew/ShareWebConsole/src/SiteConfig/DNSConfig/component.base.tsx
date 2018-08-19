import * as React from 'react';
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import WebComponent from '../../webcomponent';
import __ from './locale';

export enum ErrorDialogStatus {
    /**
     * 验证合法
     */
    None,

    /**
     * 错误弹窗出现
     */
    ErrorDialog,
}

export enum PreferredAddressStatus {
    /**
     * 输入验证合法
     */
    None,

    /**
     * DNS服务器首选地址不合法
     */
    PreferredAddressIllagel,
}

export enum FirstBackupAddressStatus {
    /**
     *  输入验证合法
     */
    None,

    /**
     * DNS服务器备选地址1不合法
     */
    FirstBackupAddressIllagel,
}

export enum SecondBackupAddressStatus {
    /**
     *  输入验证合法
     */
    None,

    /**
     * DNS服务器备选地址2不合法
     */
    SecondBackupAddressIllagel,
}

export default class DNSConfigBase extends WebComponent<Console.DNSConfig.Props, Console.DNSConfig.State> {
    /**
     * 最新一次保存成功的DNS服务器地址
     */
    lastDNSServerAddress = {
        preferredAddress: '',
        firstBackupAddress: '',
        secondBackupAddress: '',
    }

    static contextTypes = {
        toast: React.PropTypes.any
    }

    defaultProps = {

    }

    state = {
        preferredAddress: '',
        firstBackupAddress: '',
        secondBackupAddress: '',
        isDnsServerAddressChange: false,
        validateBoxStatus: {
            preferredAddressStatus: PreferredAddressStatus.None,
            firstBackupAddressStatus: FirstBackupAddressStatus.None,
            secondBackupAddressStatus: SecondBackupAddressStatus.None,
        },
        errorDialogStatus: ErrorDialogStatus.None,
        errorMsg: '',
    }

    async componentDidMount() {
        this.initDnsServerAddress()
    }

    /**
     * 初始化DNS服务器地址
     */
    private async initDnsServerAddress() {
        try {
            const dnsServerAddress = await ECMSManagerClient.get_dns_server()
            const [
                preferredAddress = '',
                firstBackupAddress = '',
                secondBackupAddress = ''
            ] = dnsServerAddress
            this.setState({
                preferredAddress,
                firstBackupAddress,
                secondBackupAddress,
            }, () => {
                this.updateDefaultDnsServerAddress()
            })
        } catch (ex) {
            this.setState({
                errorDialogStatus: ErrorDialogStatus.ErrorDialog,
                errorMsg: ex.expMsg,
            })
        }
    }

    /**
     * 更新默认的DNS地址
     */
    private async updateDefaultDnsServerAddress() {
        return this.lastDNSServerAddress = {
            preferredAddress: this.state.preferredAddress,
            firstBackupAddress: this.state.firstBackupAddress,
            secondBackupAddress: this.state.secondBackupAddress,
        }
    }

    /**
     * @param key value 发生改变的位置
     * @param keyStatus value 发生改变的位置的合法状态
     * @param value 正在更新的值
     */
    protected changeAddress(key, keyStatus, value) {
        let { validateBoxStatus } = this.state
        let validateBoxStatusTemp = keyStatus === 'preferredAddressStatus' ?
            PreferredAddressStatus.None
            : key === 'firstBackupAddressStatus' ?
                FirstBackupAddressStatus.None
                : SecondBackupAddressStatus.None

        this.setState({
            [key]: value,
            isDnsServerAddressChange: true,
            validateBoxStatus: {
                ...validateBoxStatus,
                [keyStatus]: validateBoxStatusTemp,
            }
        })
    }

    /**
     * 验证输入的地址是否合法
     */
    private isIpValidate(ip) {
        if (ip === '') {
            return true
        } else {
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
    }

    /**
     * 点击保存时触发事件处理函数
     */
    protected async completeDNSServerAddress() {
        const { validateBoxStatus } = this.state
        if (!(this.isIpValidate(this.state.preferredAddress)
            && this.isIpValidate(this.state.firstBackupAddress)
            && this.isIpValidate(this.state.secondBackupAddress))
        ) {
            let validateBoxStatusTemp = validateBoxStatus
            if (!this.isIpValidate(this.state.preferredAddress)) {
                validateBoxStatusTemp = {
                    ...validateBoxStatusTemp,
                    preferredAddressStatus: PreferredAddressStatus.PreferredAddressIllagel,
                }
            }
            if (!this.isIpValidate(this.state.firstBackupAddress)) {
                validateBoxStatusTemp = {
                    ...validateBoxStatusTemp,
                    firstBackupAddressStatus: FirstBackupAddressStatus.FirstBackupAddressIllagel,
                }
            }
            if (!this.isIpValidate(this.state.secondBackupAddress)) {
                validateBoxStatusTemp = {
                    ...validateBoxStatusTemp,
                    secondBackupAddressStatus: SecondBackupAddressStatus.SecondBackupAddressIllagel,
                }
            }
            this.setState({
                validateBoxStatus: validateBoxStatusTemp
            })
        } else {
            if (!(
                this.state.preferredAddress === this.lastDNSServerAddress.preferredAddress
                && this.state.firstBackupAddress === this.lastDNSServerAddress.firstBackupAddress
                && this.state.secondBackupAddress === this.lastDNSServerAddress.secondBackupAddress
            )) {
                let paramsTemp = [
                    this.state.preferredAddress,
                    this.state.firstBackupAddress,
                    this.state.secondBackupAddress
                ].filter(item => item !== '')

                // 地址不能重复
                let params = paramsTemp.reduce((preValue, currentValue) => {
                    return !preValue.includes(currentValue) ? [...preValue, currentValue] : preValue
                }, [])

                if (params.length === paramsTemp.length) {
                    try {
                        await ECMSManagerClient.set_dns_server(params)
                        this.context.toast(__('保存成功。'), { code: "\uf02f", size: 24, color: 'green' })

                        this.setState({
                            isDnsServerAddressChange: false
                        })

                        // 保存成功后，更新 lastDNSServerAddress 的值
                        this.lastDNSServerAddress.preferredAddress = this.state.preferredAddress
                        this.lastDNSServerAddress.firstBackupAddress = this.state.firstBackupAddress
                        this.lastDNSServerAddress.secondBackupAddress = this.state.secondBackupAddress

                        manageLog({
                            level: ncTLogLevel['NCT_LL_INFO'],
                            opType: ncTManagementType['NCT_MNT_SET'],
                            msg: __('设置 DNS服务器地址 成功'),
                            exMsg: __('首选地址：${preferredAddress}，备选地址1：${firstBackupAddress}，备选地址2：${secondBackupAddress}', {
                                'preferredAddress': params[0] || '---',
                                'firstBackupAddress': params[1] || '---',
                                'secondBackupAddress': params[2] || '---'
                            })
                        })
                    } catch (ex) {
                        this.setState({
                            errorDialogStatus: ErrorDialogStatus.ErrorDialog,
                            errorMsg: ex.expMsg,
                        })
                    }
                }
            }
        }
    }

    /**
     * 点击取消时触发事件处理函数
     */
    protected cancelDNSServerAddress() {
        this.setState({
            preferredAddress: this.lastDNSServerAddress.preferredAddress,
            firstBackupAddress: this.lastDNSServerAddress.firstBackupAddress,
            secondBackupAddress: this.lastDNSServerAddress.secondBackupAddress,
            validateBoxStatus: {
                preferredAddressStatus: PreferredAddressStatus.None,
                firstBackupAddressStatus: FirstBackupAddressStatus.None,
                secondBackupAddressStatus: SecondBackupAddressStatus.None,
            },
            isDnsServerAddressChange: false,
        })
    }

    /**
     * 关闭弹窗
     */
    protected closeDialog() {
        this.setState({
            errorDialogStatus: ErrorDialogStatus.None,
        })
    }
}
