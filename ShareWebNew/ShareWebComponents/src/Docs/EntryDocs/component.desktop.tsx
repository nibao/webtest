import * as React from 'react'
import { includes } from 'lodash'
import EntryDocsBase from './component.base'
import Fold from '../../../ui/Fold/ui.desktop'
import { getViewTypesName } from '../../../core/entrydoc/entrydoc'
import List from '../List/component.desktop'
import __ from './locale'
import * as styles from './styles.desktop.css'

export default class EntryDocs extends EntryDocsBase {
    render() {
        const { viewsinfo, viewsOpen, sortRule, list, layout, onToggleViewOpen, ...otherProps } = this.props
        const { viewDocTypes, viewDocs, viewSelections } = this.state
        return (
            <div>
                {
                    viewDocTypes.map(viewDocType => (
                        viewDocs[viewDocType].length ?
                            <Fold
                                className={styles['fold']}
                                label={`${getViewTypesName(viewDocType)} (${viewDocs[viewDocType].length})`}
                                open={includes(viewsOpen, viewDocType)}
                                onToggle={() => onToggleViewOpen(viewDocType)}
                            >
                                <List
                                    list={{ dirs: viewDocs[viewDocType], files: [] }}
                                    selections={viewSelections[viewDocType]}
                                    onSelectionChange={(selections, multiple) => this.handleViewSelectionChange(viewDocType, selections, multiple)}
                                    {...otherProps}
                                />
                            </Fold> :
                            null
                    ))
                }
            </div>
        )
    }
}