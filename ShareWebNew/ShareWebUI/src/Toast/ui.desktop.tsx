import * as React from 'react'
import { noop } from 'lodash'
import UIIcon from '../UIIcon/ui.desktop'
import * as styles from './styles.desktop.css'

const Toast: React.StatelessComponent<UI.Toast.Props> = ({ children, closable, code, onClose, ...otherProps }) => (
    <div className={styles['toast']}>
        <div className={styles['toast-bg']}></div>
        {
            code ? <UIIcon code={code} {...otherProps} className={styles['icon']} /> : null
        }
        <span className={styles['text']}>
            {
                children
            }
        </span>
        {
            closable ? <UIIcon className={styles['close']} onClick={onClose} code={'\uf046'} size={14} /> : null
        }
    </div>
)

Toast.defaultProps = {
    closable: false,
    onClose: noop
}

export default Toast