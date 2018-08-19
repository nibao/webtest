import * as React from 'react';
import * as classnames from 'classnames';
import { getAlignCls } from './helper';
import * as styles from './styles.mobile.css';

export default function FlexBoxItem({children, width, align = 'left middle'}: UI.FlexBoxItem.Props) {
    return (
        <div className={classnames(styles['item'], getAlignCls(styles, align))} style={{ width }}>
            {
                children
            }
        </div>
    )
}