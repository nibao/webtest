import * as React from 'react'
import { includes } from 'lodash'
import { getViewTypesName } from '../../../core/entrydoc/entrydoc'
import Fold from '../../../ui/Fold/ui.mobile'
import List from '../List/component.mobile'
import EntryDocsBase from './component.base'
import __ from './locale'
import * as styles from './styles.mobile.css'

export default class EntryDocs extends EntryDocsBase {
    render() {
        const { viewsOpen, onToggleViewOpen, onRequestOpenDir } = this.props
        const { viewDocTypes, viewDocs } = this.state

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
                                    onRequestOpenDir={onRequestOpenDir}
                                />
                            </Fold>
                            :
                            null
                    ))
                }
            </div>
        )
    }
}