import * as React from 'react';
import * as classnames from 'classnames';
import { pick } from 'lodash'
import { docname } from '../../core/docs/docs';
import OWAPreview from '../OWAPreview/component.desktop';
import CADPreView from '../CADPreview/component.desktop'
import PDFViewer from '../PDFViewer/component.desktop';
import Image from '../Image2/component.desktop'
import Play from '../Play/component.desktop'
import Header from './Header/component.desktop';
import Progress from './Progress/component.desktop';
import ErrorView from './ErrorView/component.desktop';
import { getErrorMessage, getErrorTemplate } from '../../core/errcode/errcode';
import { formatterErrorText } from '../../core/permission/permission';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { PreviewMethod } from './helper';
import PreviewBase from './component.base';
import * as styles from './styles.desktop.css';

export default class PreviewView extends PreviewBase {
    switchContent() {
        const { illegalContentQuarantine } = this.props;
        const { previewMethod, error, downloadEnable, doc, saveToEnable } = this.state;
        if (error !== null) {
            return (
                <ErrorView
                    code={error}
                    downloadEnable={downloadEnable}
                    doDownload={() => this.props.doDownload(doc)}
                    docname={docname(doc)}
                    doReload={() => { this.load(doc) }}
                />
            )
        }
        else if (previewMethod !== null) {
            switch (previewMethod) {
                case PreviewMethod.PDF:
                    return (
                        <PDFViewer
                            doc={doc}
                            illegalContentQuarantine={illegalContentQuarantine}
                            onPropgress={this.handleProgress.bind(this)}
                            fullScreen={this.state.fullScreen}
                            onRequestFullScreen={this.handleRequestFullScreen.bind(this)}
                            onError={this.handleError}
                        />
                    )

                case PreviewMethod.CAD:
                    return (
                        <CADPreView
                            doc={doc}
                            link={pick(doc, ['link', 'password', 'usrdisplayname', 'usrloginname'])}
                            onRequestFullScreen={this.handleRequestFullScreen.bind(this)}
                            illegalContentQuarantine={illegalContentQuarantine}
                            onCADPreviewError={this.handleError}
                            fullScreen={this.state.fullScreen}
                            doDownload={this.props.doDownload}
                        />
                    )

                case PreviewMethod.Image:
                    return (
                        <Image
                            doc={doc}
                            className={styles['viewer']}
                            fullScreen={this.state.fullScreen}
                            onRequestFullScreen={this.handleRequestFullScreen.bind(this)}
                            onImageChange={this.handlePathChange.bind(this)}
                        />
                    )

                case PreviewMethod.Video:
                    return (
                        <Play
                            doc={doc}
                            type="video"
                            swf="/libs/flashls/bin/release/flashlsChromeless.swf"
                            onError={this.handleError}
                        />
                    )

                case PreviewMethod.Audio:
                    return (
                        <Play
                            doc={doc}
                            type="audio"
                            swf="/libs/flashls/bin/release/flashlsChromeless.swf"
                            onError={this.handleError}
                        />
                    )

                case PreviewMethod.OWA:
                    return (
                        <OWAPreview
                            className={styles['viewer']}
                            doc={doc}
                            canprint={!this.state.avoidPrint}
                            canEdit={this.props.canEdit}
                            doSaveTo={saveToEnable && this.props.doSaveTo}
                            doDownload={this.props.doDownload}
                            doRevisionRestore={this.props.doRevisionRestore}
                            onError={this.handleError}
                        />
                    )

            }
        }
    }

    render() {
        const { previewMethod, doc, errDialog, favorited, saveToEnable, avoidCopy, loadedSize, totalSize, fullScreen } = this.state
        return (
            <div
                className={classnames(styles['container'], { [styles['fullscreen']]: fullScreen || (previewMethod === PreviewMethod.OWA) })}
                onContextMenu={this.forbidContextMenu.bind(this)}
            >
                {
                    previewMethod === PreviewMethod.OWA ?
                        null :
                        <Header
                            className={styles['header']}
                            doc={doc}
                            favorited={favorited}
                            saveToEnable={saveToEnable}
                            doCollect={this.props.enableCollect ? () => this.handleCollect() : undefined}
                            doDownload={this.props.doDownload}
                            doSaveTo={this.props.doSaveTo}
                            doInnerShareLink={this.props.doInnerShareLink}
                            doOuterShareLink={this.props.doOuterShareLink}
                            doRevisionRestore={this.props.doRevisionRestore}
                        />
                }
                <div
                    ref="content"
                    className={classnames(styles['content'], { [styles['avoid-copy']]: avoidCopy })}
                >
                    <Progress
                        loaded={loadedSize}
                        total={totalSize}
                        detail={true}
                        className={styles['progress']}
                    />
                    {
                        this.switchContent()
                    }
                    {
                        errDialog ? (
                            <MessageDialog onConfirm={() => {
                                this.setState({
                                    errDialog: null
                                })
                            }}>
                                {
                                    errDialog === ErrorCode.GNSInaccessible ?
                                        formatterErrorText(errDialog, doc)
                                        : getErrorMessage(errDialog)
                                }
                            </MessageDialog>
                        ) : null
                    }
                </div>
            </div>
        )
    }
}