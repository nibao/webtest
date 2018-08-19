import * as React from 'react'
import * as classnames from 'classnames'
import * as styles from './styles.mobile.css'

const AppBar: React.StatelessComponent<any> = function AppBar({ className, children, ...props } = {}) {
    return (
        <div className={classnames(styles['app-bar'], className)} {...props}>{children}</div>
    )
}

export default AppBar