import * as React from 'react'
import { last } from 'lodash'
import { isDir } from '../../../core/docs/docs'
import * as fs from '../../../core/filesystem/filesystem'
import PopMenu from '../../../ui/PopMenu/ui.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import Divider from '../../../ui/Divider/ui.desktop'
import __ from './locale'
import * as styles from './styles.desktop.css'

const ContextMenu = ({
    position,
    open,
    crumbs,
    selections,
    favoriteStatus,
    onRequestClose,
    onRequestInternalShare,
    onRequestExternalShare,
    onRequestShareInvitation,
    onRequestDownload,
    onRequestRename,
    onRequestCopyTo,
    onRequestMoveTo,
    onRequestDelete,
    onRequestToggleFavorite,
    onRequestComment,
    onRequestEditTags,
    onRequestFileFlow,
    onRequestReadSize,
    onRequestCreateDir,
    onRequestRefresh
}) => {
    const doc = last(crumbs)
    return (<PopMenu
        open={open}
        onClickAway={onRequestClose}
        onClick={onRequestClose}
        anchorOrigin={position}
        targetOrigin={['left', 'top']}
        freezable={true}
    >
        {
            selections.length === 1 ?
                [
                    <PopMenu.Item
                        icon={
                            <UIIcon className={styles['menu-icon']}
                                code={favoriteStatus[selections[0].docid] ? '\uf095' : '\uf094'}
                                color={favoriteStatus[selections[0].docid] ? '#f6cf57' : '#757575'}
                                size={16}
                            />
                        }
                        label={favoriteStatus[selections[0].docid] ? __('取消收藏') : __('收藏')}
                        onClick={() => onRequestToggleFavorite(selections)}
                    />,
                    <Divider color="#eee" />
                ] : null
        }
        {
            selections.length === 1 ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf025'} size={16} />}
                    label={__('内链共享')}
                    onClick={() => onRequestInternalShare(selections)}
                /> : null
        }
        {
            selections.length === 1 ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf026'} size={16} />}
                    label={__('外链共享')}
                    onClick={() => onRequestExternalShare(selections)}
                /> : null
        }
        {
            // selections.length === 1 ?
            //     <PopMenu.Item
            //         icon={<UIIcon className={styles['menu-icon']} code={'\uf088'} size={16} />}
            //         label={__('共享邀请')}
            //         onClick={() => onRequestShareInvitation(selections)}
            //     /> : null
        }
        {
            selections.length ? <Divider color="#eee" /> : null
        }
        {
            selections.length ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf02a'} size={16} />}
                    label={__('下载')}
                    onClick={() => onRequestDownload(selections)}
                /> : null
        }
        {
            selections.length === 1 && doc !== null ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf085'} size={16} />}
                    label={__('重命名')}
                    onClick={() => onRequestRename(selections)}
                /> : null
        }
        {
            selections.length ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf084'} size={16} />}
                    label={__('复制到')}
                    onClick={() => onRequestCopyTo(selections)}
                /> : null
        }
        {
            selections.length && doc !== null ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf083'} size={16} />}
                    label={__('移动到')}
                    onClick={() => onRequestMoveTo(selections)}
                /> : null
        }
        {
            selections.length && doc !== null ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf000'} size={16} />}
                    label={__('删除')}
                    onClick={() => onRequestDelete(selections)}
                /> : null
        }
        {
            selections.length === 1 ? <Divider color="#eee" /> : null
        }
        {
            // selections.length === 1 && !isDir(selections[0]) ?
            //     <PopMenu.Item
            //         icon={<UIIcon className={styles['menu-icon']} code={'\uf087'} size={16} />}
            //         label={__('评论')}
            //         onClick={() => onRequestComment(selections)}
            //     /> : null
        }
        {
            selections.length && selections.every(doc => !isDir(doc)) ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf049'} size={16} />}
                    label={__('标签')}
                    onClick={() => onRequestEditTags(selections)}
                /> : null
        }
        {
            // selections.length === 1 && !isDir(selections[0]) ?
            //     <PopMenu.Item
            //         icon={<UIIcon className={styles['menu-icon']} code={'\uf029'} size={16} />}
            //         label={__('文档流转')}
            //         onClick={() => onRequestFileFlow(selections)}
            //     /> : null
        }
        <Divider color="#eee" />
        {
            selections.length ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf053'} size={16} />}
                    label={__('查看大小')}
                    onClick={() => onRequestReadSize(selections)}
                /> : null
        }
        <Divider color="#eee" />
        {
            selections.length === 0 && doc !== null ?
                <PopMenu.Item
                    icon={<UIIcon className={styles['menu-icon']} code={'\uf089'} size={16} />}
                    label={__('新建文件夹')}
                    onClick={() => onRequestCreateDir(selections)}
                /> : null
        }
        <PopMenu.Item
            icon={<UIIcon className={styles['menu-icon']} code={'\uf04a'} size={14} />}
            label={__('刷新')}
            onClick={() => onRequestRefresh(selections)}
        />
    </PopMenu>)
}

export default ContextMenu