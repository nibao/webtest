import * as React from 'react'
import { includes, noop, last } from 'lodash'
import * as classnames from 'classnames'
import ListBase from './component.base'
import { docname, isDir } from '../../../core/docs/docs'
import { isUserId } from '../../../core/user/user';
import * as fs from '../../../core/filesystem/filesystem'
import DataList from '../../../ui/DataList/ui.desktop'
import Title from '../../../ui/Title/ui.desktop'
import Thumbnail from '../../Thumbnail/component.desktop'
import PopMenu from '../../../ui/PopMenu/ui.desktop'
import IconGroup from '../../../ui/IconGroup/ui.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import Divider from '../../../ui/Divider/ui.desktop'
import CreateDir from '../CreateDir/component.desktop'
import Rename from '../Rename/component.desktop'
import { formatTimeRelative, formatSize } from '../../../util/formatters/formatters'
import __ from './locale'
import * as styles from './styles.desktop.css'

export default class List extends ListBase {
    render() {
        const {
            crumbs,
            list,
            selections,
            actions,
            favoriteStatus,
            onSelectionChange,
            onContextMenu,
            onCreateDirSuccess,
            onCreateDirCancel,
            onRequestToggleFavorite,
            onRequestComment,
            onRequestEditTags,
            onRequestInternalShare,
            onRequestExternalShare,
            onRequestDownload,
            onRequestReadSize,
            onRequestRename,
            onRequestCopyTo,
            onRequestMoveTo,
            onRequestDelete,
            onRequestShareInvitation,
            onRequestFileFlow
        } = this.props
        const currentDir = last(crumbs)
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
                    actions['createDir'] ?
                        <DataList.Item
                            className={styles['item']}
                            data={null}
                            selectable={false}
                            onDoubleClick={noop}
                            onClick={noop}
                            onContextMenu={noop}
                            onToggleSelect={noop}
                        >
                            <div className={styles['wrapper']}>
                                <div className={styles['thumbnail-container']}>
                                    <Thumbnail
                                        type="DIR"
                                        className={styles['thumbnail']}
                                        size={32}
                                    />
                                </div>
                                <div className={styles['edit']}>
                                    <CreateDir
                                        doc={currentDir}
                                        onSuccess={onCreateDirSuccess}
                                        onCancel={onCreateDirCancel}
                                    />
                                </div>
                            </div>
                        </DataList.Item> :
                        null
                }
                {
                    docs.map(doc => (
                        <DataList.Item
                            key={doc.docid}
                            className={classnames(
                                styles['item'],
                                { [styles['selected']]: includes(selections, doc) }
                            )}
                            data={doc}
                            selectable={true}
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
                                {
                                    actions['rename'] && actions['rename'].doc === doc ?
                                        <Rename
                                            doc={doc}
                                            onConfirm={actions['rename'].confirm}
                                            onCancel={actions['rename'].cancel}
                                        /> :
                                        [
                                            <div className={styles['line']}>
                                                <Title content={docname(doc)} inline>
                                                    <a
                                                        draggable={false}
                                                        href="javascript:void(0);"
                                                        className={styles['name']}
                                                        onClick={e => this.handleOpen(e, doc)}
                                                    >
                                                        {docname(doc)}
                                                    </a>
                                                </Title>
                                            </div>,
                                            <div className={styles['line']}>
                                                <div className={styles['metas']}>
                                                    <span className={styles['meta']}>
                                                        {
                                                            doc.create_time === doc.modified ?
                                                                `${(!doc.creator || isUserId(doc.creator)) ? __('未知用户') : doc.creator} ${__('创建于')} ${formatTimeRelative(doc.create_time / 1000)}`
                                                                :
                                                                `${(!doc.editor || isUserId(doc.editor)) ? __('未知用户') : doc.editor} ${__('修改于')} ${formatTimeRelative(doc.modified / 1000)}`
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
                                                <IconGroup
                                                    onDoubleClick={e => { e.preventDefault() }}
                                                    onClick={e => this.handleIconClick(e, doc)}
                                                >
                                                    <IconGroup.Item
                                                        code={favoriteStatus[doc.docid] ? '\uf095' : '\uf094'}
                                                        size={16}
                                                        title={__(favoriteStatus[doc.docid] ? '取消收藏' : '收藏')}
                                                        color={favoriteStatus[doc.docid] ? '#f6cf57' : '#757575'}
                                                        className={classnames(
                                                            styles['action-icon'],
                                                            { [styles['actived']]: selections.length === 1 && selections[0] === doc || favoriteStatus[doc.docid] }
                                                        )}
                                                        onClick={() => onRequestToggleFavorite([doc])}
                                                    />
                                                    {
                                                        // !isDir(doc) ?
                                                        //     <IconGroup.Item
                                                        //         code={'\uf087'}
                                                        //         size={16}
                                                        //         title={__('评论')}
                                                        //         className={classnames(
                                                        //             styles['action-icon'],
                                                        //             { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                        //         )}
                                                        //         onClick={() => onRequestComment([doc])}
                                                        //     /> : null
                                                    }
                                                    {
                                                        !isDir(doc) ?
                                                            <IconGroup.Item
                                                                code={'\uf049'}
                                                                size={16}
                                                                title={__('标签')}
                                                                className={classnames(
                                                                    styles['action-icon'],
                                                                    { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                                )}
                                                                onClick={() => onRequestEditTags([doc])}
                                                            /> : null
                                                    }
                                                    <IconGroup.Item
                                                        code={'\uf025'}
                                                        size={16}
                                                        title={__('内链共享')}
                                                        className={classnames(
                                                            styles['action-icon'],
                                                            { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                        )}
                                                        onClick={() => onRequestInternalShare([doc])}
                                                    />
                                                    <IconGroup.Item
                                                        code={'\uf026'}
                                                        size={16}
                                                        title={__('外链共享')}
                                                        className={classnames(
                                                            styles['action-icon'],
                                                            { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                        )}
                                                        onClick={() => onRequestExternalShare([doc])}
                                                    />
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
                                                    {
                                                        fs.isEntryDoc(doc) ?
                                                            <IconGroup.Item
                                                                code={'\uf084'}
                                                                size={16}
                                                                title={__('复制到')}
                                                                className={classnames(
                                                                    styles['action-icon'],
                                                                    { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                                )}
                                                                onClick={() => onRequestCopyTo([doc])}
                                                            /> : null
                                                    }
                                                    {
                                                        fs.isEntryDoc(doc) ?
                                                            <IconGroup.Item
                                                                code={'\uf053'}
                                                                size={16}
                                                                title={__('查看大小')}
                                                                className={classnames(
                                                                    styles['action-icon'],
                                                                    { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                                )}
                                                                onClick={() => onRequestReadSize([doc])}
                                                            /> :
                                                            <PopMenu
                                                                open={this.state.showQuickMenu === doc}
                                                                anchorOrigin={['right', 'top']}
                                                                targetOrigin={['left', 'top']}
                                                                freezable={true}
                                                                trigger={
                                                                    <IconGroup.Item
                                                                        code={'\uf02b'}
                                                                        size={16}
                                                                        title={__('更多')}
                                                                        className={classnames(
                                                                            styles['action-icon'],
                                                                            { [styles['actived']]: selections.length === 1 && selections[0] === doc }
                                                                        )}
                                                                    />}
                                                                triggerEvent={'click'}
                                                                onOpen={() => this.showQuickMenu(doc)}
                                                                onClose={this.hideQuickMenu.bind(this)}
                                                                onRequestCloseWhenBlur={close => close()}
                                                                onRequestCloseWhenClick={close => close()}
                                                            >
                                                                <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf085'} size={16} />}
                                                                    label={__('重命名')}
                                                                    onClick={() => onRequestRename([doc])}
                                                                />
                                                                <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf084'} size={16} />}
                                                                    label={__('复制到')}
                                                                    onClick={() => onRequestCopyTo([doc])}
                                                                />
                                                                <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf083'} size={16} />}
                                                                    label={__('移动到')}
                                                                    onClick={() => onRequestMoveTo([doc])}
                                                                />
                                                                <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf000'} size={16} />}
                                                                    label={__('删除')}
                                                                    onClick={() => onRequestDelete([doc])}
                                                                />
                                                                <Divider color="#eee" />
                                                                {/* <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf088'} size={16} />}
                                                                    label={__('共享邀请')}
                                                                    onClick={() => onRequestShareInvitation([doc])}
                                                                /> */}
                                                                {/* <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf029'} size={16} />}
                                                                    label={__('文档流转')}
                                                                    onClick={() => onRequestFileFlow([doc])}
                                                                /> */}
                                                                <Divider color="#eee" />
                                                                <PopMenu.Item
                                                                    icon={<UIIcon className={styles['menu-icon']} code={'\uf053'} size={16} />}
                                                                    label={__('查看大小')}
                                                                    onClick={() => onRequestReadSize([doc])}
                                                                />
                                                            </PopMenu>
                                                    }
                                                </IconGroup>
                                            </div>
                                        ]
                                }
                            </div>
                        </DataList.Item>
                    ))
                }
            </DataList>
        )
    }
}