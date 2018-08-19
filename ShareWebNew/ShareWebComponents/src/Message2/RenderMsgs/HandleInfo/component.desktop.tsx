import * as React from 'react';
import { Type, AntiVirusOperation } from '../../../../core/message/message';
import Title from '../../../../ui/Title/ui.desktop';
import __ from './locale'
import * as styles from './styles.desktop.css';


/**
 * 渲染审核消息列表和安全消息列表中每一项的可执行操作信息
 * @export
 * @param {Components.Message2.RenderMsgs.HandleInfo.Props} { msg, msgsDoc, doCheck, doRedirect, showResultDialog } 
 * @returns 
 */
export default function HandleInfo({ msg, msgsDoc, doCheck, doRedirect, showResultDialog }: Components.Message2.RenderMsgs.HandleInfo.Props) {
    switch (msg.type) {
        case Type.OpenShareApply:
        case Type.SetOwnerApply:
        case Type.CloseShareApply:
        case Type.CancelOwnerApply:
        case Type.OpenLinkApply:
        case Type.PendingProcessMessage:
        case Type.PendingEditCsfApply:
            return (
                <div className={styles['atom']}>
                    <a
                        className={styles['link']}
                        onClick={() => doCheck(msgsDoc[msg.id])}
                    >
                        {__('去审核')}
                    </a>
                </div>
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
                <div className={styles['atom']}>
                    <a
                        className={styles['link']}
                        onClick={() => showResultDialog(msg)}
                    >
                        {__('查看详情')}
                    </a>
                </div>
            )
        case Type.SimpleMessage:
            return (
                <div className={styles['atom']}>
                    <span>{__('来自：${sender}', { sender: msg.sender })}</span>
                </div>
            )
        case Type.IllegalFileIsolated:
            return (
                <div className={styles['atom']}>
                    <a
                        className={styles['link']}
                        onClick={() => doCheck(msgsDoc[msg.id])}
                    >
                        {__('查看详情')}
                    </a>
                </div>
            )
        case Type.IllegalFileRestored:
            return (
                <div className={styles['atom']}>
                    <label>{__('所在位置：')}</label>
                    <Title content={msgsDoc[msg.id].path}>
                        <a
                            className={styles['link']}
                            onClick={() => doRedirect(msgsDoc[msg.id])}
                        >
                            {msgsDoc[msg.id].path}
                        </a>
                    </Title>
                </div>
            )
        case Type.AntivirusMessage:
            if (msg.antivirusop === AntiVirusOperation.Repaired) {
                return (
                    <div className={styles['atom']}>
                        <label>{__('所在位置：')}</label>
                        <Title content={msgsDoc[msg.id].path}>
                            <a
                                className={styles['link']}
                                onClick={() => doRedirect(msgsDoc[msg.id])}
                            >
                                {msgsDoc[msg.id].path}
                            </a>
                        </Title>
                    </div>
                )
            }
    }
}