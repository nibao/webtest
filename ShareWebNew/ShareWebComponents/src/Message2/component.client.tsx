import * as React from 'react';
import Button from '../../ui/Button/ui.desktop';
import { NWWindow } from '../../ui/ui.client';
import { MsgStatus } from '../../core/message/message';
import { ClientComponentContext } from '../helper';
import NoMsgTip from './NoMsgTip/component.desktop';
import Selector from './Selector/component.desktop';
import RenderMsgs from './RenderMsgs/component.client';
import ReadAllDialog from './ReadAllDialog/component.client';
import MessageBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';


export default class Message extends MessageBase {
    render() {
        const { selectedMode, showReadAllDialog, msgs, csfSysId, csfTextArray, resultMessage } = this.state;
        const { showMsgType, doPreview, doRedirect, doCheck, onOpenMessagesDialog, onCloseMessagesDialog, fields, id } = this.props;
        const unReadMsgs = msgs.filter(item => !item.isread);
        return (
            <NWWindow
                id={id}
                title={__('消息中心')}
                width={1100}
                height={650}
                onOpen={onOpenMessagesDialog}
                onClose={onCloseMessagesDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
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
                            <Selector selectedMode={selectedMode} onChangeMode={this.changeMode.bind(this)} />
                        </div>
                        {msgs.length === 0 ?
                            <NoMsgTip showMsgType={showMsgType} selectedMode={selectedMode} />
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
                                doPreview={doPreview}
                                doRedirect={doRedirect}
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
                    </div>
                </ClientComponentContext.Consumer>

            </NWWindow>
        )
    }
}