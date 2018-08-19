/// <reference path="../../../core/thrift/template/template.d.ts" />

import * as React from 'react';
import { noop, sum, pick, filter, assign, uniq, trim, omit, map } from 'lodash';
import { SharePermission, setShareAllowPerm, unsetShareAllowPerm, splitPerm } from '../../../core/permission/permission';
import { ShareMgnt } from '../../../core/thrift/thrift';
import { addLinkTemplate, editLinkTemplate } from '../../../core/thrift/template/template';
import { PureComponent } from '../../../ui/decorators';
import WebComponent from '../../webcomponent';
import { Mode } from './helper'


interface Props {
    // 编辑或添加
    mode: Mode;
    // 模板
    template: Template;
    // 重新加载
    onError: (error) => {};
}

interface State {
    // 模板
    template: Template;
}

interface Config {
    // 可设定权限值
    allowPerm: number;
    // 默认权限值
    defaultPerm: number;
    // 可设定所有者
    allowOwner: boolean;
    // 默认所有者
    defaultOwner: boolean;
    // 是否限制
    validExpireDays: boolean;
    // 默认有效期
    defaultExpireDays: number | '';
    // 可设定的最大有效期
    maxExpireDays: number | '';
}

// 模板
interface Template {
    config: Config;
    shareInfos: Array<Core.Template.ncTLinkShareInfo>;
}

interface EditTemplate extends Template {
    templateType: number;
    templateId: string;
}

interface Base {
    props: Props;
    state: State;
}
// 内链模板type值
const TEMPLATE_TYPE = 0;

// 可设定访问权限初始值
const DEFAULT_ALLOW_PERMVALUE = 127;

// 涉密模式下可设定访问权限初始值
const DEFAULT_SECRET_PERMVALUE = 95;

// 默认访问权限初始值
const DEFAULT_PERMVALUE = 71;

// 默认有效期初始值
const DEFAULT_ALWAYS_TIME = -1;

// 默认有效期自定义初始值
const DEFAULT_CUSTOM_TIME = 30;

const TIP_DELAY_TIME = 3000;

const EMPTY_EXPIRE_DAYS = 0;

@PureComponent
export default class ConfigBase extends WebComponent<Props, State> implements React.Component<Props, State> {

    static DefaultTemplate: Template = {
        // 共享者
        shareInfos: [],
        config: {
            // 可设定的访问权限
            allowPerm: DEFAULT_ALLOW_PERMVALUE,
            // 默认的访问权限
            defaultPerm: DEFAULT_PERMVALUE,
            // 可设定所有者
            allowOwner: false,
            // 默认所有者
            defaultOwner: false,
            // 有效期是否限制，默认不限制
            validExpireDays: false,
            // 默认有效期
            defaultExpireDays: DEFAULT_ALWAYS_TIME,
            // 可设定的最大有效期
            maxExpireDays: ''
        }
    }

    static defaultProps = {
        mode: Mode.CREATE,
        // 模板
        template: {} as EditTemplate,
    }

    state = {
        // 模板
        template: ConfigBase.DefaultTemplate,
        // 是否开启涉密模式
        secretMode: false,
        // 显示添加访共享者弹出框
        showSharePicker: false,
        // 显示自定义日期
        showCustom: false,
        // 默认访问权限禁用项
        defaultDisabledOpitions: this.getDisabledOptions(ConfigBase.DefaultTemplate.config.allowPerm, ConfigBase.DefaultTemplate.config.allowOwner),
        // 共享者为空提示
        showShareInfosEmptyMsg: false,
        // 默认有效期文本框为空
        defaultExpireDayValidateState: null,
        // 最大有效期文本框为空
        maxExpireDayValidateState: null,
        // 已存在模板策略的共享者
        existSharerNames: [],
    }

    componentWillMount() {
        this.initData(this.props.template);
    }


    // componentDidMount() {
    //     this.initData(this.props.template);
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.mode !== this.props.mode || nextProps.template !== this.props.template) {
    //         this.initData(nextProps.template);
    //     }

    // }

    // 初始化数据
    initData(template) {
        if (this.props.mode === Mode.CREATE) {
            this.initAddTemplate(this.props.secretMode);
        } else {
            this.initEditTemplate(template, this.props.secretMode);
        }
    }

    // 添加模板初始化
    initAddTemplate(secretMode) {
        if (secretMode) {
            this.setState({
                template: this.updateConfig({ allowPerm: DEFAULT_SECRET_PERMVALUE, allowOwner: false, defaultExpireDays: DEFAULT_CUSTOM_TIME }),
                defaultDisabledOpitions: this.getDisabledOptions(DEFAULT_SECRET_PERMVALUE, false),
                showCustom: true
            })
        }
    }

    // 编辑模板初始化
    initEditTemplate(template, secretMode) {
        let config = this.updateConfigBySecretMode(this.formatterJSONToConfig(template.config), secretMode);
        this.setState({
            template: {
                templateId: template.templateId,
                config,
                shareInfos: template.sharerInfos,
                templateType: template.templateType
            },
            defaultDisabledOpitions: this.getDisabledOptions(config.allowPerm, config.allowOwner),
            showCustom: secretMode ? true : config.validExpireDays === false && config.defaultExpireDays !== -1 ? true : false
        })
    }

    /**
     * 涉密模式下，删除默认不选中，allowOwner默认false
     * @param config 
     * @param secretMode 
     */
    private updateConfigBySecretMode(config: Config, secretMode: boolean) {
        return secretMode ?
            {
                ...config,
                allowPerm: config.allowPerm,
                defaultPerm: config.defaultPerm,
                allowOwner: false,
                defaultOwner: false,
                defaultExpireDays: secretMode && config.validExpireDays === false && config.defaultExpireDays === DEFAULT_ALWAYS_TIME ? DEFAULT_CUSTOM_TIME : config.defaultExpireDays
            }
            : config;
    }

    setDefaultPermTime(value) {
        this.setState({
            template: this.updateConfig({ defaultExpireDays: value === '' ? '' : parseInt(value) }),
            defaultExpireDayValidateState: null,
        })
    }

    setMaxPermTime(value) {
        this.setState({
            template: this.updateConfig({ maxExpireDays: value === '' ? '' : parseInt(value) }),
            maxExpireDayValidateState: null
        })
    }

    onChangeLimit(check, litmited: boolean) {
        this.setState({
            template: this.updateConfig({
                validExpireDays: litmited,
                defaultExpireDays: this.state.showCustom ? (litmited === false ? DEFAULT_CUSTOM_TIME : '') : DEFAULT_ALWAYS_TIME,
                maxExpireDays: litmited === true ? DEFAULT_CUSTOM_TIME : ''
            }),
            defaultExpireDayValidateState: null,
            maxExpireDayValidateState: null
        })
    }

    close() {
        this.props.onCancel();
    }

    submit() {
        if (this.state.template.shareInfos.length === 0) {
            this.setState({
                showShareInfosEmptyMsg: true
            })
            return
        }
        if (this.state.template.config.maxExpireDays === '' && this.state.template.config.validExpireDays === true) {
            this.setState({
                maxExpireDayValidateState: EMPTY_EXPIRE_DAYS,

            })
            return
        }
        if (this.state.template.config.defaultExpireDays === '' && this.state.template.config.validExpireDays === false) {
            this.setState({
                defaultExpireDayValidateState: EMPTY_EXPIRE_DAYS,

            })
            return
        }
        if (this.props.mode === Mode.CREATE) {
            addLinkTemplate({ templateType: TEMPLATE_TYPE, sharerInfos: this.formatterToShareInfosArr(this.state.template.shareInfos), config: this.formatterConfigToJSON(this.state.template.config) }).then(data => {
                this.setState({
                    existSharerNames: data
                }, () => {
                    if (data && data.length === 0) {
                        this.fireSubmitEvent({ sharerInfos: this.state.template.shareInfos, config: this.formatterConfigToJSON(this.state.template.config) }, Mode.CREATE, true);
                    } else {
                        this.fireSubmitEvent({ sharerInfos: this.state.template.shareInfos, config: this.formatterConfigToJSON(this.state.template.config) }, Mode.CREATE, false);
                    }
                })
            }, xhr => {
                this.props.onError(xhr.error.errID)
            })
        } else {
            editLinkTemplate({ templateType: TEMPLATE_TYPE, templateId: this.state.template.templateId, sharerInfos: this.formatterToShareInfosArr(this.state.template.shareInfos), config: this.formatterConfigToJSON(this.state.template.config) }).then(data => {
                this.setState({
                    existSharerNames: data
                }, () => {
                    if (data && data.length === 0) {
                        this.fireSubmitEvent({ sharerInfos: this.state.template.shareInfos, config: this.formatterConfigToJSON(this.state.template.config) }, Mode.Edit, true);
                    } else {
                        this.fireSubmitEvent({ sharerInfos: this.state.template.shareInfos, config: this.formatterConfigToJSON(this.state.template.config) }, Mode.Edit, false);
                    }
                })
            }, xhr => {
                this.props.onError(xhr.error.errID)
            })
        }
    }

    private fireSubmitEvent(template, mode, result) {
        this.props.onSubmit(template, mode, result);
    }

    back() {
        this.setState({
            existSharerNames: []
        })
    }

    /**
     * 转换成{sharerId,sharerType,sharerName}结构
     * @param shareInfos 
     */
    formatterToShareInfos(shareInfos) {
        return shareInfos.reduce((prevs, share) => {
            return [...prevs, share.userid ? { sharerId: share.userid, sharerType: 1, sharerName: share.userName } : { sharerId: share.departmentId, sharerType: 2, sharerName: share.departmentName }]
        }, [])
    }

    /**
    * 转换成{ncTLinkShareInfo:share}结构
    * @param shareInfos 
    */
    formatterToShareInfosArr(shareInfos) {
        return shareInfos.reduce((prevs, ncTLinkShareInfo) => {
            return [...prevs, { ncTLinkShareInfo }]
        }, [])
    }

    /**
    * 将Config类型数据转换成json字符串
    * @param config 
    */
    formatterConfigToJSON(config: Config) {
        return JSON.stringify({
            allowPerm: config.allowPerm,
            defaultPerm: config.defaultPerm,
            allowOwner: config.allowOwner,
            defaultOwner: config.defaultOwner,
            limitExpireDays: config.validExpireDays,
            allowExpireDays: config.validExpireDays ? config.maxExpireDays : config.defaultExpireDays
        })
    }

    /**
     * 将json字符串转换成Config类型数据
     * @param json 
     */
    formatterJSONToConfig(json: string): Config {
        let config = JSON.parse(json)
        return {
            allowPerm: config.allowPerm || DEFAULT_ALLOW_PERMVALUE,
            defaultPerm: config.defaultPerm || DEFAULT_PERMVALUE,
            allowOwner: config.allowOwner || false,
            defaultOwner: config.defaultOwner || false,
            validExpireDays: config.limitExpireDays || false,
            defaultExpireDays: config.limitExpireDays === false ? config.allowExpireDays : '',
            maxExpireDays: config.limitExpireDays === true ? config.allowExpireDays : ''
        }
    }

    handleSelect(showCustom) {
        if (showCustom) {
            this.setState({
                template: this.updateConfig({ defaultExpireDays: DEFAULT_CUSTOM_TIME })
            })
        } else {
            this.setState({
                template: this.updateConfig({ defaultExpireDays: DEFAULT_ALWAYS_TIME }),
                defaultExpireDayValidateState: null
            })
        }
        this.setState({
            showCustom
        })
    }

    /**
     * 打开添加共享者
     */
    openSharePicker() {
        this.setState({
            showSharePicker: true,
            showShareInfosEmptyMsg: false
        })
    }

    /**
     * 关闭添加共享者
     */
    closeSharePicker() {
        this.setState({
            showSharePicker: false
        })
    }

    /**
     * 添加共享者
     * @param shareInfos 
     */
    addShareInfos(shareInfos) {
        this.setState({
            template: this.updateTemplate({ shareInfos: uniq([...this.state.template.shareInfos, ...shareInfos], info => info.sharerId) }),
            showSharePicker: false
        })
    }

    setShareInfos(data: Array<object>) {
        this.setState({
            template: this.updateTemplate({ shareInfos: data })
        })
    }

    /**
     * 获取部门名
     * @param dep 部门
     * @return 返回部门名
     */
    shareInfoFormatter(shareInfos): string {
        return shareInfos.sharerName;
    }

    /**
   * 获取禁用选项
   * @param allowPerm 
   */
    private getDisabledOptions(allowPerm: number, allowner: boolean) {
        let disabledOptions = allowner ? [] : [-1];
        let perms = splitPerm(allowPerm);
        map(perms, (value, key) => {
            if (value === false) {
                disabledOptions = [...disabledOptions, parseInt(key)];
            }
        })
        return disabledOptions;
    }


    /**
     * 更新可设定权限值
     * @param checked 
     * @param permission 
     */
    updateAllowPerm(checked: boolean, permission: SharePermission) {
        let allowPerm = this.state.template.config.allowPerm;
        this.setState({
            template: this.updateConfig({ allowPerm: this.calcPerm(allowPerm, checked, permission) })
        }, () => {
            let defaultPerm = this.state.template.config.defaultPerm;
            let disabledOptions = this.getDisabledOptions(this.state.template.config.allowPerm, this.state.template.config.allowOwner);
            this.setState({
                defaultDisabledOpitions: disabledOptions,
                template: this.updateConfig({
                    defaultPerm: disabledOptions.reduce((prevs, perms) => {
                        return perms !== -1 ? unsetShareAllowPerm({ allow: prevs }, perms).allow : prevs
                    }, defaultPerm)
                })
            })

        })
    }

    /**
     * 更新可设定所有者
     * @param checked 
     * @param permission 
     */
    updateAllowOwner(checked: boolean) {
        this.setState({
            defaultDisabledOpitions: checked === false ? [...this.state.defaultDisabledOpitions, -1] : filter(this.state.defaultDisabledOpitions, o => o !== -1),
            template: checked ? this.updateConfig({ 'allowOwner': checked }) :
                this.updateConfig({ allowOwner: checked, defaultOwner: checked })
        })
    }

    /**
     * 更新默认权限值
     * @param checked 
     * @param permission 
     */
    updateDefaultPerm(checked: boolean, permission: SharePermission) {
        let defaultPerm = this.state.template.config.defaultPerm;
        this.setState({
            template: this.updateConfig({ defaultPerm: this.calcPerm(defaultPerm, checked, permission) })
        })
    }


    /**
     * 更新默认所有者
     * @param checked 
     * @param permission 
     */
    updateDefaultOwner(checked: boolean) {
        this.setState({
            template: this.updateConfig({ defaultOwner: checked })
        })
    }

    /**
     * 获取最终的权限总值
     * @param value 
     * @param checked 
     * @param permission 
     */
    private calcPerm(value: number, checked: boolean, permission: SharePermission) {
        return checked ? setShareAllowPerm({ allow: value }, permission).allow : unsetShareAllowPerm({ allow: value }, permission).allow
    }


    /**
     * 更新config
     * @param config 
     * @param key 
     * @param value 
     */
    private updateConfig(value: object) {
        return { ...this.state.template, config: { ...this.state.template.config, ...value } }
    }


    /**
     * 更新template
     * @param key 
     * @param value 
     */
    updateTemplate(value: object) {
        return { ...this.state.template, ...value }
    }

}