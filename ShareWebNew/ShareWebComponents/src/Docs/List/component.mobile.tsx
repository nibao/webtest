import * as React from 'react'
import { includes, last } from 'lodash'
import ListBase from './component.base'
import DataList from '../../../ui/DataList/ui.mobile'
import UIIcon from '../../../ui/UIIcon/ui.mobile'
import Thumbnail from '../../Thumbnail/component.mobile'
import { formatTime, formatSize } from '../../../util/formatters/formatters'
import { docname, isDir } from '../../../core/docs/docs'
import * as styles from './styles.mobile.css'

export default class List extends ListBase {

    handleOpen(e, doc) {
        if (e.defaultPrevented) {
            return
        }
        e.preventDefault()
        this.props.onOpen(doc)
    }

    render() {
        const {
            crumbs,
            list,
            selections,
            selecting,
            onSelectionChange
        } = this.props
        const currentDir = last(crumbs)
        const docs = [...list.dirs, ...list.files]
        return (
            <DataList
                selecting={selecting}
                selections={selections}
                onSelectionChange={onSelectionChange}
            >
                {
                    docs.map(doc => (
                        <DataList.Item
                            className={styles['item']}
                            data={doc}
                            selectable={true}
                            onClick={e => this.handleOpen(e, doc)}
                        >
                            <div className={styles['wrapper']}>
                                <div className={styles['thumbnail']}>
                                    <Thumbnail doc={doc} size={32} />
                                </div>
                                <div className={styles['name']}>
                                    {docname(doc)}
                                </div>
                                <div className={styles['metas']}>
                                    <span className={styles['meta']}>
                                        {
                                            `${formatTime(doc.modified / 1000)}`
                                        }
                                    </span>
                                    {
                                        isDir(doc) ?
                                            null :
                                            <span className={styles['meta']}>
                                                {`${formatSize(doc.size)}`}
                                            </span>
                                    }
                                </div>
                                <UIIcon
                                    code={'\uf0d0'}
                                    color={'#868686'}
                                    size={20}
                                    className={styles['menu-icon']}
                                    disabled={selecting}
                                    onClick={e => this.openDrawer(e, [doc])}
                                />
                            </div>
                        </DataList.Item>
                    ))
                }
            </DataList>
        )
    }
}