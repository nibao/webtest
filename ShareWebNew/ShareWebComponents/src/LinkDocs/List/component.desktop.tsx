import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import { formatSize, formatTimeRelative } from '../../../util/formatters/formatters'
import { docname, isDir } from '../../../core/docs/docs'
import { isUserId } from '../../../core/user/user'
import { DataList, Title, IconGroup } from '../../../ui/ui.desktop'
import Thumbnail from '../../Thumbnail/component.desktop'
import ListBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class List extends ListBase {
    render() {
        const {
            list,
            selections,
            checkbox,
            downloadEnable,
            onSelectionChange,
            onContextMenu,
            onRequestDownload,
            onRequrestSaveTo,
        } = this.props
        const docs = [...list.dirs, ...list.files]

        return (
            <DataList
                selections={selections}
                className={styles['list']}
                onSelectionChange={onSelectionChange}
                onDoubleClick={this.handleOpen.bind(this)}
                onContextMenu={onContextMenu}
            >
                {
                    docs.map(doc => (
                        <DataList.Item
                            key={doc.docid}
                            className={
                                classnames(
                                    styles['item'],
                                    { [styles['selected']]: includes(selections, doc) }
                                )}
                            data={doc}
                            selectable={checkbox}
                            checkbox={checkbox}
                        >
                            <div className={styles['wrapper']}>
                                <div className={styles['thumbnail-container']}>
                                    <Thumbnail
                                        doc={doc}
                                        size={32}
                                        className={styles['thumbnail']}
                                        onClick={e => this.handleOpen(e, doc)}
                                    />
                                </div>
                                <div className={styles['line']}>
                                    <Title content={docname(doc)}>
                                        <a
                                            draggable={false}
                                            href="javascript:void(0);"
                                            className={styles['name']}
                                            onClick={e => this.handleOpen(e, doc)}
                                        >
                                            {docname(doc)}
                                        </a>
                                    </Title>
                                </div>
                                <div className={styles['line']}>
                                    <div className={styles['metas']}>
                                        <span className={styles['meta']}>
                                            {
                                                doc.create_time === doc.modified ?
                                                    `${isUserId(doc.creator) ? __('未知用户') : doc.creator} ${__('创建于')} ${formatTimeRelative(doc.create_time / 1000)}`
                                                    :
                                                    `${isUserId(doc.editor) ? __('未知用户') : doc.editor} ${__('修改于')} ${formatTimeRelative(doc.modified / 1000)}`
                                            }
                                        </span>
                                        {
                                            !isDir(doc) ?
                                                <span className={styles['meta']}>
                                                    {`${formatSize(doc.size)}`}
                                                </span>
                                                : null
                                        }
                                    </div>
                                    {
                                        downloadEnable && (
                                            <IconGroup
                                                onDoubleClick={e => { e.preventDefault() }}
                                                onClick={e => this.handleIconClick(e, doc)}
                                            >
                                                <IconGroup.Item
                                                    code={'\uf02a'}
                                                    size={16}
                                                    title={__('下载')}
                                                    className={classnames(
                                                        styles['action-icon'],
                                                        { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                    )}
                                                    onClick={() => onRequestDownload([doc])}
                                                />
                                                <IconGroup.Item
                                                    code={'\uf032'}
                                                    size={16}
                                                    title={__('转存到我的云盘')}
                                                    className={classnames(
                                                        styles['action-icon'],
                                                        { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                    )}
                                                    onClick={() => onRequrestSaveTo([doc])}
                                                />
                                            </IconGroup>
                                        )
                                    }
                                </div>
                            </div>
                        </DataList.Item>
                    ))
                }
            </DataList>
        )
    }
}