import * as React from 'react';
import WebComponent from '../../webcomponent';

export default class PoolDevicesListBase extends WebComponent<Console.StoragePoolManager.PoolDevicesList.Props, Console.StoragePoolManager.PoolDevicesList.State>{

    state = {
        /**
         * 是否显示存储池内设备信息
         */
        showPoolDevicesList: this.props.expand,

        /**
         * 设备选中项
         */
        deviceSelection: []
    }

    /**
     * 点击收展设备列表按钮
     */
    protected handleExpandDeviceList() {
        this.setState({
            showPoolDevicesList: !this.state.showPoolDevicesList
        })
    }

    /**
     * 选中设备项
     */
    protected handleSelectDevice(selection) {
        this.setState({
            deviceSelection: selection
        })
    }
}