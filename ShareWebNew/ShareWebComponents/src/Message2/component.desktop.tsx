import * as React from 'react';
import Button from '../../ui/Button/ui.desktop';
import { docname, isDir } from '../../core/docs/docs';
import { MsgStatus } from '../../core/message/message';
import NoMsgTip from './NoMsgTip/component.desktop';
import Selector from './Selector/component.desktop';
import RenderMsgs from './RenderMsgs/component.desktop';
import ReadAllDialog from './ReadAllDialog/component.desktop';
import ExceptionMessage from '../ExceptionMessage/component.desktop';
import MessageBase from './component.base';
import { Exception } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

const getException = (exception): { title: string; detail?: string } => {
    const { type, detail: doc } = exception

    switch (type) {
        case Exception.FILE_MISSING:
            return isDir(doc) ?
                {
                    title: __('无法打开当前文件夹'),
                    detail: __('找不到文件夹“${name}”，可能文件夹的名称或路径发生变更。', { name: docname(doc) })
                } :
                {
                    title: __('无法打开当前文件'),
                    detail: __('找不到文件“${name}”，可能文件的名称或路径发生变更。', { name: docname(doc) })
                }


        case Exception.PERMISSION_REJECT:
            return isDir(doc) ?
                {
                    title: __('无法打开当前文件夹'),
                    detail: __('您对文件夹“${name}”没有显示权限。', { name: docname(doc) })
                } :
                {
                    title: __('无法打开当前文件'),
                    detail: __('您对文件“${name}”没有预览权限。', { name: docname(doc) })
                }

        default:
            return isDir(doc) ?
                {
                    title: __('无法打开当前文件夹'),
                } :
                {
                    title: __('无法打开当前文件'),
                }
    }
}


export default class Message extends MessageBase {
    render() {
        const { showMsgType, doCheck } = this.props;
        const { exception, selectedMode, showReadAllDialog, msgs, csfSysId, csfTextArray, resultMessage } = this.state;
        const unReadMsgs = msgs.filter(item => !item.isread);

        return (
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <Button
                        icon={'\uf0ab'}
                        disabled={(selectedMode === MsgStatus.Read || !unReadMsgs.length) ? true : false}
                        className={styles['read-all']}
                        onClick={() => this.handleClickReadAll()}
                    >
                        {__('全部标为已读')}
                    </Button>
                    <Selector
                        selectedMode={selectedMode}
                        onChangeMode={this.changeMode.bind(this)}
                    />
                </div>
                {
                    msgs.length === 0 ?
                        <NoMsgTip
                            showMsgType={showMsgType}
                            selectedMode={selectedMode}
                        />
                        :
                        <RenderMsgs
                            msgs={msgs}
                            csfSysId={csfSysId}
                            csfTextArray={csfTextArray}
                            resultMessage={resultMessage}
                            onRead={this.read.bind(this)}
                            showResultDialog={this.showResultDialog.bind(this)}
                            closeResultDialog={this.closeResultDialog.bind(this)}
                            showMsgType={showMsgType}
                            doPreview={this.handlePreview}
                            doRedirect={this.handleRedirect}
                            doCheck={doCheck}
                        />
                }
                {
                    showReadAllDialog ?
                        <ReadAllDialog
                            showMsgType={showMsgType}
                            handleSubmitReadAll={this.handleSubmitReadAll.bind(this, unReadMsgs)}
                            handleHideReadAll={this.handleHideReadAll.bind(this)}
                        />
                        : null
                }
                {
                    exception ? (() => {
                        const { title, detail } = getException(exception)

                        return (
                            <ExceptionMessage
                                {...{ title, detail }}
                                onMessageConfirm={() => this.setState({ exception: null })}
                            />
                        )
                    })() : null
                }
            </div>
        )
    }
}