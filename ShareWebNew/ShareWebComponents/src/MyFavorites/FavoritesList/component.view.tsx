import * as React from 'react'
import { noop } from 'lodash'
import * as classnames from 'classnames'
import { DataList, Text, IconGroup } from '../../../ui/ui.desktop'
import { formatSize, formatTimeRelative } from '../../../util/formatters/formatters'
import { isDir, docname } from '../../../core/docs/docs'
import { isUserId } from '../../../core/user/user'
import Thumbnail from '../../Thumbnail/component.desktop'
import * as styles from './styles.client.css'
import __ from './locale'

const FavoritesList: React.StatelessComponent<Components.MyFavorites.FavoritesList.Props> = ({
    docs,
    doFilePreview = noop,
    doDirOpen = noop,
    onFavoriteCancel = noop,
    doShare = noop,
    doLinkShare = noop,
    selections = [],
    doSelectionChange = noop,
}) => (
        <DataList
            className={styles['favorites-list']}
            selections={selections}
            onSelectionChange={doSelectionChange}
            onDoubleClick={doFilePreview}
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
                                onClick={(e) => doFilePreview(e, doc)}
                            />
                        </div>

                        <div
                            className={styles['name-field']}
                        >
                            <div
                                className={styles['name']}
                                onClick={(e) => doFilePreview(e, doc)}
                            >
                                <Text
                                    ellipsizeMode={'middle'}
                                    numberOfChars={130}
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

                            <div
                                className={classnames(styles['operate'], { [styles['actived']]: selections.length === 1 && selections[0] === doc })}
                            >
                                <IconGroup>
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
                                    <IconGroup.Item
                                        className={styles['icon-item']}
                                        code={'\uf074'}
                                        size={16}
                                        title={__('打开所在位置')}
                                        onClick={doDirOpen.bind(this, doc)}
                                    />
                                </IconGroup>
                            </div>
                        </div>
                    </DataList.Item>
                ))
            }
        </DataList >
    )

export default FavoritesList

