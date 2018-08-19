import * as React from 'react';
import { map, assign, forEach, pairs } from 'lodash';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { maxLength, range, number } from '../../util/validators/validators';
import { ShareMgnt } from '../../core/thrift/thrift';
import WebComponent from '../webcomponent';
import { Status, customedSecuName } from './helper';
import __ from './locale';
import { PureComponent } from '../../ui/decorators';

interface Props {

}

interface State {
    // 是否初始部署状态
    init: boolean;
    // 是否开启强密码
    strongPassword: boolean;

    // 密码错误次数
    passwdErrCnt: number;

    // 打开自定义密级Dialog
    openCustomSecurity: boolean;

    // 自定义密级列表是否为空
    noCustomedSecurity: boolean;

    // 是否涉密模式
    isSecretMode: boolean;

    // 自定义密级信息
    customedSecurity: Array<string>;

    // 临时存放用户自定义密级
    customSecu: Array<string>;

    // 新增一条自定义密级
    addSecurity: boolean;

    // 是否开启密码错误锁定
    lockStatus: boolean;

    // 自定义密级名称
    customedSecuName: String;

    // 新增的记录值
    addedRecord: string;

    // 初始化的密级
    csfLevel: number;

    // 原密级
    originalLevel: number;

    // 密码有效期
    expireTime: number;

    // 是否确认初始化操作钮
    isConfirmSecuInit: boolean;

    // 是否确认自定义密级
    isConfirmCustSecu: boolean;

    // 密级是否已自定义
    isCustomed: boolean;

    // 密级是否已初始化
    hasCsfInit: boolean;

    // 密级信息验证状态
    validateSecuStatus: number;

    // 密码错误锁定次数验证状态
    validatePwdStatus: number;
}

@PureComponent
export default class SecurityIntegrationBase extends WebComponent<Props, any> {

    static defaultProps = {
    }

    props: Props;

    state: State = {
        init: false,
        strongPassword: false,
        passwdErrCnt: 3,
        openCustomSecurity: false,
        noCustomedSecurity: true,
        isSecretMode: false,
        customedSecurity: [__('非密'), __('内部'), __('秘密'), __('机密')],
        customSecu: [__('非密'), __('内部'), __('秘密'), __('机密')],
        addSecurity: false,
        lockStatus: false,
        customedSecuName: '',
        addedRecord: '',
        csfLevel: 5,
        originalLevel: -1,
        expireTime: 3,
        isConfirmSecuInit: false,
        isConfirmCustSecu: false,
        isCustomed: false,
        hasCsfInit: false,
        validateSecuStatus: Status.OK,
        validatePwdStatus: Status.OK

    };

    csflevels = this.state.customSecu;
    sysLevel = 0;


    componentWillMount() {
        ShareMgnt('GetCSFLevels').then(csfLevels => {
            // 判断是否初始化部署状态
            if (Object.keys(csfLevels).length === 0) {
                Promise.all([ShareMgnt('Secretm_GetStatus'), ShareMgnt('Usrm_GetPasswordConfig'), ShareMgnt('GetSysCSFLevel')]).then
                    (([status, { expireTime, strongStatus, lockStatus, passwdErrCnt }, sysCSFLevel]) => {
                        this.setState({
                            init: true,
                            isSecretMode: status,
                            expireTime: expireTime,
                            strongPassword: strongStatus,
                            lockStatus: lockStatus,
                            passwdErrCnt: passwdErrCnt,
                            csfLevel: sysCSFLevel,
                            originalLevel: sysCSFLevel,
                        }, () => {
                            this.sysLevel = sysCSFLevel;
                            this.setState({ customSecu: this.state.customSecu.slice(sysCSFLevel - 5), customedSecurity: this.state.customedSecurity.slice(sysCSFLevel - 5) })
                        });
                    })
            } else {
                ShareMgnt('Secretm_GetStatus').then(status => {
                    if (status) {
                        ShareMgnt('Usrm_GetSystemInitStatus').then(initStatus => {
                            if (!initStatus) {
                                Promise.all([ShareMgnt('Usrm_GetPasswordConfig'), ShareMgnt('GetSysCSFLevel'), ShareMgnt('GetCSFLevels')]).then
                                    (([{ expireTime, strongStatus, lockStatus, passwdErrCnt }, sysCSFLevel]) => {
                                        this.setState({
                                            init: true,
                                            isSecretMode: status,
                                            expireTime: expireTime,
                                            strongPassword: strongStatus,
                                            lockStatus: lockStatus,
                                            passwdErrCnt: passwdErrCnt,
                                            csfLevel: sysCSFLevel,
                                            originalLevel: sysCSFLevel,
                                        }, () => {
                                            this.sysLevel = sysCSFLevel;
                                            // 非涉密切换到涉密(已初始化),按密级从低到高排序且不能低于当前系统密级
                                            this.setState({ hasCsfInit: true, isCustomed: true, customSecu: this.sortSecu(csfLevels).slice(sysCSFLevel - 5), customedSecurity: this.sortSecu(csfLevels).slice(sysCSFLevel - 5) })

                                        });
                                    })

                            } else {
                                this.setState({ init: false })
                            }

                        });
                    }
                });
            }
        })
    }

    /**
     * 系统密级从低到高排序
     */
    sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map((item, index) => {
            return item[0]
        })
    }


    componentDidUpdate() {
        // 编辑时滚动条自动滚到底部
        if (this.state.addSecurity) {
            let e = document.getElementById('ul-scroll-list');
            e.scrollTop = e.scrollHeight;
        }
    }

    /**
     * 选择系统密级
     */
    selectSecurity(level) {
        this.setState({ csfLevel: level })

    }

    /**
     * 选择密码有效期
     */
    selectPasswordExpiration(expiration) {
        this.setState({ expireTime: expiration })

    }

    /**
     * 选择密码强度
     */
    selectPasswordStrength(strength) {
        strength === 1 ? this.setState({ strongPassword: true }) : this.setState({ strongPassword: false })

    }

    /**
     * 初始化配置
     */
    setSecuInit() {
        if (this.state.validatePwdStatus === Status.OK) {
            ShareMgnt('Usrm_SetPasswordConfig', [{
                'ncTUsrmPasswordConfig': {
                    'strongStatus': this.state.strongPassword,
                    'expireTime': this.state.expireTime,
                    'lockStatus': this.state.lockStatus,
                    'passwdErrCnt': Number(this.state.passwdErrCnt)
                }
            }]).then(() => {
                manageLog(ManagementOps.SET, __('设置 密码策略 成功'), this.state.strongPassword ? __('强密码') : __('弱密码'), Level.WARN);
                if (this.state.lockStatus) {
                    manageLog(ManagementOps.SET, __('设置 密码策略 成功'), __('启用 密码错误锁定，最大连续输错密码次数为${passwdErrCnt}次', { 'passwdErrCnt': this.state.passwdErrCnt }), Level.WARN);
                } else {
                    manageLog(ManagementOps.SET, __('设置 密码策略 成功'), __('关闭 启用 密码错误锁定，最大连续输错密码次数为${passwdErrCnt}次', { 'passwdErrCnt': this.state.passwdErrCnt }), Level.WARN);

                }

            })

            if (!this.state.hasCsfInit) {
                // 用户自定义密级
                Promise.all([ShareMgnt('InitCSFLevels', [this.state.customedSecurity]).then(res => { ShareMgnt('SetSysCSFLevel', [this.state.csfLevel]) }), ShareMgnt('Usrm_InitSystem')]).then(res => {
                    manageLog(ManagementOps.SET, __('将密级从低到高自定义为“${secu}”成功', { secu: this.state.customedSecurity.join('、') }), '', Level.WARN);
                    manageLog(ManagementOps.SET, __('将系统密级设置为 “${level}” 成功', { level: this.state.customedSecurity[this.state.csfLevel - 5] }), __('原密级为“${originalLevel}”', { originalLevel: this.state.customedSecurity[this.state.originalLevel - 5] }), Level.WARN);
                })

            } else {
                Promise.all([ShareMgnt('SetSysCSFLevel', [this.state.csfLevel]), ShareMgnt('Usrm_InitSystem')]).then(res => {
                    manageLog(ManagementOps.SET, __('将系统密级设置为 “${level}” 成功', { level: this.state.customedSecurity[this.state.csfLevel - 5] }), __('原密级为“${originalLevel}”', { originalLevel: this.state.customedSecurity[this.state.originalLevel - 5] }), Level.WARN);
                })

            }
            this.setState({ isConfirmSecuInit: false });
            this.hideConfig()
        }
    }

    hideConfig() {
        this.destroy()
    }

    /**
     * 涉密模式下触发确认初始化对话框
     */

    triggerConfirmInit() {
        if (this.state.validatePwdStatus === Status.OK) {
            if (this.state.isSecretMode) {
                this.setState({ isConfirmSecuInit: true })
            } else {
                this.setSecuInit()
            }
        }
    }

    /**
     * 触发确认自定义密级对话框
     */

    triggerConfirmCust() {
        if (!this.state.addSecurity) {
            this.setState({ openCustomSecurity: false, isConfirmCustSecu: true })
        }
    }

    /**
     * 取消初始化
     */
    cancelInit() {
        this.setState({ isConfirmSecuInit: false })
    }

    /**
     * 设置自定义密级
     */
    setCustomedSecurity() {
        this.setState({ isConfirmCustSecu: false, customedSecurity: this.state.customSecu.concat(), isCustomed: true, csfLevel: 5, validateSecuStatus: Status.OK });

    }

    cancelCustom() {
        this.setState({ isConfirmCustSecu: false, openCustomSecurity: true, validateSecuStatus: Status.OK })

    }

    errCntAdd() {
        if (this.state.lockStatus && number(this.state.passwdErrCnt)) {
            this.setState({ passwdErrCnt: Number(this.state.passwdErrCnt) + 1 }, () => {
                if (!this.passwordLockCnt(this.state.passwdErrCnt)) {
                    this.setState({ validatePwdStatus: Status.COUNT_RANGE_ERROR })
                } else {
                    this.setState({ validatePwdStatus: Status.OK });
                }
            })
        }
    }

    errCntSub() {
        if (this.state.lockStatus && number(this.state.passwdErrCnt)) {
            this.setState({ passwdErrCnt: Number(this.state.passwdErrCnt) - 1 }, () => {
                if (!this.passwordLockCnt(this.state.passwdErrCnt)) {
                    this.setState({ validatePwdStatus: Status.COUNT_RANGE_ERROR })
                } else {
                    this.setState({ validatePwdStatus: Status.OK });
                }
            })
        }
    }

    handleErrCntChange(cnt) {
        this.setState({
            passwdErrCnt: cnt
        }, () => {
            if (!this.passwordLockCnt(cnt)) {
                this.setState({ validatePwdStatus: Status.COUNT_RANGE_ERROR });
            } else {
                this.setState({ validatePwdStatus: Status.OK });
            }
        })
    }

    /**
     * 验证密码锁定次数
    */
    passwordLockCnt(input) {
        return range(1, this.state.isSecretMode ? 5 : 99)(input)
    }


    customSecurityClassification() {
        this.setState({ openCustomSecurity: true, addSecurity: false, validateSecuStatus: Status.OK })

    }

    closeCustomSecurity() {
        this.setState({ openCustomSecurity: false, noCustomedSecurity: true, addSecurity: false, customSecu: this.state.customedSecurity.concat() })
    }

    openSecurityTextBox() {
        if (this.state.customSecu.length === 11) {
            this.setState({ validateSecuStatus: Status.SECU_OUT_SUM, addSecurity: false })
        } else {
            this.setState({ addSecurity: true, addedRecord: '' })
        }
    }

    /**
     * 删除自定义密级
     */
    deleteSecurity(index) {
        this.setState({ customSecu: this.state.customSecu.filter((value, key) => key !== index) }, () => {
            if (this.state.customSecu.length < 11) {
                this.setState({ validateSecuStatus: Status.OK })
            }
        });
    }

    /**
     * 启用密码错误锁定
     */
    setPasswordLock() {
        this.setState({ lockStatus: !this.state.lockStatus, passwdErrCnt: 3 }, () => {
            if (!this.state.lockStatus) {
                this.setState({ validatePwdStatus: Status.OK });
            }

        });
    }

    handleSecuChange(record) {
        this.setState({
            addedRecord: record
        }, () => {
            if (customedSecuName(record)) {
                this.setState({ validateSecuStatus: Status.FORBIDDEN_SPECIAL_CHARACTER });
            } else {
                this.setState({ validateSecuStatus: Status.OK })
            }
        })
    }

    /**
     * 验证密级字数超出范围
     */
    nameOutLength(input) {
        return input === '' || maxLength(80);

    }

    /**
     * 保存编辑
     */
    saveEdit() {
        this.csflevels = this.state.customSecu;
        if (this.state.addedRecord.length === 0) {
            this.setState({ validateSecuStatus: Status.EMPTY_NAME })
        } else {

            if (this.state.validateSecuStatus === Status.OK) {
                if (this.csflevels.indexOf(this.state.addedRecord) === -1) {
                    this.csflevels.push(this.state.addedRecord);
                    this.setState({ customSecu: this.csflevels, addSecurity: false, addedRecord: '' })

                } else {
                    this.setState({ validateSecuStatus: Status.DUPLICATE_NAMES_ERROR });
                }
            }
        }
    }

    /**
     * 撤销编辑
     */
    cancelEdit() {
        this.setState({ addSecurity: false, addedRecord: '', validateSecuStatus: Status.OK });
    }
}