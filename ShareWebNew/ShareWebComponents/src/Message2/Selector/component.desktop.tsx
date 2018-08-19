import * as React from 'react';
import FontIcon from '../../../ui/FontIcon/ui.desktop';
import SelectMenu from '../../../ui/SelectMenu/ui.desktop';
import { MsgStatus } from '../../../core/message/message';

import * as viewImg from './assets/F04C.png';
import * as styles from './styles.desktop.css';
import __ from './locale';

/**
 * 渲染消息类型下拉选框
 * @export
 * @param {Components.Message2.Selector.Props} { selectedMode, onChangeMode } 
 * @returns 
 */
export default function renderSelector({ selectedMode, onChangeMode }: Components.Message2.Selector.Props) {
    const MsgshowMode = {
        [MsgStatus.All]: __('全部消息'),
        [MsgStatus.Unread]: __('未读消息'),
        [MsgStatus.Read]: __('已读消息')
    }
    
    return (
        <div className={styles['message-selecter']}>
            <SelectMenu
                value={selectedMode}
                anchorOrigin={['right', 'bottom']}
                targetOrigin={['right', 'top']}
                closeWhenMouseLeave={true}
                onChange={onChangeMode}
                label={
                    <div>
                        {MsgshowMode[selectedMode]}
                        <FontIcon font={'Anyshare'}
                            size="16px" code={'\uf04c'}
                            color="#757575"
                            fallback={viewImg}
                            className={styles['sel-icon']}
                        />
                    </div>
                }
            >
                <SelectMenu.Option
                    value={MsgStatus.All}
                    label={MsgshowMode[MsgStatus.All]}
                />
                <SelectMenu.Option
                    value={MsgStatus.Unread}
                    label={MsgshowMode[MsgStatus.Unread]}
                />
                <SelectMenu.Option
                    value={MsgStatus.Read}
                    label={MsgshowMode[MsgStatus.Read]}
                />
            </SelectMenu>
        </div>
    )
}