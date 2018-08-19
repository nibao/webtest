import * as React from 'react';
import * as classnames from 'classnames';
import { Type } from '../../../../core/message/message';
import { formatTimeRelative } from '../../../../util/formatters/formatters';
import { permissionInfo, CSFInfo, renderAudittype } from '../helper'
import __ from './locale'
import * as styles from './styles.desktop.css';


/**
 * 渲染审核消息列表和安全消息列表中的信息字段
 * @export
 * @param {Components.Message2.RenderMsgs.SummaryInfo.Props} { msg, csfSysId, csfTextArray } 
 * @returns 
 */
export default function SummaryInfo({ msg, csfSysId, csfTextArray }: Components.Message2.RenderMsgs.SummaryInfo.Props) {

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
                <div>
                    <div className={styles['atom']}>
                        <label>{__('权限：')}</label>
                        <span>
                            {
                                msg.type === Type.OpenShareApply ||
                                    msg.type === Type.CloseShareApply ||
                                    msg.type === Type.OpenShareAuditResult ||
                                    msg.type === Type.CloseShareAuditResult ||
                                    msg.type === Type.OpenLinkApply ||
                                    msg.type === Type.OpenLinkAuditResult
                                    ?
                                    permissionInfo(msg)
                                    :
                                    __('所有者')
                            }
                        </span>
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('有效期至：')}</label>
                        {
                            msg.end && msg.end !== -1 ? formatTimeRelative(msg.end / 1000) : __('永久有效')
                        }
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('文件密级：')}</label>
                        <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span>
                    </div>
                </div>
            )

        case Type.PendingProcessMessage:
        case Type.ProcessProgressMessage:
        case Type.ProcessResultMessage:
            return (
                <div>
                    <div className={styles['atom']}>
                        <label>{__('流程名称：')}</label>
                        <span>
                            {
                                msg.processname
                            }
                        </span>
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('审核模式：')}</label>
                        <span>
                            {
                                renderAudittype(msg.docaudittype)
                            }
                        </span>
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('文件密级：')}</label>
                        <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span>
                    </div>
                </div>
            )

        case Type.PendingEditCsfApply:
            return (
                <div>
                    <div className={styles['atom']}>
                        <label>{__('文件密级：')}</label>
                        <span>
                            {
                                msg.csf ?
                                    <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span> :
                                    '---'
                            }
                        </span>
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('更改为：')}</label>
                        <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span>
                    </div>
                </div>
            )

        case Type.EditCsfAuditResult:
            return (
                <div className={styles['atom']}>
                    <label>{__('文件密级：')}</label>
                    <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span>
                </div>
            )

        case Type.SimpleMessage:
            return (
                <span>
                    {msg.content}
                </span>
            )

        case Type.IllegalFileIsolated:
        case Type.IllegalFileRestored:
            return (
                <div>
                    <div className={styles['atom']}>
                        <label>{__('创建者：')}</label>
                        <span>
                            {
                                msg.creator
                            }
                        </span>
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('修改者：')}</label>
                        <span>
                            {
                                msg.modifier
                            }
                        </span>
                    </div>
                    <div className={styles['atom']}>
                        <label>{__('文件密级：')}</label>
                        <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span>
                    </div>
                </div>
            )

        case Type.AntivirusMessage:
            return (
                <div>
                    <div className={styles['atom']}>
                        <label>{__('文件密级：')}</label>
                        <span>{CSFInfo(msg.csf, csfSysId, csfTextArray)}</span>

                    </div>
                    <div className={styles['atom']}>
                        <label>{__('防病毒管理员：')}</label>
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