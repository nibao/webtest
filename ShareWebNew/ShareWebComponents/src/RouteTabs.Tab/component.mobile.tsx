import * as React from 'react'
import * as classnames from 'classnames'
import RouteLink from '../RouteLink/ui.mobile'
import { ClassName } from '../../ui/helper'
import * as styles from './styles.mobile.css'

const Tab = ({ label, icon, path, className, ...otherProps }) => (
    <RouteLink
        className={classnames(styles['link'], className)}
        activeClassName={ClassName.Color}
        to={path}
        disableWhenActived={true}
        { ...otherProps }
    >
        {
            icon ? <div>{icon}</div> : null
        }
        {
            label ? <div className={styles['label']}>{label}</div> : null
        }
    </RouteLink>
)

export default Tab 