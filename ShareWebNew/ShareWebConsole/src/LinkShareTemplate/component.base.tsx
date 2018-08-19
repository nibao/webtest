import * as React from 'react';
import WebComponent from '../webcomponent';
import { find, reduce, filter } from 'lodash'
import { PERMISSIONS } from '../../core/linkconfig/linkconfig';
import { getLinkTemplate, deleteLinkTemplate, searchLinkTemplate } from '../../core/thrift/template/template';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { buildSelectionText, LinkSharePermissionOptions } from '../../core/permission/permission';
import { NodeType } from '../OrganizationTree/helper';
import __ from './locale';

export enum TemplateType {
    // 内链
    SHARE,

    // 外链 
    LINK_SHARE
}

export enum ErrorType {
    // 正常状态
    NORMAL
}

export enum EditTempalteStatus {
    // 正常状态
    NORMAL,

    // 新建
    CREATE,

    // 编辑 
    EDIT
}

interface State {
    // 模板数据
    templateData: Array<TemplateInfo>;

    // 添加状态或编辑状态
    showEditDialog: EditTempalteStatus;

    // 当前数据
    currentData: TemplateInfo;

    // 错误类型
    errorType: ErrorType;

    //
    searchKey: string;
}

interface TemplateInfo {
    // 模板id
    templateId: string;

    // 模板类型
    templateType: TemplateType;

    // 模板作用范围，共享者
    sharerInfos: Array<ShareInfos> | Array<string>;

    // 模板配置信息
    config: Config;
}

interface ShareInfos {

    // 共享者id
    sharerId: string;

    // 共享者名称
    sharerName: string;

    // 共享者类型
    sharerType: NodeType;
}

interface Config {

    // 限制权限
    allowPerm: number;

    // 默认权限
    defaultPerm: number;

    // 限制有效期
    limitExpireDays: boolean;

    // 不限制默认有效期
    allowExpireDays: number;

    // 限制打开次数
    limitAccessTimes: boolean;

    // 不限制默认打开次数
    allowAccessTimes: number;

    // 是否强制访问密码
    accessPassword: boolean;
}


export default class LinkShareTemplateBase extends WebComponent<any, any> {

    state = {
        templateData: [],
        showEditDialog: EditTempalteStatus.NORMAL,
        currentData: null,
        errorType: ErrorType.NORMAL
    }

    componentWillMount() {
        this.reloadTemplatedata()
    }

    /**
     * 获取所有模板数据
     * @return Promise 所有数据
     */
    getTemplateData(): PromiseLike<Array<TemplateInfo>> {
        return getLinkTemplate(TemplateType.LINK_SHARE).then(function (data) {
            return data.map(value => {
                return {
                    ...value, config: JSON.parse(value.config), sharerInfos: value.sharerInfos.map(value => {
                        return { ...value, sharerType: value.sharerType === 1 ? NodeType.USER : NodeType.DEPARTMENT }
                    })
                }
            })
        })
    }

    /**
     * 更新所有模板数据
     */
    updateTemplateData(templateData: Array<TemplateInfo>) {
        CoverLayer(0)
        this.setState({
            templateData: templateData
        })
    }

    /**
     * 选中一条事件
     */
    selectData(value: TemplateInfo) {
        this.setState({
            currentData: value
        })
    }

    /**
     * 新建
     */
    triggerCreate() {
        this.setState({
            showEditDialog: EditTempalteStatus.CREATE
        })
    }
    /**
     * 编辑
     */
    triggerEdit() {
        this.setState({
            showEditDialog: EditTempalteStatus.EDIT
        })
    }
    /**
     * 保存本次设置
     */
    saveSetData() {
        if (this.state.searchKey) {
            this.setState({
                searchKey: ''
            })
        }             
        this.reloadTemplatedata()
    }

    /**
     * 选中数据
     */
    selectChangedData(data, prevData) {
        if (this.state.showEditDialog === EditTempalteStatus.EDIT) {
            // 关闭窗口，以为showEditDialog在编辑后要被用作判断条件，等于EditTempalteStatus.EDIT是进行过编辑刷新表格，
            this.setState({
                showEditDialog: EditTempalteStatus.NORMAL
            })
            return find(this.state.templateData, (value) => {
                return value.templateId === this.state.currentData.templateId;
            })
        } else if (this.state.showEditDialog === EditTempalteStatus.CREATE && data.length > prevData.length) {
            // 关闭窗口，以为showEditDialog在编辑后要被用作判断条件，等于EditTempalteStatus.CREATE是进行过新建刷新表格
            this.setState({
                showEditDialog: EditTempalteStatus.NORMAL
            })
            return find(data, currentValue => {
                return !find(prevData, value => {
                    return value.templateId === currentValue.templateId
                })
            })
        }
    }

    /**
     * 删除模板
     * @param value 当前选中的数据
     */
    deleteData(value: TemplateInfo) {
        deleteLinkTemplate(value.templateId).then(() => {
            this.updateTemplateData([...filter(this.state.templateData, (value) => {
                return value.templateId !== this.state.currentData.templateId
            })])
        }, xhr => {
            this.onShowError(xhr.error.errID)
        })
        this.setLog()
    }

    /**
     * 搜索模板
     */
    searchData(key: string) {
        if (key) {
            return searchLinkTemplate(TemplateType.LINK_SHARE, key).then(function (data) {
                return data.map(value => {
                    return {
                        ...value, config: JSON.parse(value.config), sharerInfos: value.sharerInfos.map(value => {
                            // 服务端和前端的部门，用户，组织转换
                            return { ...value, sharerType: value.sharerType === 1 ? NodeType.USER : NodeType.DEPARTMENT }
                        })
                    }
                })
            })
        } else {
            return this.getTemplateData()
        }

    }

    setLoadingStatus() {
        CoverLayer(1, __('正在加载......'))
    }

    /**
     * 取消本次设置
     */
    cancelSetData() {
        this.setState({
            showEditDialog: EditTempalteStatus.NORMAL
        })
    }

    /**
     * 重新加载表格
     */
    reloadTemplatedata() {
        this.getTemplateData().then(data => {
            this.updateTemplateData(data)
        })
    }

    /**
     * 关闭错误弹窗
     */
    closeErrorDialog() {
        this.setState({
            errorType: ErrorType.NORMAL
        })
        this.reloadTemplatedata();
    }

    /**
     * 显示错误弹窗
     */
    onShowError(error) {
        this.setState({
            errorType: error,
            showEditDialog: EditTempalteStatus.NORMAL
        })
    }


    /**
    * 记日志
    * @param mode 日志的操作类型 
    */
    setLog() {
        manageLog(ManagementOps.DELETE, __('删除 外链共享模板 成功'), __('共享者：${sharer}；可设定的访问权限：${allowPerm} ；默认访问权限：${defaultPerm} ；外链有效期：${expireday}；访问密码：${password}；外链打开次数：${times}', {
            'sharer': this.state.currentData.sharerInfos.map(value => value.sharerName).join(','),
            'allowPerm': buildSelectionText(LinkSharePermissionOptions, { allow: this.state.currentData.config.allowPerm }),
            'defaultPerm': buildSelectionText(LinkSharePermissionOptions, { allow: this.state.currentData.config.defaultPerm }),
            'expireday': this.state.currentData.config.limitExpireDays ?
                `${__('限制')},${__('（最大有效期：${expire}天）', { 'expire': this.state.currentData.config.allowExpireDays })}` :
                `${__('不限制')},${__('（默认有效期：${expire}天）', { 'expire': this.state.currentData.config.allowExpireDays })}`,
            'password': this.state.currentData.config.accessPassword ? __('非强制使用') : __('强制使用'),
            'times': this.state.currentData.config.limitAccessTimes ?
                `${__('限制')},${__('（可设定最多次数：${time}次）', { 'time': this.state.currentData.config.allowAccessTimes })}` :
                `${__('不限制')}, ${__('（默认次数：${time}次）', { 'time': this.state.currentData.config.allowAccessTimes })}`
        }), Level.WARN)
    }

    /**
     * 搜索关键字发生改变
     * @param key 
     */

    searchChange(key: string) {
        this.setState({
            searchKey: key
        })
    }

}