import * as React from 'react';
import { filter, noop, difference, find } from 'lodash';
import { buildSelectionText, SharePermissionOptions, SharePermission, unsetShareAllowPerm } from '../../core/permission/permission';
import { getLinkTemplate, searchLinkTemplate, deleteLinkTemplate } from '../../core/thrift/template/template';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { ShareMgnt } from '../../core/thrift/thrift';
import WebComponent from '../webcomponent';
import { Mode } from './Config/helper';
import __ from './locale';


export enum ErrorType {
    // 正常状态
    NORMAL
}

interface Props {

}


interface State {
    //共享模版数据
    data: Array<TLinkTemplateInfo>;
    // 错误类型
    errorType: ErrorType;
}

//内链模板类型值为0
const INTERNAL_LINK = 0;

//默认天数
const DEFAULT_TIME = 30;

//内链共享模板信息
interface TLinkTemplateInfo {
    templateId: string,
    templateType: number,
    sharerInfos: Array<object>,
    config: string,
}

export default class ShareTemplateBase extends WebComponent<Props, any> {

    static defaultProps = {
        // 权限
        value: { isowner: false, allow: {} },
        disabledOptions: []
    }

    state = {
        // 权限
        data: [],
        //是否弹出模板
        showConfig: false,
        //编辑或添加
        mode: Mode.NORMAL,
        //选中的模板
        select: null,
        //显示清除历史
        showClearHistory: false,
        // 涉密模式
        secretMode: false,
        // 错误类型
        errorType: ErrorType.NORMAL,
        // 搜索框关键字
        searchKey: ''
    }

    componentWillMount() {
        this.initData()
    }

    // componentWillReceiveProps(nextProps) {
    //     this.initData()
    // }

    /**
     * 初始化请求数据
     */
    initData() {
        Promise.all([getLinkTemplate(INTERNAL_LINK), ShareMgnt('Secretm_GetStatus')]).then(([data, secretMode]) => {
            CoverLayer(0)
            this.setState({
                data,
                secretMode
            })
        })
    }

    onSelect(select) {
        this.setState({
            select,
        })
    }

    addTemplate() {
        this.setState({
            showConfig: true,
            mode: Mode.CREATE
        })
    }

    editTempate(template) {
        this.setState({
            showConfig: true,
            mode: Mode.Edit
        })
    }

    deleteTemplate(select) {
        deleteLinkTemplate(select.templateId).then(res => {
            this.log({ sharerInfos: select.sharerInfos, config: select.config }, Mode.DELETE, true);
        }, xhr => {
            this.onShowError(xhr.error.errID);
        })
        getLinkTemplate(INTERNAL_LINK).then((data) => {
            CoverLayer(0)
            this.setState({
                data: this.state.data.filter(o => o.templateId !== select.templateId)
            })
        });
    }

    /**
    * 根据key获取部门
    * @return 部门数组
    */
    getTemplatesByKey(key: string): PromiseLike<Array<Core.Template.ncTLinkTemplateInfo>> {
        if (key) {
            return searchLinkTemplate(INTERNAL_LINK, key)
        } else {
            return getLinkTemplate(INTERNAL_LINK)
        }
    }

    onLoad(data = []) {
        CoverLayer(0)
        if (data !== null) {
            this.setState({
                data
            })
        }
    }

    searchChange(key: string) {
        this.setState({
            searchKey: key
        })
    }

    onCancel() {
        this.setState({
            showConfig: false
        })
    }

    /**
     * 从Config编辑或添加后返回的结果
     * @param template 添加或编辑的这条模板数据
     * @param mode 添加或编辑
     * @param result 有重复共享者为false
     */
    onSubmit(template, mode, result) {
        this.log(template, mode, result);
        if (result) {
            if (this.state.searchKey !== '') {
                this.setState({
                    searchKey: ''
                })
            }
            getLinkTemplate(INTERNAL_LINK).then((data) => {
                CoverLayer(0)
                this.setState({
                    data,
                    showConfig: false,
                })
            });
        }

    }

    openClearHistory() {
        this.setState({
            showClearHistory: true
        })
    }

    closeClearHistory() {
        this.setState({
            showClearHistory: false
        })
    }

    clearHistory() {

    }

    // 记录管理日志
    log(template, mode, result) {
        switch (mode) {
            case Mode.CREATE:
                manageLog(ManagementOps.ADD, __('添加 内链共享模板 ${result}', { result: result ? __('成功') : __('失败') }), this.formatterToLogInfo(template), Level.INFO);
                break;
            case Mode.Edit:
                manageLog(ManagementOps.SET, __('编辑 内链共享模板 ${result}', { result: result ? __('成功') : __('失败') }), this.formatterToLogInfo(template), Level.INFO);
                break;
            case Mode.DELETE:
                manageLog(ManagementOps.DELETE, __('删除 内链共享模板 ${result}', { result: result ? __('成功') : __('失败') }), this.formatterToLogInfo(template), Level.WARN);
                break;
        }
    }

    formatterToLogInfo({ sharerInfos, config }) {
        return __('共享者：') + this.formatterShareInfos(sharerInfos) + ';' +
            __('可设定的访问权限：') + this.formatterAllowPerm(config, this.state.secretMode) + ';' +
            __('默认访问权限：') + this.formatterDefaultPerm(config, this.state.secretMode) + ';' +
            __('访问有效期：') + this.formatterExpireDays(config)
    }

    // 转换成共享者:xxx，xxx，xxx
    formatterShareInfos(shareInfos: Array<object>) {
        return shareInfos.reduce((prevs, shareInfo, index, array) => {
            if (shareInfo.sharerId === '-2') {
                return __('所有用户')
            }
            if (shareInfos.length > 0 && index === shareInfos.length - 1) {
                return prevs + shareInfo.sharerName
            } else {
                return prevs + shareInfo.sharerName + ','
            }
        }, '')
    }

    // 转换成默认访问权限： xx/xx/xx
    formatterDefaultPerm(configStr: string, secretMode: boolean) {
        if (configStr === '') {
            return ''
        }
        let cfg = JSON.parse(configStr);
        if (cfg.defaultOwner) {
            return buildSelectionText(SharePermissionOptions, { allow: cfg.defaultPerm }) + '/' + buildSelectionText(SharePermissionOptions, { isowner: cfg.defaultOwner })
        } else {
            return buildSelectionText(SharePermissionOptions, { allow: cfg.defaultPerm })
        }
    }

    // 转换成可设定的访问权限： xx/xx/xx 
    formatterAllowPerm(configStr: string, secretMode: boolean) {
        if (configStr === '') {
            return ''
        }
        let cfg = JSON.parse(configStr);
        if (cfg.allowOwner) {
            return buildSelectionText(SharePermissionOptions, { allow: cfg.allowPerm }) + '/' + buildSelectionText(SharePermissionOptions, { isowner: cfg.allowOwner })
        } else {
            return buildSelectionText(SharePermissionOptions, { allow: cfg.allowPerm })
        }
    }

    // 转换成访问有效期：不限制（默认有效期：永久有效）/ 不限制（默认有效期：xx天）/ 限制（最大有效期：xx天）
    formatterExpireDays(config: string) {
        if (config === '') {
            return __('不限制天数设置（默认有效期：永久有效）')
        }
        let cfg = JSON.parse(config);
        if (cfg.limitExpireDays === true) {
            return __('限制天数设置（最大有效期：${day}天）', { day: cfg.allowExpireDays })
        } else {
            if (this.state.secretMode === true) {
                return __('不限制天数设置（默认有效期：${day}天）', { day: cfg.allowExpireDays === -1 ? DEFAULT_TIME : cfg.allowExpireDays })
            }
            if (cfg.allowExpireDays > -1) {
                return __('不限制天数设置（默认有效期：${day}天）', { day: cfg.allowExpireDays })
            }
            return __('不限制天数设置（默认有效期：永久有效）')
        }
    }

    setSelectTemplate(nextData, prevsData) {
        let { mode, select, data } = this.state;
        if (mode === Mode.Edit && select) {
            this.setState({
                mode: Mode.NORMAL,
            })
            return find(data, (info) => {
                return info.templateId === select.templateId
            })
        } else if (mode === Mode.CREATE && prevsData && nextData && prevsData.length < nextData.length) {
            this.setState({
                mode: Mode.NORMAL,
            })
            return find(data, currentValue => {
                return !find(prevsData, value => {
                    return value.templateId === currentValue.templateId
                })

            })
        }
    }

    /**
    * 显示错误弹窗
    */
    onShowError(error) {
        this.setState({
            errorType: error,
            showEditDialog: Mode.NORMAL,
            showConfig: false
        })
    }

    closeErrorDialog() {
        this.setState({
            errorType: ErrorType.NORMAL
        })
    }

    setLoadingStatus() {
        CoverLayer(1, __('正在加载......'))
    }
}