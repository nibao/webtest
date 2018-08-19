import * as React from 'react';
import { all, uniq } from 'lodash';
import { PERMISSIONS } from '../../core/linkconfig/linkconfig';
import { findRelation, LinkSharePermissionOptions, setLinkSharePerm, unsetLinkSharePerm, buildSelectionText } from '../../core/permission/permission';
import { bitSum, bitSub } from '../../util/accessor/accessor';
import { addLinkTemplate, editLinkTemplate } from '../../core/thrift/template/template';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { NodeType } from '../OrganizationTree/helper';
import __ from './locale';

export enum TemplateType {
    // 内链
    SHARE,

    // 外链 
    LINK_SHARE
}

export enum ValidateState {
    // 正常状态
    OK,

    // 没有共享者
    NO_SHARER,

    // 没有设允许权限
    NO_ALLOW_PERM,

    // 没有设默认权限
    NO_DEFAULT_PERM,

    // 有效期文本框为空
    NO_EXPIRE_VALUE,

    // 有效次数文本框为空
    NO_TIMES_VALUE
}

export enum ErrorType {
    // 正常状态
    NORMAL,
    // 共享者冲突
    SHARECONFLICT
}


export enum Mode {

    // 创建
    CREATE = 1,

    // 编辑
    EDIT = 2
}


interface Props {

    // 操作类型
    mode: Mode;

    // 模板数据
    template?: Template;

    // 取消设置
    onCancelSetTemplate: () => {};

    // 确定设置
    onConfirmSetTemplate: (value) => {};

    // 重新加载
    onError: (error) => {};
}

interface State {

    // 打开增加模板限制范围
    showOrganizationPicker: boolean

    // 模板数据
    template: Template;

    // 重复添加共享者
    repeatAddSharer: String;

    // 错误类型
    errorType: ErrorType;

    // 验证错误
    validateResult: ValidatorType;
}

interface ValidatorType {
    // 是否有共享者
    sharer: ValidateState;

    // 是否限制有权限
    allowPerm: ValidateState;

    // 是否默认权限
    defualtPerm: ValidateState;

    // 有效期文本框为空
    expireValue: ValidateState;

    // 有效次数文本框为空
    timesValue: ValidateState;
}

interface Template {

    // 模板数据Id
    templateId?: string;

    // 共享者
    sharerInfos: Array<ShareInfos> | Array<string>;

    // 模板配置信息
    config: Config;

    // 模板类型
    templateType: TemplateType;
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

export default class LinkShareTemplateConfigBase extends React.Component<Props, any> {
    // 默认新建初始化数据
    static DefaultTemplate: Template = {
        sharerInfos: [],
        templateType: TemplateType.LINK_SHARE,
        config: {
            allowPerm: 7,
            defaultPerm: 3,
            limitExpireDays: false,
            allowExpireDays: 30,
            limitAccessTimes: false,
            allowAccessTimes: 10,
            accessPassword: false
        }
    }

    state = {
        showOrganizationPicker: false,
        template: null,
        errorType: ErrorType.NORMAL,
        validateResult: {
            // 是否有共享者
            sharer: ValidateState.OK,

            // 是否限制有权限
            allowPerm: ValidateState.OK,

            // 是否默认权限
            defualtPerm: ValidateState.OK,

            // 有效期文本框为空
            expireValue: ValidateState.OK,

            // 有效次数文本框为空
            timesValue: ValidateState.OK
        }
    }

    componentWillMount() {
        this.props.mode === Mode.CREATE ?
            this.setState({
                template: { ...LinkShareTemplateConfigBase.DefaultTemplate }
            }) :
            this.setState({
                template: { ...this.props.template }
            })
    }

    /**
     * 显示或隐藏增加用户或部门
     */
    toggleAddLimitRange(show) {
        this.setState({
            showOrganizationPicker: show
        })
    }

    /**
     * 保存增加用户和部门
     * @param value
     */
    confirmAddLimitRange(value: any) {
        this.toggleAddLimitRange(false)
        this.updateValidatorType({ sharer: ValidateState.OK })
        this.updateTemplate({ sharerInfos: uniq([...this.state.template.sharerInfos, ...value], 'sharerId') })
    }

    /**
     * 格式化模板范围
     * @param value 模板的单个范围
     * @return name 返回显示的名称
     */
    formatterSharer(value: ShareInfos): string {
        return value.sharerName;
    }

    /**
     * 设置模板范围
     * @param value 模板范围
     */
    setLimitRange(value: Array<ShareInfos>) {
        this.updateTemplate({ sharerInfos: [...value] })
    }

    /**
     * 设置限制权限
     * @param checked, perm 复选框是否选中，权限值 
     */
    updateAllowPerm(checked: boolean, perm: number) {
        // 清除表单验证
        this.updateValidatorType({ allowPerm: ValidateState.OK })

        checked ?
            this.updateConfig({ allowPerm: setLinkSharePerm({ allow: this.state.template.config.allowPerm }, perm).allow }) :
            this.updateConfig({
                allowPerm: unsetLinkSharePerm({ allow: this.state.template.config.allowPerm }, perm).allow,
                defaultPerm: unsetLinkSharePerm({ allow: this.state.template.config.defaultPerm }, perm).allow
            })

    }

    /**
     * 设置默认权限
     * @param checked, perm 复选框是否选中，权限值
     */
    updateDefaultPerm(checked: boolean, perm: number) {
        // 清除表单验证
        this.updateValidatorType({ defualtPerm: ValidateState.OK })

        checked ?
            this.updateConfig({ defaultPerm: setLinkSharePerm({ allow: this.state.template.config.defaultPerm }, perm).allow }) :
            this.updateConfig({ defaultPerm: unsetLinkSharePerm({ allow: this.state.template.config.defaultPerm }, perm).allow })
    }


    /**
     * 选择是否限制有效期
     * @param check选中项的值 value 当前选择项
     */
    selectLimitExpireDay(check: boolean, value: number) {
        // 清除表单验证
        this.updateValidatorType({ expireValue: ValidateState.OK })
        this.updateConfig({ limitExpireDays: value, allowExpireDays: 30 })
    }

    /**
     * 设置限制有效期
     * @param value 文本框的输入值
     */
    setAllowExpireDay(value: number | string) {
        // 清除表单验证
        this.updateValidatorType({ expireValue: ValidateState.OK })

        this.updateConfig({ allowExpireDays: value === '' ? value : Number(value) });
    }

    /**
     * 设置强制使用密码
     * @param value 是否强制密码
     */
    setAccessPassword(value: boolean) {
        this.updateConfig({ accessPassword: value });
    }

    /**
     * 选择是否限制打开次数
     */
    setLimitAccessTimes(check, value) {
        // 清除表单验证
        this.updateValidatorType({ timesValue: ValidateState.OK })

        this.updateConfig({ limitAccessTimes: value, allowAccessTimes: 10 })
    }

    /**
     * 设置限制打开次数
     * @param value 限制打开次数
     */
    setAllowAccessTimes(value: number | string) {
        // 清除表单验证
        this.updateValidatorType({ timesValue: ValidateState.OK })

        this.updateConfig({ allowAccessTimes: value === '' ? value : Number(value) });
    }

    /**
     * 更新配置数据
     * @param config 配置数据
     */
    updateConfig(config: Object) {
        this.updateTemplate({ config: { ...this.state.template.config, ...config } })
    }

    /**
     * 更新模板数据
     * @param value 需要更新的值
     */
    updateTemplate(value: Object | Array<any>) {
        this.setState({
            template: { ...this.state.template, ...value }
        })
    }
    /**
     * 取消设置
     */
    cancelTemplateSet() {
        this.props.onCancelSetTemplate()
    }

    /**
     * 确定设置
     */
    confirmTemplateSet() {
        if (this.checkForm(this.state.template)) {
            if (this.props.mode === Mode.CREATE) {
                this.saveCreateTemplate().then(() => {
                    this.props.onConfirmSetTemplate()
                })
            } else {
                this.saveEditTemplate().then(() => {
                    this.props.onConfirmSetTemplate()
                })
            }
        }
    }

    /**
     * 保存新建
     */
    saveCreateTemplate(): PromiseLike<any> {
        return addLinkTemplate({
            templateType: TemplateType.LINK_SHARE,
            sharerInfos: this.state.template.sharerInfos.map(value => {
                return {
                    'ncTLinkShareInfo': {
                        ...value,
                        sharerType: value.sharerType === 2 ? 1 : 2
                    }
                }
            }),
            config: JSON.stringify(this.state.template.config)
        }).then(res => {
            if (res && res.length) {
                this.setState({
                    repeatAddSharer: res.join(','),
                    errorType: ErrorType.SHARECONFLICT
                })
                return Promise.reject(res);
            } else {
                this.setLog(Mode.CREATE);
            }
        }, xhr => {
            this.props.onError(xhr.error.errID)
        })
    }

    /**
     * 保存编辑
     */
    saveEditTemplate(): PromiseLike<any> {
        return editLinkTemplate({
            templateId: this.state.template.templateId,
            templateType: TemplateType.LINK_SHARE,
            sharerInfos: this.state.template.sharerInfos.map(value => {
                return {
                    'ncTLinkShareInfo': {
                        ...value,
                        sharerType: value.sharerType === 2 ? 1 : 2
                    }
                }
            }),
            config: JSON.stringify(this.state.template.config)
        }).then(res => {
            if (res && res.length) {
                this.setState({
                    repeatAddSharer: res.join(','),
                    errorType: ErrorType.SHARECONFLICT
                })
                return Promise.reject(res);
            } else {
                this.setLog(Mode.EDIT);
            }
        }, xhr => {
            this.props.onError(xhr.error.errID)
        })
    }

    /**
     * 检查表单是否合法
     * @param formData 表单信息
     */

    checkForm(formData: Template): boolean {
        let validatorType = {
            // 是否有共享者
            sharer: ValidateState.OK,

            // 是否限制有权限
            allowPerm: ValidateState.OK,

            // 是否默认权限
            defualtPerm: ValidateState.OK,

            // 有效期文本框为空
            expireValue: ValidateState.OK,

            // 有效次数文本框为空
            timesValue: ValidateState.OK
        }
        // 判断是否有共享者
        if (formData.sharerInfos.length === 0) {
            validatorType = { ...validatorType, sharer: ValidateState.NO_SHARER };
        }

        // 判断是否有限制权限
        if (formData.config.allowPerm === 0) {
            validatorType = { ...validatorType, allowPerm: ValidateState.NO_ALLOW_PERM };
        }

        // 判断是否有默认权限
        if (formData.config.defaultPerm === 0) {
            validatorType = { ...validatorType, defualtPerm: ValidateState.NO_DEFAULT_PERM };
        }

        // 判断是否有有效期
        if (!formData.config.allowExpireDays) {
            validatorType = { ...validatorType, expireValue: ValidateState.NO_EXPIRE_VALUE };
        }

        // 判断是否有有效次数限制
        if (!formData.config.allowAccessTimes) {
            validatorType = { ...validatorType, timesValue: ValidateState.NO_TIMES_VALUE };
        }

        this.updateValidatorType(validatorType);
        return all(validatorType, function (value) {
            return value === ValidateState.OK;
        });

    }

    /**
     * 记日志
     * @param mode 日志的操作类型 
     */
    setLog(mode: Mode) {
        if (mode === Mode.CREATE) {
            manageLog(ManagementOps.ADD, __('添加 外链共享模板 成功'), __('共享者：${sharer}；可设定的访问权限：${allowPerm} ；默认访问权限：${defaultPerm} ；外链有效期：${expireday}；访问密码：${password}；外链打开次数：${times}', {
                'sharer': this.state.template.sharerInfos.map(value => value.sharerName).join(','),
                'allowPerm': buildSelectionText(LinkSharePermissionOptions, { allow: this.state.template.config.allowPerm }),
                'defaultPerm': buildSelectionText(LinkSharePermissionOptions, { allow: this.state.template.config.defaultPerm }),
                'expireday': this.state.template.config.limitExpireDays ?
                    __('限制天数设置（最大有效期：${expire}天）', { 'expire': this.state.template.config.allowExpireDays }) :
                    __('不限制天数设置（默认有效期：${expire}天）', { 'expire': this.state.template.config.allowExpireDays }),
                'password': this.state.template.config.accessPassword ? __('强制使用') : __('非强制使用'),
                'times': this.state.template.config.limitAccessTimes ?
                    __('限制（最多打开次数：${times}次）', { 'times': this.state.template.config.allowAccessTimes }) :
                    __('不限制（设定限制时默认次数：${times}次)', { 'times': this.state.template.config.allowAccessTimes })
            }), Level.INFO)
        } else {
            manageLog(ManagementOps.SET, __('编辑 外链共享模板 成功'), __('共享者：${sharer}；可设定的访问权限：${allowPerm} ；默认访问权限：${defaultPerm} ；外链有效期：${expireday}；访问密码：${password}；外链打开次数：${times}', {
                'sharer': this.state.template.sharerInfos.map(value => value.sharerName).join(','),
                'allowPerm': buildSelectionText(LinkSharePermissionOptions, { allow: this.state.template.config.allowPerm }),
                'defaultPerm': buildSelectionText(LinkSharePermissionOptions, { allow: this.state.template.config.defaultPerm }),
                'expireday': this.state.template.config.limitExpireDays ?
                    __('限制天数设置（最大有效期：${expire}天）', { 'expire': this.state.template.config.allowExpireDays }) :
                    __('不限制天数设置（默认有效期：${expire}天）', { 'expire': this.state.template.config.allowExpireDays }),
                'password': this.state.template.config.accessPassword ? __('强制使用') : __('非强制使用'),
                'times': this.state.template.config.limitAccessTimes ?
                    __('限制（最多打开次数：${times}次）', { 'times': this.state.template.config.allowAccessTimes }) :
                    __('不限制（设定限制时默认次数：${times}次)', { 'times': this.state.template.config.allowAccessTimes })
            }), Level.INFO)
        }
    }

    /**
     * 转换数据
     */
    convererData(value) {
        return {
            sharerId: value.id,
            sharerName: value.name,
            sharerType: value.type
        }
    }

    /**
     * 关闭冲突
     */
    closeConflictDialog() {
        this.setState({
            errorType: ErrorType.NORMAL
        })
    }

    /**
     * 更新模板验证状态
     * 
     */
    updateValidatorType(value) {
        this.setState({
            validateResult: { ...this.state.validateResult, ...value }
        })
    }
}