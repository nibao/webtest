import * as React from 'react'
import { noop } from 'lodash'
import * as classnames from 'classnames'
import * as styles from './styles.mobile.css'

const Drawer: React.StatelessComponent<UI.Drawer.Props> = function Drawer({ open, mask, position, children, className, onClickMask, ...otherProps }) {
    return (
        <div className={styles['container']}>
            {
                mask ?
                    <div
                        className={classnames(styles['mask'], { [styles['show']]: open })}
                        onClick={onClickMask}
                    ></div> :
                    null
            }
            <div className={classnames(styles['drawer'], styles[position], { [styles['open']]: open }, className)} {...otherProps}>{children}</div>
        </div>
    )
}

Drawer.defaultProps = {
    open: false,
    mask: true,
    position: 'bottom',
    onClickMask: noop
}

export default Drawer