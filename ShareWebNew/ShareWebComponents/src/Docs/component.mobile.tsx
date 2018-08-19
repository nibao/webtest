import * as React from 'react'
import { last, isArray } from 'lodash'
import * as classnames from 'classnames'
import DocsBase from './component.base'
import List from './List/component.mobile'
import Crumbs from './Crumbs/component.mobile'
import EntryDocs from './EntryDocs/component.mobile'
import ToolBar from './ToolBar/component.mobile'
import ActionDrawer from './ActionDrawer/component.mobile'
import Icon from '../../ui/Icon/ui.mobile'
import ProgressCircle from '../../ui/ProgressCircle/ui.mobile'
import InternalShare from '../Share/component.mobile'
import HGDelete from '../HGDelete/component.mobile'
import CopyTo from './CopyTo/component.mobile'
import MoveTo from './MoveTo/component.mobile'
import Image from '../Image/component.mobile'
import Play from '../Play/component.mobile'
import Preview from '../Preview/component.mobile'
import { findType } from '../../core/extension/extension'
import { docname, isDir } from '../../core/docs/docs'
import { download } from '../../core/download/download'
import { rename } from '../../core/rename/rename'
import { createDir, Ondup } from '../../core/createdir/createdir'
import { copy } from '../../core/copy/copy'
import { move } from '../../core/move/move'
import __ from './locale'
import * as fs from '../../core/filesystem/filesystem'
import * as styles from './styles.mobile.css'
import * as loadingImg from './assets/images/loading.gif'
import * as emptyImg from './assets/images/empty.png'
import * as uploadImg from './assets/images/upload.png'

export default class Docs extends DocsBase {

    /**
    * 退出多选模式
    */
    private exitSelectionMode() {
        this.setState({
            selecting: false,
            selections: []
        })
    }

    /** 重命名 */
    rename([doc]: Core.Docs.Docs) {
        rename(doc)

        this.exitSelectionMode()
    }

    /** 
     * 新建文件夹
     */
    private createDir(dest: Core.Docs.Doc) {
        // 自动重命名
        createDir(dest)
    }

    /**
     * 复制到
     */
    private async copyTo(docs: Core.Docs.Docs) {
        this.setState({
            copying: true,
        })

        this.exitSelectionMode()

        await copy(docs)

        this.setState({
            copying: false
        })
    }

    /**
     * 移动到
     */
    private async moveTo(docs: Core.Docs.Docs) {
        this.setState({
            moving: true,
        })

        this.exitSelectionMode()

        await move(docs)

        this.setState({
            moving: false
        })
    }

    /** 
     * 内链共享
     */
    private internalShare([doc]: Core.Docs.Docs) {
        this.exitSelectionMode()

        if (doc) {
            this.apply({ internalShare: { ...doc } })
        } else {
            this.apply({ internalShare: null })
        }
    }

    /** 
     * 删除 
     */
    private delete(docs: Core.Docs.Docs) {
        this.exitSelectionMode()

        this.apply({ delete: docs })
    }

    /** 下载文件 */
    private download(docs: Core.Docs.Docs) {
        this.exitSelectionMode()

        download(docs)
    }

    async back() {
        const doc = this.state.actions['preview']
        const fullPath = await fs.getDocsChain(doc)
        this.handlePathChange(fullPath[fullPath.length - 2])
    }

    preview(doc) {
        switch (findType(docname(doc))) {
            case 'IMG':
                const list = this.state.list.files.filter(doc => findType(docname(doc)) === 'IMG')

                return (
                    <Image
                        doc={doc}
                        list={list}
                        onRequestBack={this.back.bind(this)}
                        onChange={this.handlePathChange.bind(this)}
                    />
                )
            case 'VIDEO':
            case 'AUDIO':
                return <Play onRequestBack={this.back.bind(this)} doc={doc} />
            default:
                return <Preview onRequestBack={this.back.bind(this)} doc={doc} />
        }
    }

    /** 列举文件对象 */
    async load(doc, { useCache = true, reload = true } = {}) {

        let crumbs = await fs.getDocsChain(doc), preview = null
        const currentDoc = last(crumbs)

        if (!(currentDoc === null || isDir(currentDoc))) {
            preview = currentDoc
            crumbs = crumbs.slice(0, -1)
        }

        this.apply({ createDir: false, preview, rename: null })

        // 收回抽屉
        if (!isArray(this.state.drawer) || this.state.drawer.length) {
            this.setState({
                drawer: []
            })
        }

        if (preview) {
            // 预览图片
            if (findType(docname(preview)) && !this.state.list.files.length) {
                const list = await fs.list(last(crumbs), { ...this.state.sortRule, useCache })

                this.setState({
                    list
                })
            }

            return
        }
        this.setState({
            crumbs,
            selections: []
        }, async () => {
            const { crumbs, sortRule } = this.state
            const currentDir = last(crumbs)

            if (reload && !preview) {
                await new Promise(resolve => {
                    this.setState({
                        list: { dirs: [], files: [] },
                        loading: true
                    }, resolve)
                })
            }

            const list = await fs.list(currentDir, { ...sortRule, useCache })

            if (last(this.state.crumbs) === currentDir) {
                this.setState({
                    list,
                    loading: false
                })
            }
            this.checkFavorite([...list.dirs, ...list.files])
        })
    }


    renderContent() {
        const { loading, list, crumbs, actions, viewsinfo, viewsOpen, selections, sortRule, favoriteStatus, layout, selecting, copying } = this.state
        const currentDir = last(crumbs)
        /**
         * 正在加载
         */
        if (loading) {
            return (
                <div style={{ textAlign: 'center', marginTop: 100 }}>
                    <Icon url={loadingImg} size={24} />
                </div>
            )
        }

        /**
         * 空文件夹
         */
        if (list.dirs.length === 0 && list.files.length === 0) {
            if (last(crumbs) === null) {
                return (
                    <div style={{ textAlign: 'center', marginTop: 100 }}>
                        <Icon url={emptyImg} size={64} />
                        <div className={styles['empty-message']}>{__('全部文档为空')}</div>
                    </div>
                )
            }

            return (
                <div style={{ textAlign: 'center', marginTop: 100 }}>
                    <Icon url={uploadImg} size={64} />
                    <div className={styles['empty-message']}>
                        {__('文件夹为空')}
                    </div>
                </div>
            )
        }

        /**
         * 入口文档
         */
        if (currentDir === null) {
            return (
                <EntryDocs
                    list={list}
                    crumbs={crumbs}
                    viewsinfo={viewsinfo}
                    viewsOpen={viewsOpen}
                    layout={layout}
                    selections={selections}
                    sortRule={sortRule}
                    selecting={selecting}
                    actions={actions}
                    favoriteStatus={favoriteStatus}
                    onToggleViewOpen={this.toggleViewOpen.bind(this)}
                    onOpen={this.handlePathChange.bind(this)}
                    onOpenDrawer={this.toggleActionDrawer.bind(this)}
                    onSelectionChange={this.handleSelectionChange.bind(this)}
                    onContextMenu={this.handleContextMenu.bind(this)}
                    onRequestInternalShare={this.internalShare.bind(this)}
                    onRequestExternalShare={this.externalShare.bind(this)}
                    onRequestShareInvitation={this.shareInvitation.bind(this)}
                    onRequestDownload={this.download.bind(this)}
                    onRequestRename={this.rename.bind(this)}
                    onRequestCopyTo={this.copyTo.bind(this)}
                    onRequestMoveTo={this.moveTo.bind(this)}
                    onRequestDelete={this.delete.bind(this)}
                    onRequestToggleFavorite={this.toggleFavorite.bind(this)}
                    onRequestComment={this.comment.bind(this)}
                    onRequestEditTags={this.editTags.bind(this)}
                    onRequestFileFlow={this.fileFlow.bind(this)}
                    onRequestReadSize={this.readSize.bind(this)}
                />
            )
        }

        /**
         * 文件列表
         */
        return (
            <List
                list={list}
                crumbs={crumbs}
                selections={selections}
                selecting={selecting}
                actions={actions}
                favoriteStatus={favoriteStatus}
                onOpen={this.handlePathChange.bind(this)}
                onCreateDirSuccess={this.handleCreateDirSuccess.bind(this)}
                onCreateDirCancel={this.handleCreateDirCancel.bind(this)}
                onSelectionChange={this.handleSelectionChange.bind(this)}
                onContextMenu={this.handleContextMenu.bind(this)}
                onOpenDrawer={this.toggleActionDrawer.bind(this)}
                onRequestInternalShare={this.internalShare.bind(this)}
                onRequestExternalShare={this.externalShare.bind(this)}
                onRequestShareInvitation={this.shareInvitation.bind(this)}
                onRequestDownload={this.download.bind(this)}
                onRequestRename={this.rename.bind(this)}
                onRequestCopyTo={this.copyTo.bind(this)}
                onRequestMoveTo={this.moveTo.bind(this)}
                onRequestDelete={this.delete.bind(this)}
                onRequestToggleFavorite={this.toggleFavorite.bind(this)}
                onRequestComment={this.comment.bind(this)}
                onRequestEditTags={this.editTags.bind(this)}
                onRequestFileFlow={this.fileFlow.bind(this)}
                onRequestReadSize={this.readSize.bind(this)}
            />
        )
    }

    render() {
        const {
            list,
            crumbs,
            selections,
            actions,
            selecting,
            copying,
            moving
        } = this.state
        return (
            <div className={styles['container']}>
                <Crumbs
                    className={styles['crumbs']}
                    list={list}
                    crumbs={crumbs}
                    selecting={selecting}
                    selections={selections}
                    onToggleSelectAll={this.toggleSelectAll.bind(this)}
                    onSelectStart={this.startSelect.bind(this)}
                    onSelectEnd={this.endSelect.bind(this)}
                    onCrumbChange={this.handlePathChange.bind(this)}
                    onRequestCreateDir={this.createDir.bind(this)}
                />
                <div ref="docs" className={styles['docs']}>
                    {this.renderContent()}
                </div>
                {
                    actions['delete'] ?
                        <HGDelete
                            docs={actions['delete']}
                            onSingleDeleteSuccess={this.handleSingleDeleteSuccess.bind(this)}
                            onDeleteSuccess={this.handleDeleteSuccess.bind(this)}
                        /> :
                        null
                }
                {
                    actions['copyTo'] ?
                        <CopyTo
                            docs={actions['copyTo']}
                            onCancel={this.handleCopyToCancel.bind(this)}
                            onComplete={this.handleCopyToComplete.bind(this)}
                        /> :
                        null
                }
                {
                    actions['moveTo'] ?
                        <MoveTo
                            docs={actions['moveTo']}
                            onCancel={this.handleMoveToCancel.bind(this)}
                            onComplete={this.handleMoveToComplete.bind(this)}
                        /> :
                        null
                }
                {
                    actions['preview'] ?
                        <div style={{ position: 'fixed', zIndex: 20 }}>
                            {this.preview(actions['preview'])}
                        </div> :
                        null
                }
                <InternalShare doc={actions['internalShare']} />
                <ActionDrawer
                    docs={this.state.drawer}
                    onRequestClose={this.toggleActionDrawer.bind(this)}
                    onRequestDelete={this.delete.bind(this)}
                    onRequestRename={this.rename.bind(this)}
                    onRequestInternalShare={this.internalShare.bind(this)}
                    onRequestDownload={this.download.bind(this)}
                    onRequestCopy={this.copyTo.bind(this)}
                    onRequestMove={this.moveTo.bind(this)}
                />
                <ToolBar
                    className={classnames(styles['toolbar'], { [styles['actived']]: selecting })}
                    onRequestDelete={this.delete.bind(this)}
                    selections={selections}
                    onRequestMore={this.toggleActionDrawer.bind(this)}
                />
                {
                    copying && (
                        <ProgressCircle
                            detail={__('正在复制，请稍候...')}
                        />
                    )
                }
                {
                    moving && (
                        <ProgressCircle
                            detail={__('正在移动，请稍候...')}
                        />
                    )
                }
            </div>
        )
    }
}