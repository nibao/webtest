import * as React from 'react'
import { List as ListMobile } from '@anyshare/shareweb-mobile-ui'
import { isDir, docname } from '../../../core/docs/docs'
import { UIIcon } from '../../../ui/ui.mobile'
import { formatTime, formatSize, formatTimeRelative } from '../../../util/formatters/formatters'
import Thumbnail from '../../Thumbnail/component.mobile'
import ListBase from './component.base'
import * as styles from './styles.mobile.css'
import __ from './locale'

export default class List extends ListBase {
    render() {
        const {
            list,
            downloadEnable,
            EmptyComponent,
            onRequestDownload
        } = this.props
        const docs = [...list.dirs, ...list.files]


        return (
            <ListMobile
                data={docs}
                renderAction={doc => (
                    downloadEnable && !isDir(doc) && (
                        <div
                            className={styles['download-icon']}
                            onClick={(e) => {
                                e.stopPropagation()
                                onRequestDownload([doc])
                            }}
                        >
                            <UIIcon
                                code={'\uf02a'}
                                size={20}
                            />
                        </div>
                    )
                )}
                renderAvatar={doc => (
                    <Thumbnail
                        doc={doc}
                        size={32}
                        className={styles['thumbnail']}
                        onClick={e => this.handleOpen(e, doc)}
                    />
                )}
                renderDescription={doc => (
                    isDir(doc) ?
                        `${formatTime(doc.modified / 1000)}`
                        :
                        `${formatTime(doc.modified / 1000)} ${formatSize(doc.size)}`
                )}
                renderTitle={doc => docname(doc)}
                itemKeyExtractor={({ docid }) => docid}
                ListEmptyComponent={EmptyComponent}
                onSelectionChange={doc => this.props.onRequestOpenDir(doc, { newTab: false })}
            />
        )
    }
}