import * as React from 'react';
import FlexBoxItem from '../FlexBox.Item/ui.desktop';
import * as styles from './styles.desktop.css';

const FlexBox: UI.FlexBox.Component = function FlexBox({ children }) {
    return (
        <div className={ styles['flex'] }>
            {
                children
            }
        </div>
    )
} as UI.FlexBox.Component

FlexBox.Item = FlexBoxItem;

export default FlexBox