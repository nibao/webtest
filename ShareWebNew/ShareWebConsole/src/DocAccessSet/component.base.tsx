import * as React from 'react';
import { noop } from 'lodash';
import { ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import __ from './locale';


/**
 * 输入框状态
 */
export enum ValidateState {
    /**
     * 正常状态
     */
    Normal = 1,
    /**
     * 为空状态
     */
    Empty,
    /**
     * cpu利用率和内存利用率
     */
    InvalidRate,
    /**
     * 权重值
     */
    Invalidweight
}

/**
 * 输入框错误提示
 */
export const ValidateMessages = {
    [ValidateState.Empty]: __('此输入项不允许为空。'),
    [ValidateState.InvalidRate]: __('只能输入1-100的数字。'),
    [ValidateState.Invalidweight]: __('只能输入2-999的数字。'),
}

export default class DocAccessSetBase extends WebComponent<Console.DocAccess.Props, Console.DocAccess.State> {
    static defaultProps = {
        handleSkip: noop,
    }
    state = {
        accessInfo: null,
        changed: false,
        validateState: {
            limitCPU: ValidateState.Normal,
            limitMemory: ValidateState.Normal,
            limitPriority: ValidateState.Normal
        }
    }

    defaultAccessInfo = {
        /**
         * 是否开启设置
         */
        isEnable: false,

        /**
         * CPU使用率
         */
        limitCPU: '',

        /**
         * 内存使用率
         */
        limitMemory: '',

        /**
         * 权重
         */
        limitPriority: '',
    }

    componentWillMount() {
        this.getAccessSet();
    }

    /**
    * 获取优先访问配置信息
    */
    private async getAccessSet() {
        this.defaultAccessInfo = await ShareMgnt('Usrm_GetPriorityAccessConfig');
        this.setState({ 
            accessInfo: {...this.defaultAccessInfo} 
        });
    }


    /**
     *  是否开启优先访问设置
     */
    protected changeLimit(isEnable) {
        this.setState({
            accessInfo: { ...this.state.accessInfo, isEnable },
            changed: true,
        })
    }

    /**
     * 检查输入有效性
     */
    protected validateCheck() {
        let { accessInfo } = this.state;
        let validatecpu = accessInfo.limitCPU && (accessInfo.limitCPU >= 1 && accessInfo.limitCPU <= 100 );
        let validatestorage = accessInfo.limitMemory && (accessInfo.limitMemory >= 1 && accessInfo.limitMemory <= 100 );
        let validateweight = accessInfo.limitPriority && (accessInfo.limitPriority >= 2 && accessInfo.limitPriority <= 999 );
        if (validatecpu && validatestorage && validateweight) {
            return true;
        } else {          
            this.setState({
                validateState: {
                    limitCPU: validatecpu ? ValidateState.Normal : accessInfo.limitCPU ? ValidateState.InvalidRate : ValidateState.Empty,
                    limitMemory: validatestorage ? ValidateState.Normal : accessInfo.limitPriority ?  ValidateState.InvalidRate : ValidateState.Empty,
                    limitPriority: validateweight ? ValidateState.Normal : accessInfo.limitPriority ? ValidateState.Invalidweight : ValidateState.Empty,
                }
            })
            return false;
        }
    }

    /**
     * 输入框输入值
     * @param accessInfo 输入值的属性
     */
    protected handleChange(accessInfo = {}) {
        let { validateState } = this.state;
        this.setState({
            changed: true,
            accessInfo: { ...this.state.accessInfo, ...accessInfo },
            validateState: {
                limitCPU: 'limitCPU' in accessInfo ? ValidateState.Normal : validateState.limitCPU,
                limitMemory: 'limitMemory' in accessInfo ? ValidateState.Normal : validateState.limitMemory,
                limitPriority: 'limitPriority' in accessInfo ? ValidateState.Normal : validateState.limitPriority
            }
        })
    }

    /**
     * 跳转至用户组织管理界面
     */
    protected handleClick() {
        this.props.handleSkip();
     }

    /**
     * 保存设置信息
     */
    protected async handleSave() {
        let { accessInfo } = this.state;
        if (this.validateCheck()) {
            try {
                await ShareMgnt(
                    'Usrm_SetPriorityAccessConfig', 
                    [{
                        ncTPriorityAccessConfig: {
                            isEnable: accessInfo.isEnable, 
                            limitCPU: Number(accessInfo.limitCPU),
                            limitMemory: Number(accessInfo.limitMemory),
                            limitPriority: Number(accessInfo.limitPriority),
                        }
                    }]
                );
                manageLog(
                    ManagementOps.SET, 
                    __('${isEnable} 优先访问策略，设置 CPU使用率高于${limitCPU}%，内存使用率高于${limitMemory}%，权重值低于${limitPriority}', 
                    {
                        isEnable: accessInfo.isEnable ? __('启用') : __('关闭'), 
                        limitCPU: accessInfo.limitCPU, 
                        limitMemory: accessInfo.limitMemory,
                        limitPriority: accessInfo.limitPriority,
                    }), 
                    '',
                    Level.INFO
                );
                this.defaultAccessInfo = {...this.defaultAccessInfo, ...accessInfo}
            } finally {
                this.setState({
                    changed: false,
                })
            }           
        }
    }


    /**
     * 取消设置
     */
    protected handleCancel() {
        this.setState({
            accessInfo: { ...this.defaultAccessInfo },
            validateState: {
                limitCPU: ValidateState.Normal,
                limitMemory: ValidateState.Normal,
                limitPriority: ValidateState.Normal
            },
        }, () => {
            this.setState({
                changed: false
            });
        });
    }

} 