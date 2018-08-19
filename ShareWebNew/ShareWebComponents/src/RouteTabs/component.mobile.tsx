import * as React from 'react'
import * as classnames from 'classnames'
import Tab from '../RouteTabs.Tab/component.mobile'
import * as styles from './styles.mobile.css'

const RouteTabs: React.StatelessComponent<any> = ({ children, className, ...otherProps }) => (
    <div {...otherProps} className={classnames(styles['container'], className)}>
        {children}
    </div>
)

RouteTabs.Tab = Tab

export default RouteTabs