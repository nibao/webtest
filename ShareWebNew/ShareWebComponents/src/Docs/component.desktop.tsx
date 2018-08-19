import * as React from 'react'
import { last } from 'lodash'
import DocsBase from './component.base'
import Centered from '../../ui/Centered/ui.desktop'
import MessageDialog from '../../ui/MessageDialog/ui.desktop'
import List from './List/component.desktop'
import ToolBar from './ToolBar/component.desktop'
import Crumbs from './Crumbs/component.desktop'
import Detail from './Detail/component.desktop'
import EntryDocs from './EntryDocs/component.desktop'
import ContextMenu from './ContextMenu/component.desktop'
import Icon from '../../ui/Icon/ui.desktop'
import session from '../../util/session/session'
import GroupManage from '../GroupManage/component.desktop'
import InternalShare from '../Share/component.desktop'
import ExternalShare from '../LinkShare/component.desktop'
import ShareInvitation from '../ShareInvitation/component.desktop'
import ExceptionMessage from '../ExceptionMessage/component.desktop'
import Copy from '../Copy/component.desktop'
import Move from '../Move/component.desktop'
import Delete from '../Delete/component.desktop'
import ReadSize from '../ViewSize/component.desktop'
import TagAdder from '../TagAdder/component.desktop'
import TagEditor from '../TagEditor/component.desktop'
import Preview from '../Preview2/component.desktop'
import Upload from '../Upload/component.desktop'
import SaveTo from '../SaveTo/component.desktop'
import RestoreRevisions from '../RestoreRevision/component.desktop'
import { Type } from '../SaveTo/component.base'
import { formatterErrorMessage } from './helper'
import __ from './locale'
import * as styles from './styles.desktop.css'
import * as loadingImg from './assets/images/loading.gif'
import * as emptyImg from './assets/images/empty.png'
import * as uploadImg from './assets/images/upload.png'

export default class Docs extends DocsBase {

    renderContent() {
        const { loading, list, crumbs, actions, viewsinfo, viewsOpen, selections, sortRule, favoriteStatus, layout } = this.state
        const currentDir = last(crumbs)
        /**
         * 正在加载
         */
        if (loading) {
            return (
                <Centered>
                    <Icon url={loadingImg} size={24} />
                </Centered>
            )
        }

        /**
         * 空文件夹
         */
        if (list.dirs.length === 0 && list.files.length === 0 && !actions['createDir']) {
            if (currentDir === null) {
                return (
                    <Centered>
                        <Icon url={emptyImg} size={64} />
                        <div className={styles['empty-message']}>{__('全部文档为空')}</div>
                    </Centered>
                )
            }

            return (
                <Centered>
                    <Icon url={uploadImg} size={64} />
                    <div className={styles['empty-message']}>
                        {__('将文档拖拽到此处，或点击')}
                        <Upload.Picker dest={currentDir} className={styles['upload']}>{__('上传')}</Upload.Picker>
                        {__('按钮进行上传')}
                    </div>
                </Centered>
            )
        }

        /**
         * 入口文档
         */
        if (currentDir === null) {
            return (
                <EntryDocs
                    crumbs={crumbs}
                    list={list}
                    viewsinfo={viewsinfo}
                    viewsOpen={viewsOpen}
                    layout={layout}
                    selections={selections}
                    sortRule={sortRule}
                    actions={actions}
                    favoriteStatus={favoriteStatus}
                    onToggleViewOpen={this.toggleViewOpen.bind(this)}
                    onOpen={this.handlePathChange.bind(this)}
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
                crumbs={crumbs}
                list={list}
                selections={selections}
                actions={actions}
                favoriteStatus={favoriteStatus}
                onOpen={this.handlePathChange.bind(this)}
                onCreateDirSuccess={this.handleCreateDirSuccess.bind(this)}
                onCreateDirCancel={this.handleCreateDirCancel.bind(this)}
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

    render() {
        const {
            list,
            crumbs,
            selections,
            sortRule,
            showContextMenu,
            contextMenuPosition,
            actions,
            favoriteStatus,
            dragUploadDest,
            savingTo,
            addToFavoriteErrorCode,
            favoriteDoc,
            errors,
            confirmError
        } = this.state
        // 是否是最新版本
        const latest = actions['preview'] ? this.revision.rev === actions['preview'].rev : true

        return (
            <div className={styles['container']}>
                <div className={styles['address']}>
                    <div className={styles['wrapper']}>
                        <Crumbs
                            crumbs={crumbs}
                            onCrumbChange={this.handlePathChange.bind(this)}
                            onRequestGlobalSearch={this.handleGlobalSearch.bind(this)}
                        />
                    </div>
                </div>
                <div className={styles['docs-container']}>
                    <div
                        className={styles['main']}
                        onContextMenu={this.handleMainContextMenu.bind(this)}
                        onDragEnter={() => this.setDragUploadDest(last(crumbs))}
                    >
                        <ToolBar
                            crumbs={crumbs}
                            list={list}
                            sortRule={sortRule}
                            selections={selections}
                            onToggleSelectAll={this.toggleSelectAll.bind(this)}
                            onToggleSortRule={this.toggleSortRule.bind(this)}
                            onRequestManageGroup={this.manageGroup.bind(this)}
                            onRequestCreateDir={this.createDir.bind(this)}
                            onRequestDownload={this.download.bind(this)}
                            onRequestCopyTo={this.copyTo.bind(this)}
                            onRequestMoveTo={this.moveTo.bind(this)}
                            onRequestDelete={this.delete.bind(this)}
                            onRequestEditTags={this.editTags.bind(this)}
                            onRequestReadSize={this.readSize.bind(this)}
                        />
                        <div
                            ref="docs"
                            className={styles['docs']}
                        >
                            {
                                this.renderContent()
                            }
                        </div>
                        {
                            dragUploadDest && dragUploadDest === last(crumbs) ?
                                <Upload.DragArea
                                    dest={dragUploadDest}
                                    className={styles['dragarea']}
                                    onDragLeave={() => this.setDragUploadDest(null)}
                                    onDrop={() => this.setDragUploadDest(null)}
                                /> :
                                null
                        }
                    </div>
                    <div className={styles['detail']}>
                        <Detail
                            docs={selections}
                            parent={crumbs && crumbs.length ? last(crumbs) : null}
                            onTagClick={this.handleGlobalSearchForTag.bind(this)}
                            doRevisionView={(doc, revision) => this.handlePathChange({ ...doc, ...revision }, { newTab: true, latest: doc.rev === revision.rev })}
                            doRevisionDownload={this.revisionDownload.bind(this)}
                            doRevisionRestore={this.restoreRevision.bind(this)}
                            doApprovalCheck={this.props.doApprovalCheck}
                        />
                    </div>
                    {
                        actions['createDir'] || actions['rename'] ?
                            <div className={styles['mask']}></div> : null
                    }
                </div>
                <ContextMenu
                    position={contextMenuPosition}
                    crumbs={crumbs}
                    selections={selections}
                    open={showContextMenu}
                    favoriteStatus={favoriteStatus}
                    onRequestClose={this.closeContextMenu.bind(this)}
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
                    onRequestCreateDir={this.createDir.bind(this)}
                    onRequestRefresh={this.refresh.bind(this)}
                />
                {
                    errors.length ?
                        <MessageDialog onConfirm={confirmError}>
                            {__('文件或文件夹不存在，可能其所在路径发生变更')}
                        </MessageDialog> :
                        null
                }
                {
                    actions['editTags'] && actions['editTags'].length === 1 ?
                        <TagEditor doc={actions['editTags'][0]} onCloseDialog={this.handleEditTagComplete.bind(this)} /> : null
                }
                {
                    actions['editTags'] && actions['editTags'].length > 1 ?
                        <TagAdder docs={actions['editTags']} onCloseDialog={this.handleEditTagComplete.bind(this)} /> : null
                }
                {
                    actions['manageGroup'] ?
                        <GroupManage onClose={this.handleManageGroupClose.bind(this)} /> : null
                }
                {
                    actions['internalShare'] ?
                        <InternalShare
                            swf={this.props.swf}
                            doc={actions['internalShare']}
                            prefix={'AnyShare://'}
                            doApvJump={this.props.doApprovalCheck}
                            onCloseDialog={() => this.apply({ internalShare: null })}
                        /> : null
                }
                {
                    actions['externalShare'] ?
                        <ExternalShare
                            swf={this.props.swf}
                            doc={actions['externalShare']}
                            doApprovalCheck={this.props.doApprovalCheck}
                            doConfigurationClose={() => this.apply({ externalShare: null })}
                            onErrorConfirm={() => this.apply({ externalShare: null })}
                        /> : null
                }
                {
                    actions['shareInvitation'] ?
                        <ShareInvitation
                            doc={actions['shareInvitation']}
                            onClose={() => this.apply({ shareInvitation: null })}
                        /> : null
                }
                {
                    actions['copyTo'] ?
                        <Copy
                            docs={actions['copyTo']}
                            sort={sortRule}
                            onCancel={() => this.apply({ copyTo: null })}
                            onSuccess={() => this.apply({ copyTo: null })}
                        /> : null
                }
                {
                    actions['moveTo'] ?
                        <Move
                            docs={actions['moveTo']}
                            sort={sortRule}
                            onCancel={() => this.apply({ moveTo: null })}
                            onSuccess={() => this.apply({ moveTo: null })}
                        /> : null
                }
                {
                    actions['delete'] ?
                        <Delete
                            docs={actions['delete']}
                            onCancel={() => this.apply({ delete: null })}
                            onSuccess={() => this.apply({ delete: null })}
                        /> : null
                }
                {
                    actions['readSize'] ?
                        <ReadSize
                            docs={actions['readSize']}
                            onStaticsConfirm={() => this.apply({ readSize: null })}
                            onStaticsCancel={() => this.apply({ readSize: null })}
                        /> : null
                }
                {
                    actions['preview'] ?
                        <div className={styles['preview']}>
                            <Preview
                                doc={{ ...actions['preview'], ...this.revision }}
                                enableCollect={latest}
                                canEdit={latest}
                                onCheckLogin={() => !!session.get('login')}
                                onPathChange={this.handlePathChange.bind(this)}
                                doSaveTo={latest ? this.handleSaveTo.bind(this) : undefined}
                                doInnerShareLink={latest ? this.internalShare.bind(this) : undefined}
                                doOuterShareLink={latest ? this.externalShare.bind(this) : undefined}
                                doDownload={latest ? this.download.bind(this) : () => this.revisionDownload(actions['preview'], this.revision)}
                                doRevisionRestore={!latest ? () => this.restoreRevision(actions['preview'], this.revision) : undefined}
                            />
                        </div> :
                        null
                }
                {
                    savingTo ? (
                        <SaveTo
                            docs={[actions['preview']]}
                            type={Type.SHARE}
                            onSaveComplete={this.saveToComplete.bind(this)}
                            onRedirect={(docid) => { this.handlePathChange({ docid: docid }) }}
                        />
                    ) : null
                }
                {
                    addToFavoriteErrorCode && favoriteDoc ? (
                        <ExceptionMessage
                            detail={formatterErrorMessage(addToFavoriteErrorCode, favoriteDoc)}
                            onMessageConfirm={() => this.handleFavoriteError()}
                        />
                    ) : null
                }
                {
                    actions['restoreRevision'] && (
                        <RestoreRevisions
                            doc={actions['restoreRevision'].doc}
                            revision={actions['restoreRevision'].revision}
                            onRevisionRestoreSuccess={this.restoreSuccess.bind(this)}
                            onRevisionRestoreCancel={this.restoreCancel.bind(this)}
                        />
                    )
                }
            </div>
        )
    }
}
