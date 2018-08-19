import * as React from 'react'
import { includes, last, isFunction } from 'lodash'
import { bitTest } from '../../util/accessor/accessor'
import { docname, isDir } from '../../core/docs/docs'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { findType } from '../../core/extension/extension'
import { LinkSharePermission, getLinkErrorMessage, LinkReqStatus } from '../../core/permission/permission'
import { EmptyResult, ProgressCircle } from '../../ui/ui.desktop'
import { MessageDialog } from '../../ui/ui.mobile'
import Image from '../Image/component.mobile'
import Play from '../Play/component.mobile'
import Preview from '../Preview/component.mobile'
import * as commonStyles from '../styles.desktop.css'
import SimpleInfo from './SimpleInfo/component.mobile'
import PasswordValidation from './PasswordValidation/component.mobile'
import List from './List/component.mobile'
import Crumbs from './Crumbs/component.mobile'
import LinkDocsBase, { ErrCode } from './component.base'
import * as styles from './styles.mobile.css'
import * as warning from './assets/warning.png'
import * as emptyfolder from './assets/emptyfolder.png'
import * as fs from '../../core/filesystem/filesystem'
import __ from './locale'

const getMessage = {
    [ErrCode.NoPermission]: (doc) => __('您对文件“${name}”没有预览权限', { name: docname(doc) })
}

export default class LinkDcos extends LinkDocsBase {

    async back() {

        const fullPath = await fs.getDocsChain(this.props.linkDoc, this.linkRoot)
        if (fullPath.length > 1) {
            this.handlePathChange(fullPath[fullPath.length - 2])
        } else {
            this.handlePathChange({ link: this.props.linkDoc.link })
        }

    }

    /**
     * 处理预览过程中的外链关闭，外链密码错误
     */
    private handlePreviewError(errCode: number) {
        if (includes([ErrorCode.LinkInaccessable, ErrorCode.LinkAuthFailed], errCode)) {
            this.setState({
                errCode,
                reqStatus: LinkReqStatus.Initial
            })
        }
    }

    private renderPreview(doc) {
        switch (findType(docname(doc))) {
            case 'IMG':
                const { list } = this.state

                return (
                    <Image
                        doc={doc}
                        link={doc}
                        list={(list && list.files && list.files.length) ? list.files.filter(doc => findType(docname(doc)) === 'IMG') : []}
                        onRequestBack={this.back.bind(this)}
                        onChange={this.changePreviewImage.bind(this)}
                    />
                )
            case 'VIDEO':
            case 'AUDIO':
                return (
                    <Play
                        doc={doc}
                        link={doc}
                        onRequestBack={this.back.bind(this)}
                        onError={this.handlePreviewError.bind(this)}
                    />
                )
            default:
                return (
                    <Preview
                        doc={doc}
                        link={doc}
                        onRequestBack={this.back.bind(this)}
                        onError={this.handlePreviewError.bind(this)}
                    />
                )
        }
    }

    /**
     * 列举link文档对象
     */
    async load(doc, { useCache = true, reload = true } = {}) {
        try {
            let crumbs = await fs.getDocsChain(doc, this.linkRoot)
            const currentDoc = last(crumbs)

            this.previewFile = null

            if (!(currentDoc === null || isDir(currentDoc))) {
                this.previewFile = currentDoc
                crumbs = crumbs.slice(0, -1)

                // 预览图片时，当crumbs不为空数组 且 list为空时，获取list
                if (findType(docname(currentDoc)) === 'IMG' && !this.state.list && crumbs.length) {
                    try {
                        const list = await fs.list(last(crumbs), { useCache })

                        this.setState({
                            list
                        })
                    }
                    catch ({ errcode }) {
                        switch (errcode) {
                            // 链接无效，链接超过次数
                            case ErrorCode.LinkAuthFailed:
                            case ErrorCode.LinkInaccessable:
                                this.setState({
                                    reqStatus: LinkReqStatus.Initial,
                                    errCode: errcode,
                                    saveTo: false
                                })
                        }
                    }
                }

                this.setState({
                    reqStatus: LinkReqStatus.PreviewFile
                })
            }

            if (this.props.onLoad && isFunction(this.props.onLoad)) {
                this.props.onLoad(currentDoc)
            }

            if (this.previewFile) {
                return
            }

            if (this.state.saveTo) {
                return
            }

            this.setState({
                crumbs,
                selections: []
            }, async () => {
                const { crumbs } = this.state
                const currentDir = last(crumbs)

                try {
                    const list = await fs.list(currentDir, { useCache })

                    this.setState({
                        list
                    })
                }
                catch ({ errcode }) {
                    switch (errcode) {
                        // 链接无效，链接超过次数
                        case ErrorCode.LinkAuthFailed:
                        case ErrorCode.LinkInaccessable:
                            this.setState({
                                reqStatus: LinkReqStatus.Initial,
                                errCode: errcode,
                                saveTo: false
                            })
                    }
                }
            })
        }
        catch ({ errcode }) {
            switch (errcode) {
                // 链接无效，链接超过次数
                case ErrorCode.LinkAuthFailed:
                case ErrorCode.LinkInaccessable:
                    this.setState({
                        reqStatus: LinkReqStatus.Initial,
                        errCode: errcode,
                        saveTo: false
                    })
            }
        }
    }

    render() {
        const { link } = this.props.linkDoc
        const {
            list,
            crumbs,
            errCode,
            reqStatus,
            selections,
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
                            onRequestPreviewFile={doc => this.previewLinkFile(doc, false)}
                            onRequestDownload={this.download.bind(this)}
                            onRequrestSaveTo={this.saveTo.bind(this)}
                        />
                    )
                }
                {
                    reqStatus === LinkReqStatus.List && list && list.dirs && list.files && (
                        <div>
                            <Crumbs
                                className={styles['crumbs-area']}
                                crumbs={crumbs}
                                uploadEnable={uploadEnable}
                                onCrumbChange={this.handlePathChange.bind(this)}
                            />
                            <div className={styles['docs']}>
                                <List
                                    list={list}
                                    selections={selections}
                                    downloadEnable={downloadEnable}
                                    EmptyComponent={
                                        <div className={styles['empty-area']}>
                                            <EmptyResult
                                                details={__('空文件夹')}
                                                fontSize={15}
                                                color={'#868686'}
                                                size={64}
                                                picture={emptyfolder}
                                            />
                                        </div>
                                    }
                                    onRequestOpenDir={this.handlePathChange.bind(this)}
                                    onRequestDownload={this.download.bind(this)}
                                />
                            </div>
                        </div>
                    )
                }
                {
                    includes([ErrorCode.LinkInaccessable, ErrorCode.LinkVisitExceeded], errCode) && (
                        <EmptyResult
                            details={getLinkErrorMessage(errCode)}
                            fontSize={15}
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
                            {
                                this.renderPreview(this.previewFile)
                            }
                        </div>
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