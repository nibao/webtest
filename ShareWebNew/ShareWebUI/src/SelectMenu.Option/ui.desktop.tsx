import * as React from 'react'
import PopMenuItem from '../PopMenu.Item/ui.desktop'

const SelectMenuOption: React.StatelessComponent<any> = function SelectMenuOption({ selected, value, ...otherProps }) {
    return (
        <PopMenuItem icon={typeof value !== 'undefined' && selected ? '\uf068' : undefined} {...otherProps} />
    )
}

export default SelectMenuOption