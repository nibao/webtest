import * as React from 'react';
import WebComponent from '../../webcomponent'
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import { manageLog } from '../../../core/log2/log2'
import '../../../gen-js/EACPLog_types';
import { LoadingStatus, ErrorStatus, WarningStatus } from '../helper';
import __ from './locale';
export default class StorageInitPanelBase extends WebComponent<Console.StoragePoolManager.StorageInitPanel.Props, Console.StoragePoolManager.StorageInitPanel.State>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
         * 选择的系统存储策略
         * {
         *      name: 策略名称
         *      mode: 策略值
         * }
         */
        storageStrategyMode: { name: '-', mode: 0 },

        /**
        * 错误信息
        */
        errorMsg: '',

        /**
         * 错误提示信息
         */
        errorStatus: ErrorStatus.NOVISIBLE,

        /**
         * 警告提示内容
         */
        warningStatus: WarningStatus.NOVISIBLE,

        /**
         * 等待提示信息
         */
        loadingStatus: LoadingStatus.NOVISIBLE


    }

    /**
     * 选择系统存储策略
     */
    protected async handleSelectStorageStrategyMenu(item) {
        this.setState({
            storageStrategyMode: item
        })
    }


    /**
     * 执行初始化
     */
    protected async handleExcuteInitStoragePool() {
        this.setState({
            warningStatus: WarningStatus.CHOOSE_MODE
        })

    }

    /**
     * 点击警告提示框确认按钮
     */
    protected handleConfirmConfirmDialog() {
        this.setState({
            warningStatus: WarningStatus.NOVISIBLE,
            loadingStatus: LoadingStatus.INITING,
        }, async () => {
            try {
                await ECMSManagerClient.init_storage_pool(this.state.storageStrategyMode.mode);
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE
                }, () => {
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_CREATE'],
                        msg: __('初始化系统存储池 成功'),
                        exMsg: __('系统存储策略： “${mode}副本模式”', { mode: this.state.storageStrategyMode.mode }),
                    })
                    this.props.onInit();
                })
            } catch (error) {
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE,
                    errorStatus: ErrorStatus.INIT_FAILED,
                    errorMsg: error.error ? error.error.errMsg : error
                })
            }

        })
    }

    /**
     * 点击警告提示框取消按钮
     */
    protected handleCancelConfirmDialog() {
        this.setState({
            warningStatus: WarningStatus.NOVISIBLE,
        })
    }

    /**
     * 点击错误提示框确认按钮
     */
    protected handleConfirmErrorDialog() {
        this.setState({
            errorStatus: ErrorStatus.NOVISIBLE,
            errorMsg: ''
        })
    }

}