import * as React from 'react';
import Icon from '../../../ui/Icon/ui.desktop';
import { MessageType } from '../../../core/message/message';

import * as noMessageIcon from './assets/no-message.png';
import * as styles from './styles.desktop.css';
import __ from './locale';

/**
 *  渲染无对应消息提示信息
 * @export
 * @param {Components.Message2.NomsgTip.Props} { showMsgType, selectedMode } 
 * @returns 
 */
export default function renderNoMsgTip({ showMsgType, selectedMode }: Components.Message2.NomsgTip.Props) {
    const msgTipText = {
        [MessageType.Share]: [__('暂无共享消息。'), __('暂无未读消息。'), __('暂无已读消息。')],
        [MessageType.Check]: [__('暂无审核消息。'), __('暂无未读消息。'), __('暂无已读消息。')],
        [MessageType.Security]: [__('暂无安全消息。'), __('暂无未读消息。'), __('暂无已读消息。')]
    }
    return (
        <div className={styles['no-message-tip']}>
            <Icon
                size="64"
                url={noMessageIcon}
            />
            <h1 className={styles['no-message-text']}>
                {msgTipText[showMsgType][selectedMode - 1]}
            </h1>
        </div>
    )
}