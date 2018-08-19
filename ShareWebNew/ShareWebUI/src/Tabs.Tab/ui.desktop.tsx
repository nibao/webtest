import * as React from 'react';
import * as classnames from 'classnames';
import { ClassName } from '../helper';
import * as styles from './styles.desktop.css';

const TabsTab: React.StatelessComponent<UI.TabsTab.Props> = function TabsTab({ children, active, style, onActive, className }) {
    return (
        <div
            className={classnames(
                styles['tab'],
                [ClassName.Color__Hover],
                {
                    [styles['active']]: active,
                    [ClassName.BorderBottomColor]: active,
                    [ClassName.Color]: active
                },
                className
            )}
            style={{ ...style }}
            onClick={onActive}
        >
            {
                children
            }
        </div>
    )
}

export default TabsTab