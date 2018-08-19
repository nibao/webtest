
import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import * as styles from './styles.desktop.css';

const SwitchButton2: React.StatelessComponent<UI.SwitchButton2.Props> = function SwitchButton2({ active, onChange = noop, disabled = false, value }) {

    return (
        <div
            className={
                classnames(
                    styles['button-style'],
                    { [styles['disabled']]: disabled }
                )
            }
        >
            <a onClick={() => { !disabled && onChange(value, !active) }}>
                <div
                    className={
                        classnames(
                            styles['slide'],
                            { [styles['slide-on']]: active },
                            { [styles['slide-close']]: !active }
                        )
                    }
                >

                </div>
                <div
                    className={
                        classnames(
                            styles['btn'],
                            { [styles['btn-on']]: active },
                            { [styles['btn-close']]: !active }

                        )
                    }
                >

                </div>
            </a>
        </div>
    )
}


export default SwitchButton2; 