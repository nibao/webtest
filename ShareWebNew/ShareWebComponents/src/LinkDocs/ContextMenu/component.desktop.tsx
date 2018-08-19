import * as React from 'react'
import { last, noop } from 'lodash'
import PopMenu from '../../../ui/PopMenu/ui.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import Divider from '../../../ui/Divider/ui.desktop'
import __ from './locale'
import * as styles from './styles.desktop.css'

const ContextMenu: React.StatelessComponent<Components.LinkDocs.ContextMenu.Props> = ({
    position = [0, 0],
    open = false,
    crumbs = [],
    selections = [],
    downloadEnable = false,
    onRequestClose = noop,
    onRequestRefresh = noop,
    onRequrestSaveTo = noop,
    onRequestDownload = noop
}) => {
    const doc = last(crumbs)

    return (
        <PopMenu
            open={open}
            onClickAway={onRequestClose}
            onClick={onRequestClose}
            anchorOrigin={position}
            targetOrigin={['left', 'top']}
            freezable={false}
        >
            {
                selections.length && doc !== null && downloadEnable ?
                    <PopMenu.Item
                        icon={
                            <UIIcon
                                className={styles['menu-icon']}
                                code={'\uf02a'}
                                size={16}
                            />
                        }
                        label={__('下载')}
                        onClick={() => onRequestDownload(selections)}
                    /> : null
            }
            {
                selections.length && doc !== null && downloadEnable ?
                    <PopMenu.Item
                        icon={
                            <UIIcon
                                className={styles['menu-icon']}
                                code={'\uf032'}
                                size={16}
                            />
                        }
                        label={__('转存到我的云盘')}
                        onClick={() => onRequrestSaveTo(selections)}
                    /> : null
            }
            {
                selections.length === 1 && (
                    <Divider color="#eee" />
                )
            }
            <PopMenu.Item
                icon={
                    <UIIcon
                        className={styles['menu-icon']}
                        code={'\uf04a'}
                        size={14}
                    />}
                label={__('刷新')}
                onClick={() => onRequestRefresh(selections)}
            />
        </PopMenu>)
}

export default ContextMenu