import * as React from 'react';
import { Type } from '../../../../core/message/message';
import __ from './locale'
import { formatText } from '../helper';
import * as styles from './styles.desktop.css';


/**
 * 渲染审核消息列表中每一项的审核消息
 * @export
 * @param {Components.Message2.RenderMsgs.CheckInfo.Props} { msg } 
 * @returns 
 */
export default function CheckInfo({ msg }: Components.Message2.RenderMsgs.CheckInfo.Props) {
    switch (msg.type) {
        case Type.OpenShareApply:
        case Type.SetOwnerApply:
            return <span>{__('${sender}给${accessorname}共享了文档，请您审核', { 'sender': msg.sender, 'accessorname': msg.accessorname })}</span>

        case Type.CloseShareApply:
        case Type.CancelOwnerApply:
            return <span>{__('${sender}给${accessorname}取消了共享，请您审核', { 'sender': msg.sender, 'accessorname': msg.accessorname })}</span>

        case Type.OpenLinkApply:
            return <span>{__('${sender}开启了外链共享，请您审核', { 'sender': msg.sender })}</span>

        case Type.OpenShareAuditResult:
        case Type.OpenOwnerAuditResult:
            return msg.auditresult ?
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您给${accessorname}共享的文档，已通过审核', { 'accessorname': msg.accessorname }), ['已通过', '已通過', 'approved'],styles['agree']) }} />
                :
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您给${accessorname}共享的文档，未通过审核', { 'accessorname': msg.accessorname }), ['未通过', '未通過', 'rejected'], styles['deny']) }} />

        case Type.CloseShareAuditResult:
        case Type.CloseOwnerAuditResult:
            return msg.auditresult ?
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您给${accessorname}取消了共享文档，已通过审核', { 'accessorname': msg.accessorname }), ['已通过', '已通過', 'approved'], styles['agree']) }} />
                :
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您给${accessorname}取消了共享文档，未通过审核', { 'accessorname': msg.accessorname }), ['未通过', '未通過', 'rejected'], styles['deny']) }} />

        case Type.OpenLinkAuditResult:
            return msg.auditresult ?
                <span dangerouslySetInnerHTML={{ __html: formatText(__('${sender}开启了外链共享，已通过审核', { 'sender': msg.sender }), ['已通过', '已通過', 'approved'], styles['agree']) }} />
                :
                <span dangerouslySetInnerHTML={{ __html: formatText(__('${sender}开启了外链共享，未通过审核', { 'sender': msg.sender }), ['未通过', '未通過', 'rejected'], styles['deny']) }} />

        case Type.PendingProcessMessage:
            return msg.previousauditor ?
                <span>{__('${previousauditor}通过了${requester}发起的流程，请您继续审核', { 'previousauditor': msg.previousauditor, 'requester': msg.requestername })}</span>
                :
                <span>{__('${requester}发起了文档流程，请您审核', { 'requester': msg.requestername })}</span>

        case Type.ProcessProgressMessage:
            return <span>{__('您发起的流程，已提交给${nextlevel}级审核员${nextauditor}', { 'nextlevel': msg.nextlevel, 'nextauditor': msg.nextauditor })}</span>

        case Type.ProcessResultMessage:
            return msg.auditresult ?
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您发起的流程，已通过审核'), ['已通过', '已通過', 'approved'], styles['agree']) }} />
                :
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您发起的流程，未通过审核'), ['未通过', '未通過', 'rejected'], styles['deny']) }} />

        case Type.PendingEditCsfApply:
            return <span>{__('${sender}更改了文件密级，请您审核：', { sender: msg.sender })}</span>

        case Type.EditCsfAuditResult:
            return msg.auditresult ?
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您的文件密级更改操作，已通过审核：'), ['已通过', '已通過', 'approved'], styles['agree']) }} />
                :
                <span dangerouslySetInnerHTML={{ __html: formatText(__('您的文件密级更改操作，未通过审核：'), ['未通过', '未通過', 'rejected'], styles[styles['deny']]) }} />
    }
}