import * as React from 'react';
import WebComponent from '../../webcomponent'

export default class ReplaceDevicesDialogBase extends WebComponent<Console.StoragePoolManager.ReplaceDevicesDialog.Props, Console.StoragePoolManager.ReplaceDevicesDialog.State>{

    state = {
        /**
         * 选定用于替换的空闲设备
         */
        waitForReplacedDevices: this.props.freePoolDevices[0]

    }

    /**
     * 空闲设备选中项发生变更时
     */
    protected handleSelectReplaceDeviceMenu(selection) {
        this.setState({
            waitForReplacedDevices: selection
        })
    }

    /**
     * 确定替换节点设备
     */
    protected async handleReplaceDeviceConfirm() {
        this.props.onReplaceDevicesConfirm(this.props.replacedPoolDevice.swift_device, this.state.waitForReplacedDevices);
    }

    /**
     * 取消替换节点设备
     */
    protected handleReplaceDeviceCancel() {
        this.props.onReplaceDevicesCancel();
    }




}