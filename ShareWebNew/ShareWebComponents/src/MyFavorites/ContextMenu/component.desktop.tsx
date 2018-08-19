import * as React from 'react'
import { last } from 'lodash'
import { PopMenu, UIIcon } from '../../../ui/ui.desktop'
import * as styles from './styles.desktop.css'
import __ from './locale'

const ContextMenu = ({
    position,
    open,
    selections,
    onRequestClose,
    onFavoriteCancel,
    doShare,
    doLinkShare,
    doDownload,
    doDirOpen,
}) => {
    const doc = last(selections)
    return (
        <PopMenu
            open={open}
            onClickAway={onRequestClose}
            onClick={onRequestClose}
            anchorOrigin={position}
            targetOrigin={['left', 'top']}
            freezable={false}
        >
            <PopMenu.Item
                label={__('取消收藏')}
                icon={
                    <UIIcon
                        code={'\uf030'}
                        size={16}
                        className={styles['menu-icon']}
                    />
                }
                onClick={onFavoriteCancel.bind(this, doc)}
            />
            <PopMenu.Item
                label={__('内链共享')}
                icon={
                    <UIIcon
                        code={'\uf025'}
                        size={16}
                        className={styles['menu-icon']}
                    />
                }
                onClick={doShare.bind(this, doc)}
            />
            <PopMenu.Item
                label={__('外链共享')}
                icon={
                    <UIIcon
                        code={'\uf026'}
                        size={16}
                        className={styles['menu-icon']}
                    />
                }
                onClick={doLinkShare.bind(this, doc)}
            />
            {
                typeof doDownload === 'function'
                    ?
                    <PopMenu.Item
                        label={__('下载')}
                        icon={
                            <UIIcon
                                code={'\uf02a'}
                                size={16}
                                className={styles['menu-icon']}
                            />
                        }
                        onClick={doDownload.bind(this, doc)}
                    /> : null
            }
            <PopMenu.Item
                label={__('打开所在位置')}
                icon={
                    <UIIcon
                        code={'\uf074'}
                        size={16}
                        className={styles['menu-icon']}
                    />
                }
                onClick={() => { doDirOpen(doc) }}
            />
        </PopMenu>
    )
}

export default ContextMenu