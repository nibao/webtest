import * as React from 'react';
import { map, some, reduce, filter, includes, every } from 'lodash';
import { list, disable, enable, erase, getStatus, onEraseSuc } from '../../core/apis/eachttp/device/device';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class MobileBase extends WebComponent<Components.Mobile.Props, Components.Mobile.State>  {

    state: Components.Mobile.State = {
        isLoading: true,
        devicesList: [],
        selection: [],
        confirmDisableDevices: [],
        confirmEraseDevices: [],
        selectOpitions: {}
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    componentWillMount() {
        this.loadDevices()
    }

    private async loadDevices() {
        this.setState({
            isLoading: true
        })
        let { deviceinfos } = await list({});
        this.setState({
            devicesList: deviceinfos,
            isLoading: false
        })
    }

    /**
     * 选中设备列表文件
     */
    protected handleSelectedList({ detail }) {
        this.setState({
            selectOpitions: reduce(this.state.devicesList, (pre, device) => {
                if (some(detail, sel => (sel.udid === device.udid))) {
                    return { ...pre, [device.udid]: true }
                } else {
                    return { ...pre, [device.udid]: false }
                }
            }, []),
            selection: detail
        })
    }

    /**
     * 确认擦除
     */
    protected eraseDevicesList(devicesList) {
        if (every(devicesList, device => device.loginflag === 0)) {
            this.context.toast(__('无缓存数据'))
            return
        }
        this.setState({
            confirmEraseDevices: reduce(filter(devicesList, device => device.loginflag !== 0), (prev, device) => {
                return [...prev, device.udid]
            }, [])
        })
    }

    /**
     * 确认禁用
     */
    protected disableDevicesList(devicesList) {
        this.setState({
            confirmDisableDevices: reduce(devicesList, (prev, device) => {
                return [...prev, device.udid]
            }, [])
        })
    }

    /**
     * 启用设备
     */
    protected async enableDevicesList(devicesList) {
        let confirmEnableDevices = reduce(devicesList, (prev, device) => {
            return [...prev, device.udid]
        }, [])
        await Promise.all(map(confirmEnableDevices, udid => enable({ udid })));
        this.setState({
            devicesList: map(this.state.devicesList, device => (
                includes(confirmEnableDevices, device.udid) ? { ...device, disableflag: 0 } : device
            ))
        }, () => {
            this.setState({
                selection: filter(this.state.devicesList, device => {
                    return this.state.selectOpitions[device.udid] === true
                }),
                confirmEnableDevices: []
            })
        })
        this.context.toast(__('已成功启用设备'))
    }

    /**
     * 单击擦除设备
     */
    protected handleClickErase({ udid, loginflag }) {
        if (loginflag === 0) {
            this.context.toast(__('无缓存数据'))
            return
        }
        this.setState({
            confirmEraseDevices: [udid]
        })
    }

    /**
     * 单击禁用设备
     */
    protected handleClickDisabled(udid) {
        this.setState({
            confirmDisableDevices: [udid]
        })
    }

    /**
     * 单击启用设备
     */
    protected async handleClickEnable(udid) {
        await enable({ udid });
        this.setState({
            devicesList: map(this.state.devicesList, device => (
                udid === device.udid ? { ...device, disableflag: 0 } : device
            ))
        }, () => {
            this.setState({
                selection: filter(this.state.devicesList, device => {
                    return udid === device.udid
                }),
            })
        })
        this.context.toast(__('已成功启用设备'))
    }

    /**
     * 确认禁用设备确认事件
     */
    protected async onDisableConfirm(confirmDisableDevices) {
        await Promise.all(map(confirmDisableDevices, udid => disable({ udid })));
        this.setState({
            devicesList: map(this.state.devicesList, device => (
                includes(confirmDisableDevices, device.udid) ? { ...device, disableflag: 1 } : device
            ))
        }, () => {
            this.setState({
                selection: filter(this.state.devicesList, device => {
                    return this.state.selectOpitions[device.udid] === true
                }),
                confirmDisableDevices: []
            })
        })
        this.context.toast(__('已成功禁用设备'))
    }

    /**
     * 确认禁用设备取消事件
     */
    protected onDisableCancle() {
        this.setState({
            confirmDisableDevices: []
        })
    }

    /**
     * 确认擦除设备确认事件
     */
    protected async onEraseConfirm(confirmEraseDevices) {
        await Promise.all(map(confirmEraseDevices, udid => erase({ udid })));
        this.setState({
            devicesList: map(this.state.devicesList, device => (
                includes(confirmEraseDevices, device.udid) ? { ...device, eraseflag: 1 } : device
            ))
        }, () => {
            this.setState({
                selection: filter(this.state.devicesList, device => {
                    return this.state.selectOpitions[device.udid] === true
                }),
                confirmEraseDevices: []
            })
        })
        this.context.toast(__('已成功发送请求'))
    }

    /**
     * 确认擦除设备取消事件
     */
    protected onEraseCancle() {
        this.setState({
            confirmEraseDevices: []
        })
    }

    handleIconClick(e, doc) {
        if (this.state.selection.length === 1 && includes(this.state.selection, doc)) {
            e.stopPropagation()
        }
    }

}