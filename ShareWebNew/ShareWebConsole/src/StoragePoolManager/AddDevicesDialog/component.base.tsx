import * as React from 'react';
import WebComponent from '../../webcomponent';

export default class AddDeviceDialogBase extends WebComponent<Console.StoragePoolManager.AddDevicesDialog.Props, Console.StoragePoolManager.AddDevicesDialog.State>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
         * 是否显示等待提示
         */
        showLoading: true,

        /**
         * 待添加的空闲设备集合
         * {
         *   node_ip: {dev1, dev2}
         * }
         */
        waitForAddFreeDevices: {},

        /**
         * 是否添加当前节点全部空闲设备
         */
        shouldAddAllDevices: {},

        /**
         * 节点空闲设备状态
         */
        devicesExceptionStatus: {
            status: null,
            detail: null
        }
    }

    /**
     * 空闲设备选中项发生变更时
     */
    protected handleSelectedFreeDevices(node_ip, selectedFreeDevices, isAll) {
        let { waitForAddFreeDevices, shouldAddAllDevices } = this.state;
        waitForAddFreeDevices[node_ip] = selectedFreeDevices;
        shouldAddAllDevices[node_ip] = isAll;
        this.setState({
            waitForAddFreeDevices,
            shouldAddAllDevices
        })
    }

    /**
     * 确定添加节点设备
     */
    protected async handleAddDeviceConfirm() {
        let { waitForAddFreeDevices, shouldAddAllDevices } = this.state;
        this.props.onAddDevicesConfirm(waitForAddFreeDevices, shouldAddAllDevices);
    }

    /**
     * 取消添加节点设备
     */
    protected handleAddDeviceCancel() {
        this.props.onAddDevicesCancel();
    }

    /**
     * 获取节点空闲设备失败
     */
    protected handleGetFreeDevicesFailed({ status, detail = null }) {
        this.setState({
            devicesExceptionStatus: {
                status,
                detail
            }
        })
    }

    /**
     * 确认获取节点空闲设备失败
     */
    protected handleConfirmGetFreeDevicesFailed() {
        this.setState({
            devicesExceptionStatus: {
                status: null,
                detail: null
            }
        })
    }
}