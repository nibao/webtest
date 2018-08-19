import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import DataListBase from './ui.base'
import Item from '../DataList.Item/ui.mobile'
import * as styles from './styles.mobile.css'

export default class DataList extends DataListBase {

    static Item = Item

    render() {
        const { className, selecting } = this.props
        const { selections, items } = this.state
        return (
            <div className={styles['container']}>
                <ul className={classnames(styles['list'], className)}>
                    {
                        items.map((item: React.ReactElement<UI.DataListItem.Props>, index) => {
                            const { data, ...otherProps } = item.props
                            return React.cloneElement(item, {
                                ...otherProps,
                                selected: includes(selections, data),
                                onToggleSelect: e => this.toggleSelect(e, item, index),
                                onClick: e => {
                                    if (selecting) {
                                        this.toggleSelect(e, item, index)
                                    } else if (typeof item.props.onClick === 'function') {
                                        item.props.onClick(e)
                                    }
                                },
                                onDoubleClick: e => this.handleDoubleClick(e, item, index),
                                onContextMenu: e => this.handleContextMenu(e, item, index),
                                selecting
                            })
                        })
                    }
                </ul>
            </div>
        )
    }
}