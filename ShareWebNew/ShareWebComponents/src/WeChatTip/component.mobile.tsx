import * as React from 'react';
import { userAgent, OSType } from '../../util/browser/browser';
import __ from './locale';
import * as styles from './styles.mobile.css'

export default function WeChatTip() {
    return (
        <div className={styles['container']}>
            {
                userAgent().os === OSType.IOS ? __('请点击右上角图标，使用Safari打开') : __('请点击右上角图标，使用浏览器打开')
            }
        </div>
    )
}

