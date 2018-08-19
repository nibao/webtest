import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import DataListBase from './ui.base'
import Item from '../DataList.Item/ui.desktop'
import * as styles from './styles.desktop.css'

export default class DataList extends DataListBase {

    static Item = Item

    render() {
        const { className } = this.props
        const { selections, items } = this.state
        return (
            <ul className={classnames(styles['list'], className)}>
                {
                    items.map((item: React.ReactElement<UI.DataListItem.Props>, index) => {
                        const { data, ...otherProps } = item.props
                        return React.cloneElement(item, {
                            selected: includes(selections, data),
                            onToggleSelect: e => this.toggleSelect(e, item, index),
                            onClick: e => this.handleClick(e, item, index),
                            onDoubleClick: e => this.handleDoubleClick(e, item, index),
                            onContextMenu: e => this.handleContextMenu(e, item, index),
                            ...otherProps
                        })
                    })
                }
            </ul>
        )
    }
}