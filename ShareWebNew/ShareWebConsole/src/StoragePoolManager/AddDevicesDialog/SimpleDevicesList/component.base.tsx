import * as React from 'react';
import { values } from 'lodash';
import { ECMSManagerClient } from '../../../../core/thrift2/thrift2';
import WebComponent from '../../../webcomponent';
import { DevicesStatus } from '../../helper';

export default class SimpleDevicesListBase extends WebComponent<Console.StoragePoolManager.AddDevicesDialog.SimpleDevicesList.Props, Console.StoragePoolManager.AddDevicesDialog.SimpleDevicesList.State>{

    static defaultProps = {

    }

    state = {
        /**
         * 是否显示存储池内设备信息
         */
        showPoolDevicesList: false,

        /**
         * 设备选中项
         */
        deviceSelection: [],

        /**
         * 顶部复选框勾选状态
         */
        checked: false,

        /**
         * 顶部复选框半选状态
         */
        halfChecked: false,

        storagePoolFreeDevices: null,

        loading: false
    }


    /**
     * 点击收展设备列表按钮
     */
    protected async handleExpandDeviceList() {
        const { storagePoolNodeInfo } = this.props;
        const { showPoolDevicesList, storagePoolFreeDevices } = this.state;

        if (!showPoolDevicesList) { // 展开列表
            if (!storagePoolFreeDevices) {
                try {
                    this.setState({
                        loading: true
                    })
                    const freeDevices = await ECMSManagerClient.get_free_data_disks(storagePoolNodeInfo.node_ip);
                    values(freeDevices).length === 0 ?
                        this.setState({
                            storagePoolFreeDevices: {}
                        }, () => {
                            this.props.onGetFreeDevicesFailed({ status: DevicesStatus.NoFreeDevices })
                        })
                        : this.setState({
                            showPoolDevicesList: true,
                            storagePoolFreeDevices: freeDevices                          
                        })
                } catch (error) {
                    this.props.onGetFreeDevicesFailed({ status: DevicesStatus.GetDevicesFailed, detail: error.expMsg })
                } finally {
                    this.setState({
                        loading: false
                    })
                }
            } else if (values(storagePoolFreeDevices).length === 0) {
                this.props.onGetFreeDevicesFailed({ status: DevicesStatus.NoFreeDevices })
            } else {
                this.setState({
                    showPoolDevicesList: true
                })
            }
        } else { // 收起列表
            this.setState({
                showPoolDevicesList: false
            })
        }
    }

    /**
     * 选中设备项
     */
    protected handleSelectDevice(selection) {
        switch (selection.length) {
            case 0:
                this.setState({
                    checked: false,
                    halfChecked: false
                })
                break;
            case values(this.state.storagePoolFreeDevices).length:
                this.setState({
                    checked: true,
                    halfChecked: false
                })
                break;
            default:
                this.setState({
                    checked: false,
                    halfChecked: true
                })
                break;
        }

        this.setState({
            deviceSelection: selection
        }, () => {
            this.props.onFreeDevicesSelected(selection, false);
        })
    }

    /**
     * 点击顶部复选框
     */
    protected handleClickTopCheckBox(checked, value) {

        this.props.onFreeDevicesSelected(checked ? values(this.state.storagePoolFreeDevices) : [], checked);
        this.setState({
            deviceSelection: checked ? values(this.state.storagePoolFreeDevices) : [],
            checked: checked,
            halfChecked: false
        })
    }
}