import * as React from 'react';
import * as classnames from 'classnames';
import { isFunction } from 'lodash';
import { docname } from '../../../core/docs/docs';
import { isUserId } from '../../../core/user/user';
import { formatTime } from '../../../util/formatters/formatters'
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import Thumbnail from '../../Thumbnail/component.desktop';
import __ from './locale'
import * as styles from './styles.desktop.css';

export default function Header({ doc, className, favorited, ...otherProps }) {
    return (
        <div className={classnames(styles['container'], className)}>
            <div className={styles['thumbnail-container']}>
                <Thumbnail
                    doc={doc}
                    size={32}
                    className={styles['thumbnail']}
                    nostatistic={doc && doc.link ? true : undefined}
                />
            </div>
            <div className={styles['docname']}>
                <Text className={styles['doctext']}>
                    {`${docname(doc)}${doc && isFunction(otherProps.doRevisionRestore) ? `（${doc.modified ? formatTime(doc.modified / 1000) : '---'} ${isUserId(doc.editor) ? __('未知用户') : doc.editor}）` : ''}`}
                </Text>
            </div>
            <div className={styles['right']}>
                <div className={styles['operations']}>
                    {
                        isFunction(otherProps.doCollect) && !(doc && doc.link) ? (
                            <UIIcon
                                code={favorited ? '\uf095' : '\uf094'}
                                className={classnames({ [styles['favorited']]: favorited }, styles['oper-icon'])}
                                onClick={() => otherProps.doCollect(doc)}
                                titleClassName={styles['title']}
                                title={favorited ? __('取消收藏') : __('收藏')}
                            />
                        ) : null
                    }
                    {
                        isFunction(otherProps.doInnerShareLink) && !(doc && doc.link) ? (
                            <UIIcon
                                code="\uf025"
                                className={styles['oper-icon']}
                                onClick={() => otherProps.doInnerShareLink([doc])}
                                title={__('内链共享')}
                                titleClassName={styles['title']}
                            />
                        ) : null
                    }
                    {
                        isFunction(otherProps.doOuterShareLink) && !(doc && doc.link) ? (
                            <UIIcon
                                code="\uf026"
                                className={styles['oper-icon']}
                                onClick={() => otherProps.doOuterShareLink([doc])}
                                title={__('外链共享')}
                                titleClassName={styles['title']}
                            />
                        ) : null
                    }
                    {
                        isFunction(otherProps.doDownload) ? (
                            <UIIcon
                                code="\uf02a"
                                className={styles['oper-icon']}
                                onClick={() => otherProps.doDownload(doc)}
                                title={__('下载')}
                                titleClassName={styles['title']}
                            />
                        ) : null
                    }
                    {
                        isFunction(otherProps.doSaveTo) && otherProps.saveToEnable ? (
                            <UIIcon
                                code="\uf032"
                                className={styles['oper-icon']}
                                onClick={() => otherProps.doSaveTo(doc)}
                                title={__('转存到我的云盘')}
                                titleClassName={styles['title']}
                            />
                        ) : null
                    }
                    {
                        isFunction(otherProps.doRevisionRestore) ? (
                            <UIIcon
                                code="\uf05a"
                                className={styles['oper-icon']}
                                onClick={() => otherProps.doRevisionRestore(doc)}
                                title={__('还原')}
                                titleClassName={styles['title']}
                            />
                        )
                            : null
                    }
                </div>
            </div>
        </div>
    )
}