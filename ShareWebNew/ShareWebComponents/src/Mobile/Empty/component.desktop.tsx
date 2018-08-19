import * as React from 'react';
import Centered from '../../../ui/Centered/ui.desktop';
import Icon from '../../../ui/Icon/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';
import * as empty from './assets/empty.png';

/**
 * 移动设备列表为空界面
 */
export default function Empty() {
    return (
        <Centered>
            <div className={styles['empty-box']} >
                <Icon
                    url={empty}
                />
                <div className={styles['empty-message']} >
                    {
                        __('您还没有登录过移动设备')
                    }
                </div>

            </div>
        </Centered>
    )
}