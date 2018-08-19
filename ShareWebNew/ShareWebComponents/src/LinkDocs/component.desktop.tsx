import * as React from 'react'
import * as classnames from 'classnames'
import { includes, last } from 'lodash'
import session from '../../util/session/session'
import { bitTest } from '../../util/accessor/accessor'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { docname } from '../../core/docs/docs'
import { LinkSharePermission, getLinkErrorMessage, LinkReqStatus } from '../../core/permission/permission'
import { EmptyResult, ProgressCircle, MessageDialog } from '../../ui/ui.desktop'
import Preview2 from '../Preview2/component.desktop'
import { Type } from '../SaveTo/component.base';
import SaveTo from '../SaveTo/component.desktop';
import Auth from '../Auth/component.desktop';
import Upload from '../Upload/component.desktop'
import * as commonStyles from '../styles.desktop.css'
import ContextMenu from './ContextMenu/component.desktop'
import SimpleInfo from './SimpleInfo/component.desktop'
import PasswordValidation from './PasswordValidation/component.desktop'
import Crumbs from './Crumbs/component.desktop'
import ToolBar from './ToolBar/component.desktop'
import List from './List/component.desktop'
import LinkDocsBase, { ErrCode } from './component.base'
import * as styles from './styles.desktop.css'
import * as warning from './assets/warning.png'
import * as emptyfolder from './assets/emptyfolder.png'
import __ from './locale'

const getMessage = {
    [ErrCode.NoPermission]: (doc) => __('您对文件“${name}”没有预览权限', { name: docname(doc) })
}

export default class LinkDocs extends LinkDocsBase {

    render() {
        const { link } = this.props.linkDoc
        const {
            list,
            crumbs,
            errCode,
            reqStatus,
            selections,
            saveTo,
            loginStatus,
            showContextMenu,
            contextMenuPosition,
            dragUploadDest,
            loading,
            exception
        } = this.state

        const uploadEnable = !!(this.linkRoot && bitTest(this.linkRoot.perm, LinkSharePermission.UPLOAD))
        const downloadEnable = !!(this.linkRoot && bitTest(this.linkRoot.perm, LinkSharePermission.DOWNLOAD))

        return (
            <div className={styles['container']}>
                {
                    reqStatus === LinkReqStatus.Info && (
                        <SimpleInfo
                            linkDoc={this.linkRoot}
                            downloadEnable={downloadEnable}
                            onRequestOpenDir={this.openLinkDir.bind(this)}
                            onRequestPreviewFile={doc => this.previewLinkFile(doc, true)}
                            onRequestDownload={this.download.bind(this)}
                            onRequrestSaveTo={this.saveTo.bind(this)}
                        />
                    )
                }
                {
                    reqStatus === LinkReqStatus.List && list && list.dirs && list.files && (
                        <div>
                            <div className={styles['address']}>
                                <div className={styles['wrapper']}>
                                    <Crumbs
                                        crumbs={crumbs}
                                        onCrumbChange={this.handlePathChange.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className={styles['docs-container']}>
                                <div
                                    className={styles['main']}
                                    onContextMenu={this.handleMainContextMenu.bind(this)}
                                    onDragEnter={() => this.setDragUploadDest(last(crumbs))}
                                >
                                    {
                                        (uploadEnable || downloadEnable) && (
                                            <ToolBar
                                                list={list}
                                                crumbs={crumbs}
                                                selections={selections}
                                                uploadEnable={uploadEnable}
                                                downloadEnable={downloadEnable}
                                                onToggleSelectAll={this.toggleSelectAll.bind(this)}
                                                onRequestDownload={this.download.bind(this)}
                                                onRequrestSaveTo={this.saveTo.bind(this)}
                                            />
                                        )
                                    }
                                    <div
                                        ref="docs"
                                        className={classnames(
                                            styles['docs'],
                                            { [styles['top-position']]: (uploadEnable || downloadEnable) }
                                        )}
                                    >
                                        {
                                            (list.dirs.length + list.files.length) ?
                                                <List
                                                    list={list}
                                                    selections={selections}
                                                    checkbox={downloadEnable}
                                                    downloadEnable={downloadEnable}
                                                    onSelectionChange={selections => this.setState({ selections })}
                                                    onRequestOpenDir={this.handlePathChange.bind(this)}
                                                    onRequestDownload={this.download.bind(this)}
                                                    onRequrestSaveTo={this.saveTo.bind(this)}
                                                    onContextMenu={this.handleContextMenu.bind(this)}
                                                />
                                                :
                                                <EmptyResult
                                                    details={__('空文件夹')}
                                                    fontSize={14}
                                                    color={'#868686'}
                                                    size={64}
                                                    picture={emptyfolder}
                                                />

                                        }
                                    </div>
                                    {
                                        !!dragUploadDest && dragUploadDest === last(crumbs) ?
                                            <Upload.DragArea
                                                dest={dragUploadDest}
                                                className={styles['dragarea']}
                                                onDragLeave={() => this.setDragUploadDest(null)}
                                                onDrop={() => this.setDragUploadDest(null)}
                                            /> :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                <ContextMenu
                    position={contextMenuPosition}
                    crumbs={crumbs}
                    selections={selections}
                    open={showContextMenu}
                    downloadEnable={downloadEnable}
                    onRequestClose={this.closeContextMenu.bind(this)}
                    onRequestDownload={this.download.bind(this)}
                    onRequrestSaveTo={this.saveTo.bind(this)}
                    onRequestRefresh={this.refresh.bind(this)}
                />
                {
                    includes([ErrorCode.LinkInaccessable, ErrorCode.LinkVisitExceeded], errCode) && (
                        <EmptyResult
                            details={getLinkErrorMessage(errCode)}
                            fontSize={14}
                            color={'#868686'}
                            size={64}
                            picture={warning}
                        />
                    )
                }
                {
                    errCode === ErrorCode.LinkAuthFailed && (
                        <PasswordValidation
                            link={link}
                            onValidateSuccess={this.handleValidateSuccess.bind(this)}
                            onError={errCode => this.setState({ errCode })}
                        />
                    )
                }
                {
                    reqStatus === LinkReqStatus.PreviewFile && (
                        <div className={styles['preview-area']}>
                            <Preview2
                                doc={this.previewFile}
                                doDownload={downloadEnable && (doc => this.download([doc]))}
                                doSaveTo={downloadEnable && (doc => this.saveTo([doc]))}
                                onLinkError={this.handleLinkError.bind(this)}
                            />
                        </div>
                    )
                }
                {
                    saveTo && (
                        loginStatus ?
                            <SaveTo
                                link={this.saveToDocs[0]}
                                docs={this.saveToDocs}
                                type={Type.SHARELINK}
                                onSaveComplete={() => { this.saveToComplete() }}
                                onRedirect={this.props.onRedirectDest}
                                onLinkError={this.handleLinkError.bind(this)}
                            />
                            :
                            <Auth
                                onAuthSuccess={this.loginSuccess.bind(this)}
                                onAuthClose={() => { this.saveToComplete() }}
                                onPasswordChange={(account) => { this.onRequestChangePassword(account) }}
                            />
                    )
                }
                {
                    loading && (
                        <ProgressCircle
                            fixedPositioned={true}
                            showMask={false}
                            detail={__('正在加载，请稍候......')}
                        />
                    )
                }
                {
                    !!exception && (
                        <MessageDialog onConfirm={() => this.setState({ exception: null })}>
                            <div className={commonStyles['warningHeader']}>
                                {__('无法打开当前文件')}
                            </div>
                            <div className={commonStyles['warningContent']}>
                                {getMessage[exception.errCode](exception.doc)}
                            </div>
                        </MessageDialog>
                    )
                }
            </div>
        )
    }
}