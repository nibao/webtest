import * as React from 'react';
import * as _ from 'lodash';
import WebComponent from '../webcomponent';
import { ECMSManagerClient, EVFSClient, createEVFSClient } from '../../core/thrift2/thrift2';
import { manageLog } from '../../core/log2/log2'
import { appStatusReady } from '../../core/cluster/cluster';
import '../../gen-js/EVFS_types';
import '../../gen-js/EACPLog_types';
import __ from './locale';
import { LoadingStatus, ErrorStatus, ValidateState, StorageMode } from './helper';

const thirdProvider = [
    { name: '请选择第三方服务商', value: 'empty' },
    { name: 'Ceph', value: 'CEPH' },
    { name: '阿里云', value: 'OSS' },
    { name: '百度开放云', value: 'BOS' },
    { name: '七牛云存储', value: 'QINIU' },
    { name: '亚马逊', value: 'AWS' },
    { name: '亚马逊中国', value: 'AWSCN' },
    { name: '微软Azure', value: 'AZURE' },

]
export default class ThirdPartyStorageBase extends WebComponent<Console.ThirdPartyStorage.Props, Console.ThirdPartyStorage.State>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
        * 第三方存储配置
        */
        thirdPartyOSSInfo: this.props.thirdPartyOSSInfo,

        /**
         * 错误提示信息
        */
        errorStatus: ErrorStatus.NOVISIBLE,

        /**
         * 供应商选中项
         * LIKE { name: '请选择第三方服务商', value: 'empty' }
         */
        providerSelection: {},

        /**
         * 输入框是否有变动
         */
        isAnyInputChange: false,

        /**
         * 等待提示信息
         */
        loadingStatus: LoadingStatus.LOADING,

        /**
         * 验证状态
         */
        validateState: {
            httpPort: ValidateState.Normal,
            httpsPort: ValidateState.Normal,
        },

        /**
         * 是否灰化服务商选项
         */
        lockProvider: false,

        /**
         * 错误信息
         */
        errMsg: '',

        /**
         * 保存成功后的服务器地址
         */
        serverName: ''


    }


    async componentWillMount() {
        let { thirdPartyOSSInfo, providerSelection } = this.state;
        if (thirdPartyOSSInfo.httpPort === 0) {
            thirdPartyOSSInfo.httpPort = ''
        }
        if (thirdPartyOSSInfo.httpsPort === 0) {
            thirdPartyOSSInfo.httpsPort = ''
        }
        this.oldThirdPartyOSSInfo = _.cloneDeep(thirdPartyOSSInfo)
        this.storagePoolNodeInfo = await ECMSManagerClient.get_storage_node_info();
        this.appNodeIp = await appStatusReady();

        if (this.props.storageMode === StorageMode.ASU) {
            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE,
                providerSelection: { name: 'ASU', value: 'ASU' },
                serverName: thirdPartyOSSInfo.serverName
            })
        } else {
            providerSelection = this.props.thirdPartyOSSInfo.provider === '' ? thirdProvider[0] : thirdProvider.filter((item) => {
                return item.value === thirdPartyOSSInfo.provider
            })[0]
            this.setState({
                thirdPartyOSSInfo,
                loadingStatus: LoadingStatus.NOVISIBLE,
                providerSelection,
                lockProvider: this.props.thirdPartyOSSInfo.provider === '' ? false : true
            })
        }
    }

    /**
     * 存储池节点信息
     */
    storagePoolNodeInfo = {};

    /**
     * 初次传入的第三方配置信息，用于取消还原操作
     */
    oldThirdPartyOSSInfo = {};

    /**
     * 逻辑应用主节点
     */
    appNodeIp = '';

    /**
     * 第三方提供商选中项变动
     */
    protected handleSelectThirdProviderMenu(item) {
        let { thirdPartyOSSInfo, validateState } = this.state;
        thirdPartyOSSInfo.provider = item.value;
        validateState.httpPort = ValidateState.Normal
        validateState.httpsPort = ValidateState.Normal

        // 如果提供商与原保存的提供商一致，则显示old数据，否则显示空白
        if (item.value === this.oldThirdPartyOSSInfo.provider) {
            this.setState({
                thirdPartyOSSInfo: { ...this.oldThirdPartyOSSInfo },
                providerSelection: item,
                isAnyInputChange: false
            })
        } else {
            this.setState({
                thirdPartyOSSInfo: {
                    accessId: '',
                    accessKey: '',
                    bucket: '',
                    cdnName: '',
                    httpPort: '',
                    httpsPort: '',
                    internalServerName: '',
                    provider: item.value,
                    serverName: '',
                },
                providerSelection: item,
                validateState
            })
        }
    }

    /**
     * 输入框变化
     */
    protected handleInputChange(value, valueType) {

        let { thirdPartyOSSInfo, validateState } = this.state;
        thirdPartyOSSInfo[valueType] = value;
        if (valueType === 'httpPort' || valueType === 'httpsPort') {
            validateState[valueType] = ValidateState.Normal
        }

        this.setState({
            thirdPartyOSSInfo,
            isAnyInputChange: true,
            validateState
        })
    }

    /**
     * 测试配置
     */
    protected async handleTestSetting(useToSave = false) {
        let { thirdPartyOSSInfo } = this.state;
        let isValid = false;
        if (thirdPartyOSSInfo.hasOwnProperty('httpPort') && !this.checkPort(thirdPartyOSSInfo.httpPort, 'httpPort')) {
            isValid = true;
        }
        if (thirdPartyOSSInfo.hasOwnProperty('httpsPort') && !this.checkPort(thirdPartyOSSInfo.httpsPort, 'httpsPort')) {
            isValid = true;
        }
        if (isValid) {
            return;
        }

        try {
            this.setState({
                loadingStatus: LoadingStatus.LOADING,
            })

            // 端口号若为空，则不作为参数发送
            if (thirdPartyOSSInfo.hasOwnProperty('httpPort') && (thirdPartyOSSInfo.httpPort === 0 || thirdPartyOSSInfo.httpPort.toString().trim() === '')) {
                delete thirdPartyOSSInfo.httpPort
            }

            if (thirdPartyOSSInfo.hasOwnProperty('httpsPort') && (thirdPartyOSSInfo.httpsPort === 0 || thirdPartyOSSInfo.httpsPort.toString().trim() === '')) {
                delete thirdPartyOSSInfo.httpsPort
            }

            let isSucceed = await createEVFSClient({ ip: this.appNodeIp }).ConnectThirdPartyOSS(new ncTEVFSOSSInfo({
                ...thirdPartyOSSInfo,
            }));
            if (isSucceed) {
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE,
                }, () => {
                    useToSave ?
                        null
                        :
                        this.context.toast(__('连接成功'), { code: '\uf02f', size: 24, color: 'green' })
                })
                return true;
            } else {
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE,
                    errorStatus: ErrorStatus.UNACCESS_SETTING,
                })
                return false;
            }

        } catch (error) {
            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE,
                errorStatus: ErrorStatus.UNACCESS_SETTING,
            })
            return false;
        }
    }

    /**
     * 保存配置
     */
    protected async handleConfirmSave() {
        let { thirdPartyOSSInfo } = this.state;

        try {
            this.setState({
                loadingStatus: LoadingStatus.LOADING,
            })

            let isSucceed = await this.handleTestSetting(true);

            if (!isSucceed) return;

            await createEVFSClient({ ip: this.appNodeIp }).SetThirdPartyOSSInfo(new ncTEVFSOSSInfo({
                ...thirdPartyOSSInfo
            }));

            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE,
                isAnyInputChange: false,
                serverName: thirdPartyOSSInfo.serverName
            }, async () => {
                this.setState({
                    lockProvider: true
                })

                this.props.storageMode !== StorageMode.ASU ?
                    // 记日志
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('设置 第三方存储配置 成功'),
                        exMsg: __('服务商：${provider}，服务器地址：${ip}', { provider: thirdPartyOSSInfo.provider, ip: thirdPartyOSSInfo.serverName }),
                    })
                    :
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('设置 本地Ceph存储服务配置 成功'),
                        exMsg: __('服务器地址：${ip}，http端口：${http}，https端口：${https}', { ip: thirdPartyOSSInfo.serverName, http: thirdPartyOSSInfo.httpPort === '' ? 0 : thirdPartyOSSInfo.httpPort, https: thirdPartyOSSInfo.httpsPort === '' ? 0 : thirdPartyOSSInfo.httpsPort }),
                    })
                this.context.toast(__('保存成功'), { code: '\uf02f', size: 24, color: 'green' })

                // 移除存储节点
                let storagePoolNodeInfo = await ECMSManagerClient.get_storage_node_info();
                if (storagePoolNodeInfo.length === 0 || !storagePoolNodeInfo) {
                    return;
                } else {
                    storagePoolNodeInfo.map(async (node) => {
                        await ECMSManagerClient.del_storage_node(node.node_uuid);
                    })
                }

            })


        } catch (error) {
            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE,
                lockProvider: false,
                errorStatus: ErrorStatus.SAVE_FAILED,
                errMsg: error.errMsg ? error.errMsg : error
            })
        }
    }

    /**
     * 取消保存配置
     */
    protected handleCancelSave() {
        let thirdPartyOSSInfo = this.oldThirdPartyOSSInfo;

        if (this.props.storageMode === StorageMode.ASU) {
            this.setState({
                thirdPartyOSSInfo: { ...this.oldThirdPartyOSSInfo },
                isAnyInputChange: false
            })
        } else {
            let providerSelection = this.oldThirdPartyOSSInfo.provider === '' ? thirdProvider[0] : thirdProvider.filter((item) => {
                return item.value === thirdPartyOSSInfo.provider
            })[0]
            this.setState({
                thirdPartyOSSInfo: { ...this.oldThirdPartyOSSInfo },
                providerSelection,
                isAnyInputChange: false
            })
        }


    }

    /**
     * 验证端口号
     */
    private checkPort(port, portName) {
        let re = /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
        let { validateState } = this.state;
        if (port === '') {
            validateState[portName] = ValidateState.Normal
            this.setState({
                validateState
            })
            return true;
        }
        if (!re.test(port)) {
            // this.context.toast(__('端口号必须是 1~65535 之间的整数，请重新输入'))
            validateState[portName] = ValidateState.InvalidPort
            this.setState({
                validateState
            })
            return false;
        }

        validateState[portName] = ValidateState.Normal
        this.setState({
            validateState
        })
        return true;
    }

    /**
     * 点击错误提示框确认按钮
     */
    protected handleConfirmErrorDialog() {
        this.setState({
            errorStatus: ErrorStatus.NOVISIBLE
        })
    }

    /**
     * 点击跳转存储管理控制台
     */
    protected async handleClickControlLink() {
        try {
            let addr = await ECMSManagerClient.get_storage_console_address(this.state.serverName);
            window.open(addr)
        } catch (error) {
            this.setState({
                errorStatus: ErrorStatus.SAVE_FAILED,
                errMsg: error.errMsg ? error.errMsg : error
            })
        }
    }
}