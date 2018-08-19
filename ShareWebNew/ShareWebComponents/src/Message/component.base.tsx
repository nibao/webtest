/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { map, assign, noop, pairs } from 'lodash';
import { get, read2 } from '../../core/apis/eachttp/message/message';
import { getConfig } from '../../core/config/config';
import WebComponent from '../webcomponent';
import { Type } from '../../core/message/message';
import { MsgshowMode } from './helper';
import __ from './locale';

export default class MessageBase extends WebComponent<Components.Message.Props, any> implements Components.Message.Base {
    static defaultProps = {
        onPreview: noop,
        onRedirect: noop,
        onCheck: noop,
        onRead: noop,
        isShare: true,
        onShieldMessage: noop
    }

    state = {
        msgs: [],
        sharemsgs: [],
        checkmsgs: [],
        securitymsgs: [],
        isreadSharemsgs: [],
        isreadCheckmsgs: [],
        isreadSecuritymsgs: [],
        unreadSharemsgs: [],
        unreadCheckmsgs: [],
        unreadSecuritymsgs: [],
        resultMessage: null,
        msgshowMode: [],
        selectedMode: MsgshowMode.ALL,
        showOption: false,
        showSharemsgs: [],
        showCheckmsgs: [],
        showSecuritymsgs: [],
        csfTextArray: [],
        csfSysId: '',

    }

    async componentWillMount() {
        this.getCsfConfig();
    }


    async componentDidMount() {
        const msgStatus = await getConfig('enable_message_notify');

        // 如果关闭消息通知，则屏蔽消息界面
        if (!msgStatus) {
            this.props.onShieldMessage();
        } else {
            this.getMessage();
        }
    }

    /**
    * 获取消息
    */
    private getMessage() {
        get({ stamp: 0 }).then((messages) => {

            let msgs = messages.msgs.reverse().map(item => {
                // 没有url字段的消息赋空数组
                let path = item.url && item.url.split('/') || [],
                    docname = path.pop(),
                    checkPath;

                switch (item.type) {
                    case Type.PendingProcessMessage:
                        checkPath = ['workflowaprv'];
                        break;
                    case Type.OpenShareApply:
                    case Type.SetOwnerApply:
                    case Type.CloseShareApply:
                    case Type.CancelOwnerApply:
                    case Type.OpenLinkApply:
                    case Type.PendingEditCsfApply:
                        checkPath = ['shareapv'];
                        break;
                    case Type.IllegalFileIsolated:
                        checkPath = ['quarantine'];
                        break;
                }


                return assign({}, item, {
                    docname: docname || '',
                    size: 1,
                    docid: item.gns,
                    path: path.join('/'),
                    checkPath
                });
            });

            let msgshowMode = [
                {
                    value: MsgshowMode.ALL,
                    text: __('全部消息')
                },
                {
                    value: MsgshowMode.UNREAD,
                    text: __('未读消息')
                },
                {
                    value: MsgshowMode.READ,
                    text: __('已读消息')
                }
            ];


            let sharemsgs = msgs.filter(item => item.type < 5);
            let checkmsgs = msgs.filter(item => item.type > 4 && item.type < 21 && item.type !== 18);
            let securitymsgs = msgs.filter(item => item.type > 20 || item.type === 18);

            let isreadSharemsgs = sharemsgs.filter(item => item.isread);
            let isreadCheckmsgs = checkmsgs.filter(item => item.isread);
            let isreadSecuritymsgs = securitymsgs.filter(item => item.isread);

            let unreadSharemsgs = sharemsgs.filter(item => !item.isread);
            let unreadCheckmsgs = checkmsgs.filter(item => !item.isread);
            let unreadSecuritymsgs = securitymsgs.filter(item => !item.isread);

            this.setState({
                msgs,
                sharemsgs,
                checkmsgs,
                securitymsgs,
                isreadSharemsgs,
                isreadCheckmsgs,
                isreadSecuritymsgs,
                unreadSharemsgs,
                unreadCheckmsgs,
                unreadSecuritymsgs,
                msgshowMode,
                showSharemsgs: sharemsgs,
                showCheckmsgs: checkmsgs,
                showSecuritymsgs: securitymsgs
            });

        });


    }

    /**
     * 将消息设为已读
     */
    protected read(msg) {
        if (!msg.isread) {
            read2({ 'msgids': [msg.id] }).then(() => {
                this.props.onRead();
                if (msg.type === Type.OpenShare || msg.type === Type.CloseShare || msg.type === Type.SetOwner || msg.type === Type.CancelOwner) {
                    let newSharemsgs = map(this.state.showSharemsgs, item => {
                        if (msg.id === item.id) {
                            return assign({}, item, { isread: true });
                        } else {
                            return item;
                        }
                    });
                    this.setState({
                        showSharemsgs: newSharemsgs
                    });
                } else if (msg.type === Type.SimpleMessage || msg.type === Type.IllegalFileIsolated || msg.type === Type.IllegalFileRestored || msg.type === Type.AntivirusMessage) {
                    this.setState({
                        showSecuritymsgs: this.state.showSecuritymsgs.reduce((preMsgs, item) => [...preMsgs, item.id === msg.id ? { ...item, isread: true } : item], [])
                    });
                }
                else {
                    let newCheckmsgs = map(this.state.showCheckmsgs, item => {
                        if (msg.id === item.id) {
                            return assign({}, item, { isread: true });
                        } else {
                            return item;
                        }

                    });
                    this.setState({
                        showCheckmsgs: newCheckmsgs
                    });
                }
                let newMsgs = map(this.state.msgs, item => {
                    if (msg.id === item.id) {
                        return assign({}, item, { isread: true });
                    } else {
                        return item;
                    }

                });

                let sharemsgs = newMsgs.filter(item => item.type < 5);
                let checkmsgs = newMsgs.filter(item => item.type > 4 && item.type < 21 && item.type !== 18);
                let securitymsgs = newMsgs.filter(item => item.type > 20 || item.type === 18);

                let isreadSharemsgs = sharemsgs.filter(item => item.isread);
                let isreadCheckmsgs = checkmsgs.filter(item => item.isread);
                let isreadSecuritymsgs = securitymsgs.filter(item => item.isread);

                let unreadSharemsgs = sharemsgs.filter(item => !item.isread);
                let unreadCheckmsgs = checkmsgs.filter(item => !item.isread);
                let unreadSecuritymsgs = securitymsgs.filter(item => !item.isread);

                this.setState({
                    msgs: newMsgs,
                    sharemsgs,
                    checkmsgs,
                    securitymsgs,
                    isreadSharemsgs,
                    isreadCheckmsgs,
                    isreadSecuritymsgs,
                    unreadSharemsgs,
                    unreadCheckmsgs,
                    unreadSecuritymsgs
                });

            });
        }

    }

    /**
     * 显示审核结果页面
     */
    protected showResultDialog(msg) {
        this.setState({
            resultMessage: msg
        })
    }

    /**
     * 关闭审核结果面板
     */
    protected closeResultDialog() {
        this.setState({
            resultMessage: null
        })
    }

    /**
     * 选择消息显示
     */
    protected changeMode(value) {
        let showSharemsgs, showCheckmsgs, showSecuritymsgs;

        switch (value) {
            case MsgshowMode.ALL:
                showSharemsgs = this.state.sharemsgs;
                showCheckmsgs = this.state.checkmsgs;
                showSecuritymsgs = this.state.securitymsgs;
                break;
            case MsgshowMode.UNREAD:
                showSharemsgs = this.state.unreadSharemsgs;
                showCheckmsgs = this.state.unreadCheckmsgs;
                showSecuritymsgs = this.state.unreadSecuritymsgs;
                break;
            case MsgshowMode.READ:
                showSharemsgs = this.state.isreadSharemsgs;
                showCheckmsgs = this.state.isreadCheckmsgs;
                showSecuritymsgs = this.state.isreadSecuritymsgs;
                break;
        }
        this.setState({
            selectedMode: value,
            showSharemsgs,
            showCheckmsgs,
            showSecuritymsgs
        });
        this.closeOptions();
    }

    /**
     * 显示消息选项
     */
    protected showOptions() {
        this.setState({
            showOption: true
        })
    }

    /**
     * 关闭消息选项
     */
    private closeOptions() {
        this.setState({
            showOption: false
        })
    }

    /**
     * 系统密级从低到高排序
     */
    private sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map(([text,]) => {
            return text
        })
    }

    /**
     * 获取系统密级配置信息
     */
    private getCsfConfig() {
        return getConfig().then(({ third_csfsys_config, csf_level_enum }) => {
            // 是否开启第三方标密
            if (third_csfsys_config) {
                this.setState({ csfSysId: third_csfsys_config.id })
            } else {
                this.setState({ csfSysId: '' })
            }
            this.setState({ csfTextArray: this.sortSecu(csf_level_enum) })
        })
    }

}