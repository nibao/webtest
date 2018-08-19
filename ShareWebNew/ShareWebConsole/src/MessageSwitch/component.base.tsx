import * as React from 'react';
import WebComponent from '../webcomponent';
import { getMessageNotifyStatus, setMessageNotifyStatus } from '../../core/thrift/eacp/eacp';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import __ from './locale';

export default class MessageSwitchBase extends WebComponent<any, Console.MessageSwitch.State> {

    state = {
        messageSwitch: true, // 默认允许通知消息
        changed: false
    }

    messageInitialStatus: boolean = false; // 消息开关原始值，始终与接口值一致

    componentDidMount() {
        // 初始化消息开关配置
        this.getMsgSwitchConfig();
    }

    /**
     * 获取消息开关配置
     * @memberof msgSwitchConfig
     */
    private async getMsgSwitchConfig() {
        // 获取消息开关配置,初始化消息开关
        const msgStatus = await getMessageNotifyStatus();
        this.setState({
            messageSwitch: msgStatus
        });
        this.messageInitialStatus = msgStatus;
    }

    /**
     * 设置 首页是否显示消息
     * @param {boolean} msgSwitch
     * @memberof msgSwitchConfig
     */
    private async SetMessage(messageSwitch: boolean) {
        // 若保存状态与上次状态不一致，则调接口传值
        if (this.messageInitialStatus !== messageSwitch) {
            await this.setMsgSwitch(messageSwitch)
        }
        manageLog(
            ManagementOps.SET,
            messageSwitch ? __('取消 关闭消息功能 成功') : __('开启 关闭消息功能 成功'),
            '',
            Level.INFO
        );
        // 点击保存更新默认配置，
        this.setState({
            messageSwitch: messageSwitch,
            changed: false
        })
        // 若状态改变，初始状态也应改变，与接口返回值保持一致
        this.messageInitialStatus = messageSwitch;
    }

    /**
     * 处理更改 设置消息开关参数
     * @param {string} msgHide
     * @memberof UserAgreementConfigBase
     */
    private async setMsgSwitch(messageSwitch: boolean) {
        await setMessageNotifyStatus(messageSwitch);
    }

    /**
     * 处理开关配置状态改变
     * @memberof msgSwitchConfig
     */
    protected handleMsgSwitchChange() {
        this.setState({
            messageSwitch: !this.state.messageSwitch,
            changed: true
        });
    }

    /**
     * 处理保存配置
     * @memberof msgSwitchConfig
     */
    protected handleSaveMsgSwitchConfig() {
        this.SetMessage(this.state.messageSwitch);
    }

    /**
     * 点击取消消息配置恢复至默认状态
     * @memberof msgSwitchConfig
     */
    protected handleCancelMsgSwitchConfig() {
        // 恢复到默认配置并做清理
        this.setState({
            messageSwitch: this.messageInitialStatus,
            changed: false
        });
    }
}