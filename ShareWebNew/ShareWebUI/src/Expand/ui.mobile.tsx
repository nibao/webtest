import * as React from 'react'
import ExpandBase from './ui.base'
import * as classnames from 'classnames'
import * as styles from './styles.desktop'

export default class Expand extends ExpandBase {
    render() {
        const { children, open, ...otherProps } = this.props
        const { marginTop, animation, loaded } = this.state
        return (
            <div className={classnames(styles['container'], { [styles['loaded']]: loaded })}>
                <div
                    className={classnames({ [styles['animation']]: animation })}
                    style={{ marginTop: open ? 0 : marginTop }}
                    ref="content"
                    {...otherProps}
                >
                    {children}
                </div>
            </div>
        )
    }
}