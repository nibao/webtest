/// <reference path="component.base.d.ts" />

import * as react from 'react'
import webComponent from '../webcomponent'
import { ShareMgnt, EACP } from '../../core/thrift/thrift'
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import { subNetMask as validateSubNetMask, IP as validateIP } from '../../util/validators/validators'
import __ from './locale'

export enum Status {
    Normal,
    AddDocLib
}

export enum ValidateStates {
    Normal,
    InvalidIP,
    InvalidSubNetMask
}

export const ValidateMessages = {
    [ValidateStates.InvalidIP]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数'),
    [ValidateStates.InvalidSubNetMask]: __('子网掩码格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数')
}

export const ErrMsgs = {
    'IDS_NET_DOCS_LIMIT_EXIST': __('该网段设置已存在，无法重复添加')
}

export default class DocLibAccessBase extends webComponent<any, any>{
    state = {
        status: Status.Normal,
        netInfos: [],
        docLibInfos: [],
        errors: [],
        editing: false,
        currentNet: null,
        enabled: false,
        ipValidateState: ValidateStates.Normal,
        subNetMaskValidateState: ValidateStates.Normal
    }

    componentWillMount() {
        this.getStatus()
        this.getNetInfos()
    }

    /**
     * 获取文档库ip绑定开关状态
     */
    getStatus() {
        ShareMgnt('DocLimitm_GetStatus').then(enabled => {
            this.setState({
                enabled
            })
        })
    }

    /**
     * 获取所有网段
     */
    getNetInfos() {
        ShareMgnt('DocLimitm_GetNet').then(netInfos => {
            this.setState({
                netInfos
            })
        })
    }

    /**
     * 获取指定网段所有绑定文档库
     * @param id 网段id
     */
    getNetDocLibs(id: string) {
        ShareMgnt('DocLimitm_GetDocs', [id]).then(docLibInfos => {
            this.setState({
                docLibInfos
            })
        })
    }

    /**
     * 搜索网段
     */
    searchNet(ip) {
        return ShareMgnt('DocLimitm_SearchNet', [ip])
    }

    /**
     * 在当前选中的网段搜索文档库
     */
    searchDocLib(name) {
        return ShareMgnt('DocLimitm_SearchDocs', [this.state.currentNet.id, name])
    }

    /**
     * 文档库绑定开关
     */
    handleToggle(enabled) {
        ShareMgnt('DocLimitm_SetStatus', [enabled]).then(() => {
            this.setState({
                enabled
            }),
                manageLog(
                    ManagementOps.SET,
                    __(enabled ? '启用 文档库IP网段限制 成功' : '关闭 文档库IP网段限制 成功'),
                    '',
                    Level.WARN
                )
        })
    }

    /**
     * 添加网段
     */
    handleAddNet() {
        if (this.state.netInfos.every(netInfo => netInfo.id !== '')) {
            let currentNet = {
                id: '',
                ip: '',
                subNetMask: ''
            }
            this.setState({
                editing: true,
                currentNet,
                netInfos: [currentNet, ...this.state.netInfos]
            })
        }
    }

    /**
     * 选中网段
     */
    handleSelectNet(net) {
        if (!this.state.editing) {
            this.setState({
                currentNet: net ? ({ ...net }) : null
            })
        }
        if (net && net.id) {
            this.getNetDocLibs(net.id)
        } else {
            this.setState({
                docLibInfos: []
            })
        }
    }

    /**
     * 编辑网段
     */
    handleEditNet(net) {
        this.setState({
            editing: true,
            currentNet: { ...net }
        })
    }

    /**
     * 撤销编辑网段
     */
    handleCancelEditNet(net) {
        this.setState({
            netInfos: this.state.netInfos.filter(netInfo => !!netInfo.id),
            editing: false,
            currentNet: { ...net },
            ipValidateState: ValidateStates.Normal,
            subNetMaskValidateState: ValidateStates.Normal
        })
    }

    /**
     * 提交网段设置
     */
    handleSubmitNet() {
        let {currentNet} = this.state
        this.setState({
            ipValidateState: validateIP(currentNet.ip) ? ValidateStates.Normal : ValidateStates.InvalidIP,
            subNetMaskValidateState: validateSubNetMask(currentNet.subNetMask) ? ValidateStates.Normal : ValidateStates.InvalidSubNetMask
        }, () => {
            let {ipValidateState, subNetMaskValidateState} = this.state
            if ([ipValidateState, subNetMaskValidateState].every(state => state === ValidateStates.Normal)) {
                (
                    currentNet.id ?
                        ShareMgnt('DocLimitm_EditNet', [{ ncTNetInfo: currentNet }]) :
                        ShareMgnt('DocLimitm_AddNet', [{ ncTNetInfo: currentNet }])
                ).then(() => {
                    this.getNetInfos()
                    this.setState({
                        editing: false,
                        ...(currentNet.id ? {} : { currentNet: null })
                    })
                }, error => {
                    this.setState({
                        errors: [...this.state.errors, error]
                    })
                })
            }
        })
    }

    /**
     * 删除绑定
     */
    handleDeleteNet(netInfo) {
        ShareMgnt('DocLimitm_GetDocs', [netInfo.id]).then(docLibInfos => {
            ShareMgnt('DocLimitm_DeleteNet', [netInfo.id]).then(() => {
                this.getNetInfos()
                docLibInfos.forEach(lib => {
                    manageLog(
                        ManagementOps.SET,
                        __('解除IP网段与文档库/归档库“${lib}”的绑定 成功', { lib: lib.name }),
                        __('解除绑定的IP为${ip}，${subNetMask}', netInfo),
                        Level.WARN
                    )
                })
            })
        })
    }

    /**
     * 添加文档库
     */
    handleAddDocLib() {
        this.setState({
            status: Status.AddDocLib
        })
    }

    /**
     * 取消添加文档库
     */
    handleCancelAddDocLib() {
        this.setState({
            status: Status.Normal
        })
    }

    /**
     * 提交文档库
     */
    handleSubmitDocLib(libs) {
        ShareMgnt('DocLimitm_AddDocs', [this.state.currentNet.id, libs.map(lib => lib.docId)]).then(() => {
            this.getNetDocLibs(this.state.currentNet.id)
            this.setState({
                status: Status.Normal
            })
            manageLog(
                ManagementOps.SET,
                __('IP网段绑定文档库/归档库“${libs}” 成功', { libs: libs.map(lib => lib.name).join() }),
                __('绑定的IP为${ip}，${subNetMask}', this.state.currentNet),
                Level.WARN
            )
        })
    }

    /**
     * 删除文档库
     */
    handleDeleteDocLib(lib) {
        ShareMgnt('DocLimitm_DeleteDocs', [this.state.currentNet.id, lib.id]).then(() => {
            this.getNetDocLibs(this.state.currentNet.id)
            manageLog(
                ManagementOps.SET,
                __('解除IP网段与文档库/归档库“${lib}”的绑定 成功', { lib: lib.name }),
                __('解除绑定的IP为${ip}，${subNetMask}', this.state.currentNet),
                Level.WARN
            )
        })
    }

    /**
     * 网段输入
     */
    handleNetChange(net) {
        let {currentNet} = this.state
        this.setState({
            currentNet: { ...currentNet, ...net },
            ipValidateState: ValidateStates.Normal,
            subNetMaskValidateState: ValidateStates.Normal
        })
    }

    /**
     * 输入框失焦
     */
    handleNetBlur() {
        this.setState({
            ipValidateState: ValidateStates.Normal,
            subNetMaskValidateState: ValidateStates.Normal
        })
    }

    /**
     * 搜索网段结果
     */
    handleSearchNetLoaded(netInfos) {
        this.setState({
            netInfos
        })
    }

    /**
     * 搜索文档库结果
     */
    handleSearchDocLibLoaded(docLibInfos) {
        this.setState({
            docLibInfos
        })
    }

    /**
     * 错误弹窗
     */
    handleConfirmError(){
        this.setState({
            errors: this.state.errors.slice(1)
        })
    }
}
