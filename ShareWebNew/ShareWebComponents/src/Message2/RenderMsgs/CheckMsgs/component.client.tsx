import * as React from 'react';
import * as classnames from 'classnames';
import FontIcon from '../../../../ui/FontIcon/ui.desktop';
import Thumbnail from '../../../Thumbnail/component.desktop';
import { formatTimeRelative } from '../../../../util/formatters/formatters';
import { buildDocFromMsg } from '../helper'

import * as gotImg from './assets/got.png';
import * as styles from '../styles.desktop.css';

import SummaryInfo from '../SummaryInfo/component.desktop'
import CheckInfo from '../CheckInfo/component.desktop';
import HandleInfo from '../HandleInfo/component.desktop';
import CheckResult from '../CheckResult/component.client';


/**
 * 渲染审核消息列表
 * @export
 * @param {Components.Message2.RenderMsgs.CheckMsgs.Props} { msgs, onRead, doPreview, doCheck, showResultDialog, closeResultDialog, doRedirect, csfSysId, csfTextArray, resultMessage } 
 * @returns 
 */
export default function CheckMsgs({ msgs, csfSysId, csfTextArray, resultMessage, onRead, showResultDialog, closeResultDialog, doPreview, doCheck, doRedirect }: Components.Message2.RenderMsgs.CheckMsgs.Props) {
    const msgsDoc = buildDocFromMsg(msgs);
    return (
        <div className={styles['message-list']}>
            <ul>
                {
                    msgs.map(item => {
                        return (
                            <li
                                className={classnames(styles['result-item'])}
                                onClick={() => { onRead(item) }}
                                key={item.id}
                            >
                                <h1>
                                    <a
                                        className={styles['title-a']}
                                        onClick={() => { doPreview(msgsDoc[item.id]) }}
                                    >
                                        <span className={styles['notice-icon-wrap']}>
                                            {
                                                item.isread ?
                                                    null
                                                    :
                                                    <FontIcon
                                                        font={'Anyshare'}
                                                        size="16px"
                                                        code={'\uf004'}
                                                        fallback={gotImg}
                                                        className={styles['notice-icon']}
                                                    />
                                            }
                                        </span>
                                        <Thumbnail
                                            doc={msgsDoc[item.id]}
                                            size={32}
                                        />
                                        <Title content={msgsDoc[item.id].docname}>
                                            <span
                                                className={styles['title-text']}
                                            >
                                                {msgsDoc[item.id].docname}
                                            </span>
                                        </Title>
                                    </a>
                                </h1>
                                <div className={styles['content']}>
                                    <div className={styles['layout-spacing']}>
                                        <div className={styles['atom']}>
                                            <span>{formatTimeRelative(item.time / 1000)}</span>
                                        </div>
                                        <div className={styles['atom']}>
                                            <CheckInfo msg={item} />
                                        </div>
                                    </div>
                                    <div className={styles['layout-spacing']}>
                                        <SummaryInfo
                                            msg={item}
                                            csfSysId={csfSysId}
                                            csfTextArray={csfTextArray}
                                        />
                                    </div>
                                    <div className={styles['handle-layout-spacing']}>
                                        <HandleInfo
                                            msg={item}
                                            msgsDoc={msgsDoc}
                                            showResultDialog={showResultDialog}
                                            doCheck={doCheck}
                                            doRedirect={doRedirect}
                                        />
                                    </div>

                                </div>

                            </li>
                        )
                    })
                }
                {
                    resultMessage ?
                        <CheckResult
                            resultMsg={resultMessage}
                            closeResultDialog={closeResultDialog}
                        />
                        :
                        null
                }
            </ul>
        </div>
    )
}