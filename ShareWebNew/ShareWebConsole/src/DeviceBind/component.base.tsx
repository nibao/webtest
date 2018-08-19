import * as React from 'react'
import { trim } from 'lodash'
import WebComponent from '../webcomponent'
import { ShareMgnt, EACP } from '../../core/thrift/thrift'
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import { isMac } from '../../util/validators/validators';
import __ from './locale'
export enum SearchField {
    AllUser = 1,
    BindUser,
    NoBindUser
}

export enum OsType {
    UnKnown,
    IOS,
    Android,
    WindowsPhone,
    Windows,
    MacOS,
    Web
}

export enum ValidateStates {
    Normal,
    InvalidMac
}

export default class DeviceBindBase extends WebComponent<any, any> {
    state = {
        currentSelectUser: null, // 当前选中用户
        scope: SearchField.AllUser, // select搜索范围
        searchKey: '', // 搜索关键字
        searchResults: [], // 搜索结果
        deviceInfos: [], // 用户绑定设备信息
        disabled: true, // 禁用用户设备面板
        page: 1, // 当前页
        total: 0, // 搜索结果总数
        addingDevice: false,  // 添加Mac的Dialog显示隐藏标识
        deviceIsExist: false, // 错误提示框显示隐藏标识
        validateState: ValidateStates.Normal,
        addBox: {
            osType: 4, // 设备类型
            mac: '' // mac地址
        }
    }

    componentDidMount() {
        // 初始化查询
        this.startSearch()
    }


    /**
     * 搜索用户
     * @returns 搜索结果的Promise对象
     * @memberof DeviceBindBase
     */
    async search() {
        const { scope, searchKey, page } = this.state
        const total = await ShareMgnt('Devicem_SearchUsersBindStatusCnt', [scope, searchKey])
        this.setState({
            total
        })
        return await ShareMgnt('Devicem_SearchUsersBindStatus', [scope, searchKey, (page - 1) * 200, 200]);
    }

    /**
     * 执行搜索并处理搜索结果
     * @memberof DeviceBindBase
     */
    async startSearch() {
        const result = await this.search()
        this.handleSearchLoaded(result)
    }

    /**
     * 处理翻页
     * @param {number} page 页码
     * @memberof DeviceBindBase
     */
    handlePageChange(page: number) {
        this.setState({
            page
        }, () => {
            this.startSearch()
        })
    }

    /**
     * 处理搜索结果
     * @param {any} searchResults 
     * @memberof DeviceBindBase
     */
    handleSearchLoaded(searchResults) {
        this.setState({
            searchResults,
        });
    }

    /**
     * 搜索关键字改变触发搜索
     * @param {string} searchKey 
     * @memberof DeviceBindBase
     */
    handleSearchKeyChange(searchKey: string) {
        this.setState({
            searchKey: trim(searchKey),
            page: 1
        }, () => {
            this.startSearch()
        });
    }

    /**
     * 搜索范围发生改变触发搜索
     * @param {number} scope 
     * @memberof DeviceBindBase
     */
    handleChangeSearchField(scope: number) {
        this.setState({
            scope,
            page: 1
        }, () => {
            this.startSearch()
        })
    };

    /**
     * 选中用户后解除设备绑定面板禁用，请求所选中用户设备绑定信息并进行渲染
     * @param {any} UserInfoItem 
     * @memberof DeviceBindBase
     */
    handleSelectUser(UserInfoItem) {
        this.setState({
            disabled: false,
            currentSelectUser: UserInfoItem
        }, () => {
            const { currentSelectUser } = this.state
            if (currentSelectUser) {
                this.startSelect();
            } else {
                this.setState({
                    deviceInfos: []
                })
            }
        })
    }

    /**
     * 处理获取到的用户绑定信息
     * @param {any} selectUserBindDeviceInfo 
     * @memberof DeviceBindBase
     */
    handleSelectUserInfo(selectUserBindDeviceInfo) {
        this.setState({
            deviceInfos: selectUserBindDeviceInfo,
        });
    }

    /**
     * 获取选中用户设备信息
     * @memberof DeviceBindBase
     */
    async startSelect() {
        const { currentSelectUser } = this.state
        const result = await EACP('EACP_GetDevicesByUserId', [currentSelectUser.id]);
        this.handleSelectUserInfo(result);
    }


    /**
     * 切换绑定状态
     * @param {any} data 
     * @memberof DeviceBindBase
     */
    async switchDeviceBind(data) {
        const { deviceInfos, currentSelectUser } = this.state
        const { bindFlag, baseInfo: { udid: mac } } = data;
        try {
            await EACP(bindFlag ? 'EACP_UnbindDevice' : 'EACP_BindDevice', [currentSelectUser.id, mac])
            // await this.startSelect()
            const index = deviceInfos.indexOf(data)
            this.setState({
                deviceInfos: [...deviceInfos.slice(0, index), { ...data, bindFlag: !bindFlag }, ...deviceInfos.slice(index + 1)]
            })
            await this.startSearch()
            await manageLog(
                ManagementOps.SET,
                __(bindFlag ? '用户${userName} 绑定设备 ${device} 成功' : '用户${userName} 解除设备 ${device}的绑定 成功', { userName: currentSelectUser.id, device: mac }),
                '',
                Level.WARN
            )
        } catch (e) {

        }
    }


    /**
     * 删除设备绑定并重新获取用户列表
     * @param {any} data 
     * @memberof DeviceBindBase
     */
    async deleteDeviceBind(data) {
        const { deviceInfos, currentSelectUser } = this.state
        await EACP('EACP_DeleteDevice', [currentSelectUser.id, data.baseInfo.udid]);
        this.setState({
            deviceInfos: deviceInfos.filter((item) => item !== data),
        });
        this.startSearch();
    }

    /**
     * 点击添加显示Mac绑定的Dialog
     * @memberof DeviceBindBase
     */
    handleAddDevice() {
        this.setState({
            addingDevice: true,
            addBox: {
                osType: 4,
                mac: ''
            }
        })
    }


    /**
     * 点击取消按钮或者X隐藏Mac绑定的Dialog
     * @memberof DeviceBindBase
     */
    handleCancelAddDevice() {
        this.setState({
            addingDevice: false,
            validateState: ValidateStates.Normal,
            addBox: {
                osType: 4,
                mac: ''
            }
        })
    }


    /**
     * 处理设备类型改变和Mac地址输入改变
     * @param {any} [value={}] 
     * @memberof DeviceBindBase
     */
    handleAddBoxChange(value = {}) {
        this.setState({
            validateState: ValidateStates.Normal,
            addBox: { ...this.state.addBox, ...value }
        })
    }

    /**
     * 处理添加设备绑定
     * @memberof DeviceBindBase
     */
    async handleSubmitAddDevice() {
        const { deviceInfos, currentSelectUser, addBox } = this.state
        if (isMac(addBox.mac)) {
            try {
                await EACP('EACP_AddDevice', [currentSelectUser.id, addBox.mac, addBox.osType]);
                await this.startSelect();
                this.handleCancelAddDevice();
                this.startSearch();
            } catch ({ error }) {
                if (error.errID === 4197) {
                    this.setState({
                        deviceIsExist: true
                    })
                }
            }
        } else {
            this.setState({
                validateState: ValidateStates.InvalidMac
            })
        }
    }

    /**
     * 关闭错误提示框
     * @memberof DeviceBindBase
     */
    handleCancelTip() {
        this.setState({
            deviceIsExist: false
        })
    }

}