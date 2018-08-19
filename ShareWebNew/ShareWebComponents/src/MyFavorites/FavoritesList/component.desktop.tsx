import * as React from 'react'
import { noop } from 'lodash'
import * as classnames from 'classnames'
import { Text, IconGroup, DataList, EmptyResult } from '../../../ui/ui.desktop'
import { formatSize, formatTimeRelative } from '../../../util/formatters/formatters'
import { isDir, docname } from '../../../core/docs/docs'
import { isUserId } from '../../../core/user/user'
import Thumbnail from '../../Thumbnail/component.desktop'
import * as NoFavorites from '../assets/NoFavorites.png'
import * as NoSearch from '../assets/NoSearch.png'
import * as styles from './styles.desktop.css'
import __ from './locale'

const FavoritesList: React.StatelessComponent<Components.MyFavorites.FavoritesList.Props> = ({
    searchKey,
    docs,
    doFilePreview = noop,
    doDirOpen = noop,
    onFavoriteCancel = noop,
    doShare = noop,
    doLinkShare = noop,
    doDownload,
    selections = [],
    doSelectionChange = noop,
    doContextMenu = noop,
}) => (
        docs && docs.length !== 0 ?
            (
                <DataList
                    className={styles['favorites-list']}
                    selections={selections}
                    onSelectionChange={doSelectionChange}
                    onDoubleClick={doFilePreview}
                    onContextMenu={doContextMenu}
                >
                    {
                        docs.map(doc => (
                            <DataList.Item
                                className={styles['item']}
                                data={doc}
                                checkbox={false}
                            >
                                <div
                                    className={styles['picture-field']}
                                >
                                    <Thumbnail
                                        doc={doc}
                                        size={32}
                                        className={styles['picture']}
                                        onClick={(e) => { doFilePreview(e, doc) }}
                                    />
                                </div>

                                <div
                                    className={styles['name-field']}
                                >
                                    <div
                                        className={styles['name']}
                                        onClick={(e) => { doFilePreview(e, doc) }}
                                    >
                                        <Text
                                            ellipsizeMode={'middle'}
                                            numberOfChars={150}
                                        >
                                            {docname(doc)}
                                        </Text>
                                    </div>
                                </div>
                                <div
                                    className={styles['detail-and-operate']}
                                >
                                    <Text
                                        className={styles['detail']}
                                    >
                                        {
                                            doc.modified === doc.create_time ?
                                                (
                                                    `${isUserId(doc.creator) ? __('未知用户') : doc.creator} ${__('创建于')} ${formatTimeRelative(doc.create_time / 1000)}`
                                                )
                                                :
                                                (
                                                    `${isUserId(doc.editor) ? __('未知用户') : doc.editor} ${__('修改于')} ${formatTimeRelative(doc.modified / 1000)}`
                                                )
                                        }
                                    </Text>

                                    {
                                        isDir(doc)
                                            ?
                                            null
                                            :
                                            (
                                                <Text
                                                    className={styles['size']}
                                                >
                                                    {formatSize(doc.size)}
                                                </Text>
                                            )
                                    }

                                    <IconGroup
                                        className={classnames(styles['operate'], { [styles['actived']]: selections.length === 1 && selections[0] === doc })}
                                    >
                                        <IconGroup.Item
                                            className={styles['icon-item']}
                                            code={'\uf030'}
                                            size={16}
                                            title={__('取消收藏')}
                                            onClick={onFavoriteCancel.bind(this, doc)}
                                        />
                                        <IconGroup.Item
                                            className={styles['icon-item']}
                                            code={'\uf025'}
                                            size={16}
                                            title={__('内链共享')}
                                            onClick={doShare.bind(this, doc)}
                                        />
                                        <IconGroup.Item
                                            className={styles['icon-item']}
                                            code={'\uf026'}
                                            size={16}
                                            title={__('外链共享')}
                                            onClick={doLinkShare.bind(this, doc)}
                                        />
                                        {
                                            typeof doDownload === 'function'
                                                ?
                                                <IconGroup.Item
                                                    className={styles['icon-item']}
                                                    code={'\uf02a'}
                                                    size={16}
                                                    title={__('下载')}
                                                    onClick={doDownload.bind(this, doc)}
                                                />
                                                : null
                                        }
                                        <IconGroup.Item
                                            className={styles['icon-item']}
                                            code={'\uf074'}
                                            size={16}
                                            title={__('打开所在位置')}
                                            onClick={() => { doDirOpen(doc) }}
                                        />
                                    </IconGroup>
                                </div>
                            </DataList.Item>
                        ))
                    }
                </DataList >
            )
            :
            (
                searchKey === ''
                    ?
                    (
                        <EmptyResult
                            picture={NoFavorites}
                            details={__('暂无收藏')}
                        />
                    )
                    :
                    (
                        <EmptyResult
                            picture={NoSearch}
                            details={__('抱歉，没有找到符合条件的结果')}
                        />
                    )
            )
    )

export default FavoritesList

