import * as React from 'react';
import { Type, AntiVirusOperation } from '../../../../core/message/message';
import __ from './locale'
import { formatText } from '../helper';
import * as styles from './styles.desktop.css';


/**
 * 渲染安全消息列表中每一项的安全信息
 * @export
 * @param {Components.Message2.RenderMsgs.SecurityInfo.Props} { msg } 
 * @returns 
 */
export default function SecurityInfo({ msg }: Components.Message2.RenderMsgs.SecurityInfo.Props) {
    switch (msg.type) {
        case Type.SimpleMessage:
            return null

        case Type.IllegalFileIsolated:
            return <span dangerouslySetInnerHTML={{ __html: formatText(__('文件涉及非法内容，已被隔离：'), ['隔离', '隔離', 'isolated'], styles['deny']) }} />

        case Type.IllegalFileRestored:
            return <span dangerouslySetInnerHTML={{ __html: formatText(__('文件经审核不含非法内容，已还原：'), ['还原', '還原', 'restored'], styles['agree']) }} />

        case Type.AntivirusMessage:
            switch (msg.antivirusop) {
                case AntiVirusOperation.Isolated:
                    return <span dangerouslySetInnerHTML={{ __html: formatText(__('文件可能存在病毒，已被隔离：'), ['隔离', '隔離', 'isolated'], styles['deny']) }} />

                case AntiVirusOperation.Repaired:
                    return <span dangerouslySetInnerHTML={{ __html: formatText(__('文件可能存在病毒，已被修复：'), ['修复', '修復', 'repaired'], styles['agree']) }} />

            }
    }
}