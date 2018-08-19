import * as React from 'react'
import { List as ListMobile } from '@anyshare/shareweb-mobile-ui'
import { isDir, docname } from '../../../core/docs/docs'
import { formatTime, formatSize } from '../../../util/formatters/formatters'
import Thumbnail from '../../Thumbnail/component.mobile'
import ListBase from './component.base'

export default class List extends ListBase {
    render() {
        const {
            list,
            EmptyComponent,
        } = this.props
        const docs = [...list.dirs, ...list.files]

        return (
            <ListMobile
                data={docs}
                renderAvatar={doc => (
                    <Thumbnail
                        doc={doc}
                        size={32}
                        onClick={e => this.handleOpen(e, doc)}
                    />
                )}
                renderDescription={doc => (
                    isDir(doc) ?
                        `${formatTime(doc.modified / 1000)}`
                        :
                        `${formatTime(doc.client_mtime / 1000)} ${formatSize(doc.size)}`
                )}
                renderTitle={doc => docname(doc)}
                itemKeyExtractor={({ docid }) => docid}
                ListEmptyComponent={EmptyComponent}
                onSelectionChange={doc => this.props.onRequestOpenDir(doc, { newTab: false })}
            />
        )
    }
}