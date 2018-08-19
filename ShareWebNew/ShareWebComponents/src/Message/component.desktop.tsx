import * as React from 'react';
import * as classnames from 'classnames';
import Tabs from '../../ui/Tabs/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import FontIcon from '../../ui/FontIcon/ui.desktop';
import '../../assets/fonts/font.css';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import { formatTime } from '../../util/formatters/formatters';
import { Type, AntiVirusOperation } from '../../core/message/message';
import { CSFSYSID } from '../../core/csf/csf';
import { buildSelectionText, SharePermissionOptions, LinkSharePermissionOptions } from '../../core/permission/permission';
import { getIcon } from '../helper';
import * as styles from './styles.desktop.css';
import * as noMessageIcon from './assets/no-message.png';
import * as selectedImg from './assets/selected.png';
import * as gotImg from './assets/got.png';
import * as viewImg from './assets/view.png';
import MessageBase from './component.base';
import { Audittype, MsgshowMode } from './helper';

import __ from './locale';

export default class Message extends MessageBase {
    render() {
        return (
            <div className={ styles['container'] }>
                <Tabs>
                    <Tabs.Navigator>
                        <Tabs.Tab active={ this.props.isShare }>
                            { __('共享消息') }
                            <a className={ styles['notice-a'] }>
                                {
                                    this.state.unreadSharemsgs.length === 0 ?
                                        null
                                        :
                                        <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf004' } fallback={ gotImg } className={ styles['notice-icon'] } />
                                }

                            </a>
                        </Tabs.Tab>
                        <Tabs.Tab active={ !this.props.isShare }>
                            { __('审核消息') }
                            <a className={ styles['notice-a'] }>
                                {
                                    this.state.unreadCheckmsgs.length === 0 ?
                                        null
                                        :
                                        <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf004' } fallback={ gotImg } className={ styles['notice-icon'] } />
                                }

                            </a>

                        </Tabs.Tab>
                        <Tabs.Tab>
                            { __('安全消息') }
                            <a className={ styles['notice-a'] }>
                                {
                                    this.state.unreadSecuritymsgs.length === 0 ?
                                        null
                                        :
                                        <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf004' } fallback={ gotImg } className={ styles['notice-icon'] } />
                                }

                            </a>
                        </Tabs.Tab>
                    </Tabs.Navigator>
                    <Tabs.Main>
                        <Tabs.Content>
                            {
                                this.state.showSharemsgs.length === 0 ?
                                    this.renderNoMsgTip()
                                    :
                                    this.renderShareMsgs()
                            }

                        </Tabs.Content>
                        <Tabs.Content>
                            {
                                this.state.showCheckmsgs.length === 0 ?
                                    this.renderNoMsgTip()
                                    :
                                    this.renderCheckMsgs()
                            }
                        </Tabs.Content>
                        <Tabs.Content>
                            {
                                this.state.showSecuritymsgs.length === 0 ?
                                    this.renderNoMsgTip()
                                    :
                                    this.renderSecurityMsgs()
                            }
                        </Tabs.Content>
                    </Tabs.Main>
                </Tabs>

                <div className={ styles['message-selecter'] }>
                    <div className={ styles['selecter-value'] }>
                        {
                            this.state.msgshowMode.map(mode => {
                                if (mode.value === this.state.selectedMode) {
                                    return (
                                        <span>{ mode.text }</span>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                        <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf00b' } fallback={ viewImg } className={ styles['sel-icon'] } onClick={ this.showOptions.bind(this) } />
                    </div>
                    <div className={ styles['selecter-options'] }>
                        {
                            this.state.msgshowMode.map(mode => {
                                return (
                                    <div className={ styles['selecter-item'] }>
                                        <a href="javascript:void(0)" className={ styles['selecter-option'] } onClick={ () => this.changeMode(mode.value) }>
                                            <span className={ styles['sel-icon-wrap'] }>
                                                {
                                                    mode.value === this.state.selectedMode ?
                                                        (<FontIcon font={ 'Anyshare' } size="10px" code={ '\uf00a' } fallback={ selectedImg } className={ styles['sel-icon'] } />)
                                                        :
                                                        null
                                                }
                                            </span>
                                            <span className={ styles['sel-text'] }>{ mode.text }</span>
                                        </a>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }



    renderShareMsgs() {
        return (
            <div className={ styles['message-list'] }>
                <ul>
                    {
                        this.state.showSharemsgs.map(item => {
                            return (
                                <li className={ classnames(styles['result-item'], { [styles['unreadcolor']]: !item.isread }) } onClick={ () => { this.read(item) } }>
                                    <h1>
                                        {
                                            item.type === Type.OpenShare || item.type === Type.SetOwner ?
                                                (
                                                    <a className={ styles['title-a'] } onClick={ () => { this.props.onPreview(item) } }>
                                                        <span className={ styles['notice-icon-wrap'] }>
                                                            {
                                                                item.isread ?
                                                                    null
                                                                    :
                                                                    <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf004' } fallback={ gotImg } className={ styles['notice-icon'] } />
                                                            }

                                                        </span>
                                                        { getIcon(item, { size: 32 }) }
                                                        <span className={ styles['title-text'] }>{ item.docname }</span>
                                                    </a>
                                                ) :
                                                (
                                                    <span className={ styles['title-span'] }>
                                                        <span className={ styles['notice-icon-wrap'] }>
                                                            {
                                                                item.isread ?
                                                                    null
                                                                    :
                                                                    <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf004' } fallback={ gotImg } className={ styles['notice-icon'] } />
                                                            }

                                                        </span>
                                                        { getIcon(item, { size: 32 }) }
                                                        <span className={ styles['title-text'] }>{ item.docname }</span>
                                                    </span>
                                                )
                                        }

                                    </h1>
                                    <div className={ styles['content'] }>
                                        <div className={ styles['layout-spacing'] }>
                                            <div className={ styles['atom'] }>
                                                <span>{ formatTime(item.time / 1000) }</span>
                                            </div>
                                            <div className={ styles['atom'] }>
                                                <span>
                                                    {
                                                        item.type === Type.OpenShare || item.type === Type.SetOwner ?
                                                            __('${sender}给${accessorname}共享了文档', { 'sender': item.sender, accessorname: item.accessortype === 'user' ? __('您') : item.accessorname })
                                                            :
                                                            __('${sender}给${accessorname}取消了共享', { 'sender': item.sender, accessorname: item.accessortype === 'user' ? __('您') : item.accessorname })
                                                    }
                                                </span>
                                            </div>

                                        </div>
                                        <div className={ styles['layout-spacing'] }>
                                            <div className={ styles['atom'] }>
                                                <label>{ __('权限：') }</label>
                                                <span>
                                                    {
                                                        item.type === Type.OpenShare || item.type === Type.CloseShare ?
                                                            this.renderPermission(item)
                                                            :
                                                            __('所有者')
                                                    }
                                                </span>
                                            </div>
                                            <div className={ styles['atom'] }>
                                                <label>{ __('有效期至：') }</label>
                                                {
                                                    item.end && item.end !== -1 ? formatTime(item.end / 1000) : __('永久有效')
                                                }
                                            </div>
                                            <div className={ styles['atom'] }>
                                                <label>{ __('文件密级：') }</label>
                                                {
                                                    this.renderCSF(item.csf)
                                                }
                                            </div>
                                        </div>
                                        {
                                            item.type === Type.OpenShare || item.type === Type.SetOwner ?
                                                (
                                                    <div className={ styles['layout-spacing'] }>
                                                        <a className={ styles['link'] } onClick={ () => { this.props.onRedirect(item) } }>{ __('打开所在位置') }</a>
                                                    </div>
                                                ) :
                                                null
                                        }
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }

    renderCheckMsgs() {
        return (
            <div className={ styles['message-list'] }>
                <ul>
                    {
                        this.state.showCheckmsgs.map(item => {
                            return (
                                <li className={ classnames(styles['result-item'], { [styles['unreadcolor']]: !item.isread }) } onClick={ () => { this.read(item) } }>
                                    <h1>
                                        <span className={ styles['title-span'] }>
                                            <span className={ styles['notice-icon-wrap'] }>
                                                {
                                                    item.isread ?
                                                        null
                                                        :
                                                        <FontIcon font={ 'Anyshare' } size="10px" code={ '\uf004' } fallback={ gotImg } className={ styles['notice-icon'] } />
                                                }

                                            </span>

                                            { getIcon(item, { size: 32 }) }
                                            <span className={ styles['title-text'] }>{ item.docname }</span>
                                        </span>
                                    </h1>
                                    <div className={ styles['content'] }>
                                        <div className={ styles['layout-spacing'] }>
                                            <div className={ styles['atom'] }>
                                                <span>{ formatTime(item.time / 1000) }</span>
                                            </div>
                                            <div className={ styles['atom'] }>
                                                <span>
                                                    {
                                                        this.renderCheckInfo(item)
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        {
                                            this.renderSummary(item)

                                        }
                                        <div className={ styles['layout-spacing'] }>
                                            {
                                                this.renderHandle(item)
                                            }
                                        </div>

                                    </div>

                                </li>
                            )
                        })
                    }
                    {
                        this.state.resultMessage ? this.renderResultDialog(this.state.resultMessage) : null
                    }
                </ul>
            </div>
        )
    }


    renderCheckInfo(msg) {
        switch (msg.type) {
            case Type.OpenShareApply:
            case Type.SetOwnerApply:
                return __('${sender}给${accessorname}共享了文档，请您审核', { 'sender': msg.sender, 'accessorname': msg.accessorname })

            case Type.CloseShareApply:
            case Type.CancelOwnerApply:
                return __('${sender}给${accessorname}取消了共享，请您审核', { 'sender': msg.sender, 'accessorname': msg.accessorname })

            case Type.OpenLinkApply:
                return __('${sender}开启了外链共享，请您审核', { 'sender': msg.sender })

            case Type.OpenShareAuditResult:
            case Type.OpenOwnerAuditResult:
                return msg.auditresult ?
                    __('您给${accessorname}共享的文档，已通过审核', { 'accessorname': msg.accessorname })
                    :
                    __('您给${accessorname}共享的文档，未通过审核', { 'accessorname': msg.accessorname })

            case Type.CloseShareAuditResult:
            case Type.CloseOwnerAuditResult:
                return msg.auditresult ?
                    __('您给${accessorname}取消了共享文档，已通过审核', { 'accessorname': msg.accessorname })
                    :
                    __('您给${accessorname}取消共享文档，未通过审核', { 'accessorname': msg.accessorname })

            case Type.OpenLinkAuditResult:
                return msg.auditresult ?
                    __('${sender}开启了外链共享，已通过审核', { 'sender': msg.sender })
                    :
                    __('${sender}开启了外链共享，未通过审核', { 'sender': msg.sender })

            case Type.PendingProcessMessage:
                return msg.previousauditor ?
                    __('${previousauditor}通过了${requester}发起的流程，请您继续审核', { 'previousauditor': msg.previousauditor, 'requester': msg.requestername })
                    :
                    __('${requester}发起了文档流程，请您审核', { 'requester': msg.requestername })

            case Type.ProcessProgressMessage:
                return __('您发起的流程，已提交给${nextlevel}级审核员${nextauditor}', { 'nextlevel': msg.nextlevel, 'nextauditor': msg.nextauditor })

            case Type.ProcessResultMessage:
                return msg.auditresult ?
                    __('您发起的流程，已通过审核')
                    :
                    __('您发起的流程，未通过审核')

            case Type.PendingEditCsfApply:
                return __('${sender}更改了文件密级，请您审核：', { sender: msg.sender })

            case Type.EditCsfAuditResult:
                return msg.auditresult ?
                    __('你的文件密级更改操作，已通过审核：') :
                    __('你的文件密级更改操作，未通过审核：')

        }
    }


    renderSummary(msg) {
        switch (msg.type) {
            case Type.OpenShareApply:
            case Type.SetOwnerApply:
            case Type.CloseShareApply:
            case Type.CancelOwnerApply:
            case Type.OpenLinkApply:
            case Type.OpenShareAuditResult:
            case Type.OpenOwnerAuditResult:
            case Type.CloseShareAuditResult:
            case Type.CloseOwnerAuditResult:
            case Type.OpenLinkAuditResult:
                return (
                    <div className={ styles['layout-spacing'] }>
                        <div className={ styles['atom'] }>
                            <label>{ __('权限：') }</label>
                            <span>
                                {
                                    msg.type === Type.OpenShareApply ||
                                        msg.type === Type.CloseShareApply ||
                                        msg.type === Type.OpenShareAuditResult ||
                                        msg.type === Type.CloseShareAuditResult ||
                                        msg.type === Type.OpenLinkApply ||
                                        msg.type === Type.OpenLinkAuditResult
                                        ?
                                        this.renderPermission(msg)
                                        :
                                        __('所有者')
                                }
                            </span>
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('有效期至：') }</label>
                            {
                                msg.end && msg.end !== -1 ? formatTime(msg.end / 1000) : __('永久有效')
                            }
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('文件密级：') }</label>
                            {
                                this.renderCSF(msg.csf)
                            }
                        </div>
                    </div>
                )

            case Type.PendingProcessMessage:
            case Type.ProcessProgressMessage:
            case Type.ProcessResultMessage:
                return (
                    <div className={ styles['layout-spacing'] }>
                        <div className={ styles['atom'] }>
                            <label>{ __('流程名称：') }</label>
                            <span>
                                {
                                    msg.processname
                                }
                            </span>
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('审核模式：') }</label>
                            <span>
                                {
                                    this.renderAudittype(msg.docaudittype)
                                }
                            </span>
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('文件密级：') }</label>
                            {
                                this.renderCSF(msg.csf)
                            }
                        </div>
                    </div>
                )

            case Type.PendingEditCsfApply:
                return (
                    <div className={ styles['layout-spacing'] }>
                        <div className={ styles['atom'] }>
                            <label>{ __('文件密级：') }</label>
                            <span>
                                {
                                    msg.csf ?
                                        this.renderCSF(msg.csf) :
                                        '---'
                                }
                            </span>
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('更改为：') }</label>
                            {
                                this.renderCSF(msg.applycsflevel)
                            }
                        </div>
                    </div>
                )

            case Type.EditCsfAuditResult:
                return (
                    <div className={ styles['layout-spacing'] }>
                        <div className={ styles['atom'] }>
                            <label>{ __('文件密级：') }</label>
                            <span>
                                {
                                    this.renderCSF(msg.csf)
                                }
                            </span>
                        </div>
                    </div>
                )

            case Type.SimpleMessage:
                return (
                    <div className={ styles['layout-spacing'] }>
                        { msg.content }
                    </div>
                )

            case Type.IllegalFileIsolated:
            case Type.IllegalFileRestored:
                return (
                    <div className={ styles['layout-spacing'] }>
                        <div className={ styles['atom'] }>
                            <label>{ __('创建者：') }</label>
                            <span>
                                {
                                    msg.creator
                                }
                            </span>
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('修改者：') }</label>
                            <span>
                                {
                                    msg.modifier
                                }
                            </span>
                        </div>
                        <div className={ styles['atom'] }>
                            <label>{ __('文件密级：') }</label>
                            {
                                this.renderCSF(msg.csf)
                            }
                        </div>
                    </div>
                )

            case Type.AntivirusMessage:
                return (
                    <div className={ styles['layout-spacing'] }>
                        <div className={ styles['atom'] }>
                            <label>{ __('文件密级：') }</label>
                            {
                                this.renderCSF(msg.csf)
                            }
                        </div>
                        <div className={ classnames(styles['atom'], styles['margin-left']) }>
                            <label>{ __('防病毒管理员：') }</label>
                            <span>
                                {
                                    msg.antivirusadmin
                                }
                            </span>
                        </div>
                    </div>
                )
        }

    }


    renderHandle(msg) {
        switch (msg.type) {
            case Type.OpenShareApply:
            case Type.SetOwnerApply:
            case Type.CloseShareApply:
            case Type.CancelOwnerApply:
            case Type.OpenLinkApply:
            case Type.PendingProcessMessage:
            case Type.PendingEditCsfApply:
                return (
                    <a className={ styles['link'] } onClick={ () => { this.props.onCheck(msg) } }>{ __('去审核') }</a>
                )

            case Type.OpenShareAuditResult:
            case Type.OpenOwnerAuditResult:
            case Type.CloseShareAuditResult:
            case Type.CloseOwnerAuditResult:
            case Type.OpenLinkAuditResult:
            case Type.ProcessResultMessage:
            case Type.ProcessProgressMessage:
            case Type.EditCsfAuditResult:
                return (
                    <a className={ styles['link'] } onClick={ () => this.showResultDialog(msg) }>{ __('查看详情') }</a>
                )
            case Type.SimpleMessage:
                return __('来自：${sender}', { sender: msg.sender })
            case Type.IllegalFileIsolated:
                return (
                    <a className={ styles['link'] } onClick={ () => { this.props.onCheck(msg) } }>{ __('查看详情') }</a>
                )
            case Type.IllegalFileRestored:
                return (
                    <a className={ styles['link'] } onClick={ () => { this.props.onRedirect(msg) } }>{ __('打开所在位置') }</a>
                )
            case Type.AntivirusMessage:
                if (msg.antivirusop === AntiVirusOperation.Repaired) {
                    return (
                        <a className={ styles['link'] } onClick={ () => { this.props.onRedirect(msg) } }>{ __('打开所在位置') }</a>
                    )
                }
        }
    }


    renderPermission(msg) {
        if (msg.allowvalue || msg.denyvalue) {
            return buildSelectionText(SharePermissionOptions, { allow: msg.allowvalue, deny: msg.denyvalue });
        } else {
            return buildSelectionText(LinkSharePermissionOptions, { allow: msg.perm });

        }
    }

    renderCSF(csf) {
        // 对接时代亿信标密系统
        if (this.state.csfSysId === CSFSYSID.SDYX) {
            return <span>---</span>
        } else {
            if (csf === 0) {
                return <span>---</span>
            } else {
                return <span>{ this.state.csfTextArray[csf - 5] }</span>
            }
        }
    }

    renderAudittype(audittype) {
        switch (audittype) {
            case Audittype.ONE:
                return __('同级审核')
            case Audittype.ALL:
                return __('汇签审核')
            case Audittype.LEVEL:
                return __('逐级审核')
        }
    }

    renderResultDialog(msg) {
        return (
            <Dialog
                title={ __('审核详情') }
                onClose={ this.closeResultDialog.bind(this) }
            >
                <Panel>
                    <Panel.Main>
                        <div className={ styles['edit-content'] }>
                            <Form>

                                <Form.Row>
                                    <Form.Label>
                                        <label>{ __('审核员：') }</label>
                                    </Form.Label>
                                    <Form.Field>
                                        <span>{ msg.auditorname }</span>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        <label>{ __('审核意见：') }</label>
                                    </Form.Label>
                                    <Form.Field>
                                        {
                                            msg.auditresult ?
                                                (
                                                    <span style={ { color: '#4cb76f' } }>
                                                        { __('通过') }
                                                    </span>
                                                )
                                                :
                                                (
                                                    <span style={ { color: '#D70000' } }>
                                                        { __('否决') }
                                                    </span>
                                                )
                                        }
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label align="top">
                                        <label>{ __('补充说明：') }</label>
                                    </Form.Label>
                                    <Form.Field>
                                        <div className={ styles['audit-comment'] }>{ msg.auditmsg }</div>
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button type="submit" onClick={ this.closeResultDialog.bind(this) }>{ __('确定') }</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }


    renderNoMsgTip() {
        return (
            <div className={ styles['no-message-tip'] }>
                <Icon size="64" url={ noMessageIcon } />
                <h1 className={ styles['no-message-text'] }>{ __('暂时还没有任何消息哦~') }</h1>
            </div>
        )
    }

    renderSecurityInfo(msg) {
        switch (msg.type) {
            case Type.SimpleMessage:
                return null

            case Type.IllegalFileIsolated:
                return __('文件涉及非法内容，已被隔离：')

            case Type.IllegalFileRestored:
                return __('文件经审核不含非法内容，已还原：')

            case Type.AntivirusMessage:
                switch (msg.antivirusop) {
                    case AntiVirusOperation.Isolated:
                        return __('文件可能存在病毒，已被隔离：')
                    case AntiVirusOperation.Repaired:
                        return __('文件可能存在病毒，已被修复：')
                }
        }
    }

    renderSecurityMsgs() {
        return (
            <div className={ styles['message-list'] }>
                <ul>
                    {
                        this.state.showSecuritymsgs.map(item => {
                            return (
                                <li
                                    className={ classnames(styles['result-item'], { [styles['unreadcolor']]: !item.isread }) }
                                    onClick={ () => { this.read(item) } }
                                >
                                    <h1>
                                        <span className={ styles['title-span'] }>
                                            <span className={ styles['notice-icon-wrap'] }>
                                                {
                                                    !item.isread ? (
                                                        <FontIcon
                                                            font={ 'Anyshare' }
                                                            size="10px"
                                                            code={ '\uf004' }
                                                            fallback={ gotImg }
                                                            className={ styles['notice-icon'] }
                                                        />
                                                    ) : null
                                                }
                                            </span>
                                            {
                                                item.docname ?
                                                    getIcon(item, { size: 32 }) :
                                                    null
                                            }
                                            {
                                                item.docname ? (
                                                    <span className={ styles['title-text'] }>{ item.docname }</span>
                                                ) : null
                                            }
                                        </span>
                                    </h1>
                                    <div className={ styles['content'] }>
                                        <div className={ styles['layout-spacing'] }>
                                            <div className={ styles['atom'] }>
                                                <span>{ formatTime(item.time / 1000) }</span>
                                            </div>
                                            <div className={ styles['atom'] }>
                                                <span>
                                                    {
                                                        this.renderSecurityInfo(item)
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        {
                                            this.renderSummary(item)
                                        }
                                        <div className={ styles['layout-spacing'] }>
                                            {
                                                this.renderHandle(item)
                                            }
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }



}