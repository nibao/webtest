import * as React from 'react';
import { hashHistory } from 'react-router';
import WebComponent from '../webcomponent';
import { ECMSManagerClient, createEVFSClient } from '../../core/thrift2/thrift2';
import { appStatusReady } from '../../core/cluster/cluster';
import '../../gen-js/EVFS_types';
import { InitStatus, ManageMode, StorageMode, LoadingStatus } from './helper';

export default class StorageSubSystemBase extends WebComponent<Console.StorageSubSystem.Props, Console.StorageSubSystem.State>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
         * 第三方配置信息
         */
        thirdPartyOSSInfo: {},

        /**
         * 存储池初始化状态
         */
        storageInitStatus: InitStatus.INITED,

        /**
         * 管理模式： 存储节点管理 | 存储池管理
         */
        manageMode: ManageMode.POOL,

        /**
         * 存储模式
         */
        storageMode: StorageMode.ASU,

        /**
         * 等待提示状态
         */
        loadingStatus: LoadingStatus.LOADING

    }

    async componentDidMount() {

        // 执行判断是否含有第三方配置信息请求
        try {
            const appIp = await appStatusReady();

            // 应用节点不可用时，显示空白页面
            if (!appIp) {
                this.setState({
                    storageMode: StorageMode.INVAILD,
                    loadingStatus: LoadingStatus.NOVISIBLE
                })
                return;
            }
            let thirdPartyOSSInfo = await createEVFSClient({ ip: appIp }).GetThirdPartyOSSInfo();
            if (thirdPartyOSSInfo.provider === '') {
                // 如果第三方配置为空，进入本地Swift存储，执行判断初始化请求
                let isInit = await ECMSManagerClient.is_storage_pool_inited();
                this.setState({
                    storageInitStatus: isInit ? InitStatus.INITED : InitStatus.UNINIT,
                    storageMode: StorageMode.SWIFT
                })
            } else if (thirdPartyOSSInfo.provider === 'ASU') {
                // CEPH存储
                this.setState({
                    storageMode: StorageMode.ASU,
                    thirdPartyOSSInfo
                })
            } else {
                // 第三方存储
                this.setState({
                    storageMode: StorageMode.THIRD,
                    thirdPartyOSSInfo
                })
            }

            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE
            })
        } catch (error) {
            // 报错情况下，进入本地Swift存储
            let isInit = await ECMSManagerClient.is_storage_pool_inited();
            this.setState({
                storageInitStatus: isInit ? InitStatus.INITED : InitStatus.UNINIT,
                storageMode: StorageMode.SWIFT,
                loadingStatus: LoadingStatus.NOVISIBLE
            })
        }
    }


    /**
     * 选择存储面板
     */
    protected handleSelectManageMode(mode) {
        this.setState({
            manageMode: mode
        })
    }

    /**
     * 选择存储模式
     */
    protected handleSelectStorageModel(selection) {
        let thirdPartyOSSInfo = {
            internalServerName: '',
            cdnName: '',
            accessKey: '',
            provider: '',
            bucket: '',
            accessId: '',
            httpPort: '',
            httpsPort: '',
            serverName: ''
        }

        switch (selection) {
            case StorageMode.ASU:
                this.setState({
                    thirdPartyOSSInfo: { ...thirdPartyOSSInfo, provider: 'ASU' },
                    storageMode: StorageMode.ASU
                })
                break;
            case StorageMode.SWIFT:
                this.setState({
                    storageInitStatus: InitStatus.TOINIT
                })
                break;
            case StorageMode.THIRD:
                this.setState({
                    thirdPartyOSSInfo,
                    storageMode: StorageMode.THIRD
                })
                break;
            default:
                break;
        }

    }

    /**
     * 取消选择存储模式，回退到之前的操作页面
     */
    protected handleCancelSelectiStorageModel() {
        this.setState({
            storageInitStatus: InitStatus.INITCANCEL
        }, () => {
            hashHistory.goBack();
        })
    }

    /**
     * 初始化成功时触发
     */
    protected handleInitedSucceed() {
        this.setState({
            storageInitStatus: InitStatus.INITED
        })
    }



}