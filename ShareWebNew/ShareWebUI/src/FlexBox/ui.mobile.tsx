import * as React from 'react';
import FlexBoxItem from '../FlexBox.Item/ui.mobile';
import * as styles from './styles.mobile.css';

export default function FlexBox({children}: UI.FlexBox.Props) {
    return (
        <div className={styles['flex']}>
            {
                children
            }
        </div>
    )
}

FlexBox.Item = FlexBoxItem;