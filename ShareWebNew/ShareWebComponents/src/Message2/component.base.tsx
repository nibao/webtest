import { noop, pairs } from 'lodash';

import { getConfig } from '../../core/config/config';
import WebComponent from '../webcomponent';
import { subscribe, getMessages, setRead, MessageType, MsgStatus } from '../../core/message/message';
import { isDir, } from '../../core/docs/docs'
import { checkPermItem, SharePermission, canOpenDir } from '../../core/permission/permission'
import { Exception } from './helper'

export default class MessageBase extends WebComponent<Components.Message2.Props, Components.Message2.State> {
    static defaultProps = {
        doPreview: noop,
        doRedirect: noop,
        doCheck: noop,
        showMsgType: MessageType.Share,
    }

    state = {
        resultMessage: null,
        selectedMode: MsgStatus.All,
        msgs: [],
        csfTextArray: [],
        csfSysId: '',
        showReadAllDialog: false,
    }

    unsubscribe = noop // 取消消息订阅

    async componentWillMount() {

        await this.getCsfConfig();
        this.unsubscribe = subscribe(this.updateMsgs.bind(this))
        this.updateMsgs()
    }


    componentWillUnmout() {
        this.unsubscribe();
    }

    /**
     * 在打开文件前执行检查
     */
    private checkBeforeOpen = (doc) => {

        return new Promise(async (resolve, reject) => {
            const { docid } = doc

            try {
                if (isDir(doc) && await canOpenDir(doc)) {
                    resolve()
                } else if (await checkPermItem(docid, SharePermission.PREVIEW)) {
                    resolve()
                } else {
                    this.setState({
                        exception: {
                            type: Exception.PERMISSION_REJECT,
                            detail: doc
                        }
                    })

                    reject(doc)
                }
            } catch (ex) {
                switch (ex.errcode) {
                    case 404006:
                        this.setState({
                            exception: {
                                type: Exception.FILE_MISSING,
                                detail: doc
                            }
                        })
                        break

                    default:
                        this.setState({
                            exception: {
                                detail: doc
                            }
                        })
                }
            }
        })
    }

    protected handlePreview = async (doc) => {
        if (doc) {
            await this.checkBeforeOpen(doc)
        }
        this.props.doPreview(doc)
    }

    protected handleRedirect = async (doc) => {
        if (doc) {
            await this.checkBeforeOpen(doc)
        }
        this.props.doRedirect(doc)
    }

    /**
     * 更新消息
     * @private
     * @memberof MessageBase
     */
    private updateMsgs() {
        const { showMsgType } = this.props;
        const { selectedMode } = this.state;
        let currentShowMsg;
        switch (selectedMode) {
            case MsgStatus.All:
                currentShowMsg = getMessages(showMsgType)
                break;
            case MsgStatus.Unread:
                currentShowMsg = getMessages(showMsgType, false)
                break;
            case MsgStatus.Read:
                currentShowMsg = getMessages(showMsgType, true)
                break;
            default:
                currentShowMsg = getMessages(showMsgType)
                break;
        }
        this.setState({
            msgs: currentShowMsg
        })
    }

    /**
     * 将消息设为已读
     */
    protected async read(msgs) {
        if (msgs.length === undefined && msgs.isread) {
            return
        }

        await setRead(msgs);
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
        this.setState({
            selectedMode: value,
        }, () => this.updateMsgs());
    }


    /**
     * 系统密级从低到高排序
     */
    private sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map(([text]) => {
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
    /**
    * 显示 阅读全部已读信息 确认弹窗
    * @protected
    * @memberof MessageBase
    */
    protected handleClickReadAll() {
        this.setState({
            showReadAllDialog: true,
        })
    }
    /**
     * 隐藏 阅读全部已读信息 确认弹窗
     * @protected
     * @memberof MessageBase
     */
    protected handleHideReadAll() {
        this.setState({
            showReadAllDialog: false
        })
    }
    /**
     * 阅读全部已读信息，关闭弹窗
     * @protected
     * @param {any} msg 
     * @memberof MessageBase
     */
    protected handleSubmitReadAll(msg) {
        this.read(msg);
        this.handleHideReadAll();
    }


}