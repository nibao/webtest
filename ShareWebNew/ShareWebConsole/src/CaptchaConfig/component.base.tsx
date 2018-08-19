import * as React from 'react';
import { getVcodeConfig, setVcodeConfig } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class CaptchaConfigBase extends WebComponent<any, Console.CaptchaConfig.State> {

    state: Console.CaptchaConfig.State = {
        vcodeConfig: {
            isEnable: false,
            passwdErrCnt: 0
        },
        changed: false,
        succeed: false,
        errcode: undefined,
        value: ''
    }

    /**
     *  源数据
     */
    originVcodeConfig: Core.ShareMgnt.ncTVcodeConfig

    async componentWillMount() {
        try {
            this.originVcodeConfig = await getVcodeConfig();
            this.setState({
                vcodeConfig: this.originVcodeConfig,
                value: this.originVcodeConfig.passwdErrCnt
            })
        } catch (ex) {
            this.setState({
                errcode: ex.error.errID
            })
        }

    }

    /**
     * 切换状态
     * @param checked 
     */
    protected changeCaptchStatus(checked) {
        this.setState({
            vcodeConfig: {
                ...this.state.vcodeConfig,
                isEnable: checked
            },
            changed: true
        })
    }

    /**
     * 修改输入错误次数出现验证码
     * @param times 
     */
    protected changeErrorTimes(times: number | string) {
        if (times === '') {
            this.setState({
                changed: true,
                value: times
            })
        } else {
            this.setState({
                changed: true,
                vcodeConfig: {
                    ...this.state.vcodeConfig,
                    passwdErrCnt: Number(times)
                },
                value: times
            })
        }
    }

    /**
     * 保存策略
     */
    protected async saveCaptchaConfig() {
        try {
            if (this.state.vcodeConfig.isEnable && this.state.value !== '') {

                await setVcodeConfig([{ 'ncTVcodeConfig': this.state.vcodeConfig }]);
                this.originVcodeConfig = this.state.vcodeConfig;
                await manageLog(
                    ManagementOps.SET,
                    __('启用 登录验证码 成功'),
                    __('启用 登录验证码，最大连续输错密码次数为${passwdErrCnt}次', { 'passwdErrCnt': this.state.vcodeConfig.passwdErrCnt }),
                    Level.INFO
                );
                this.setState({
                    changed: false,
                    succeed: true
                })

            } else if (!this.state.vcodeConfig.isEnable) {
                await setVcodeConfig([{ 'ncTVcodeConfig': this.state.vcodeConfig }]);
                this.originVcodeConfig.isEnable = this.state.vcodeConfig.isEnable;
                this.setState({
                    vcodeConfig: this.originVcodeConfig,
                    value: this.originVcodeConfig.passwdErrCnt,
                    changed: false,
                    succeed: true
                })
                await manageLog(
                    ManagementOps.SET,
                    __('禁用 登录验证码 成功'),
                    null,
                    Level.INFO
                )
            }
        } catch (ex) {
            this.setState({
                errcode: ex.error.errID
            })
        }
    }

    /**
     * 取消本次设置
     */
    protected cancelCaptchaConfig() {
        this.setState({
            changed: false,
            vcodeConfig: this.originVcodeConfig,
            value: this.originVcodeConfig.passwdErrCnt
        })
    }

    /**
     * 保存成功确定事件
     */
    protected async onSuccessConfirm() {
        this.setState({
            succeed: false
        })
    }

    /**
     * 确定错误弹窗
     */
    protected handleErrorConfirm() {
        this.setState({
            errcode: undefined
        })
    }


}