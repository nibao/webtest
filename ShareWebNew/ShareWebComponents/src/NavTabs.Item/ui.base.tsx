import *  as React from 'react'
import RouterLink from '../RouterLink/ui.mobile'
import UIIcon from '../../ui/UIIcon/ui.mobile'

export default ({ children, code, ...otherProps }) => (
    <RouterLink>
        {
            code ?
                <UIIcon code={code} {...otherProps} /> :
                null
        }
        {
            children
        }
    </RouterLink>
)