import * as React from 'react';
import * as classnames from 'classnames';
import { noop, isFunction } from 'lodash';
import Text from '../Text/ui.desktop';
import * as styles from './styles.desktop';

export default function Chip({ actionClassName, className, removeHandler, readOnly = false, disabled = false, children }: UI.Chip.Props) {
    return (
        <div className={classnames(styles['chip'], className, { [styles['disabled']]: disabled })}>
            <div className={styles['text']}>
                <Text>
                    {
                        children
                    }
                </Text>
            </div>
            {
                !readOnly && isFunction(removeHandler) ?
                    <a href="javascript:void(0)" className={classnames(styles['action'], actionClassName)} onClick={(e) => { e.stopPropagation(); !disabled && removeHandler() }} >x</a>
                    : null
            }
        </div>
    )
}