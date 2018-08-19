import * as React from 'react';
import * as classnames from 'classnames';
import { isFunction } from 'lodash';
import Text from '../Text/ui.desktop';
import * as styles from './styles.client';

export default function Chip({ className, removeHandler, readOnly = false, disabled = false, children }: UI.Chip.Props) {
    return (
        <div className={classnames(styles['chip'], className, { [styles['disabled']]: disabled })}>
            <span className={styles['text']}>
                <Text>
                    {
                        children
                    }
                </Text>
            </span>
            {
                !readOnly && isFunction(removeHandler) ?
                    <a href="javascript:void(0)" className={styles.action} onClick={(e) => { e.stopPropagation(); !disabled && removeHandler() } } >x</a>
                    : null
            }
        </div>
    )
}