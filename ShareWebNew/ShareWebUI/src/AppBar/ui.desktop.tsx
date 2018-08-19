import * as React from 'react'
import * as classnames from 'classnames'
import { ClassName } from '../helper'
import * as styles from './styles.desktop.css'

const AppBar: React.StatelessComponent<any> = function AppBar({ className, children, ...props } = {}) {
    return (
        <div className={classnames(styles['app-bar'], ClassName.BorderTopColor, className)} {...props}>{children}</div>
    )
}

export default AppBar