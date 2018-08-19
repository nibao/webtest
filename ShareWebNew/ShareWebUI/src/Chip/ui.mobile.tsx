import * as React from 'react';
import * as classnames from 'classnames';
import { isFunction } from 'lodash';
import Text from '../Text/ui.mobile';
import * as styles from './styles.mobile.css';

export default function Chip({ removeHandler, readOnly = false, disabled = false, children }: UI.Chip.Props) {
    return (
        <div className={classnames(styles['chip'], { [styles['disabled']]: disabled })}>
            <span className={styles['text']}>
                <Text>
                    {
                        children
                    }
                </Text>
            </span>
            {
                !readOnly && isFunction(removeHandler) ?
                    <a href="javascript:void(0)" className={styles.action} onClick={() => !disabled && removeHandler()} >x</a>
                    : null
            }
        </div>
    )
}