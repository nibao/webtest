import * as React from 'react';
import FontIcon from '../../../../ui/FontIcon/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import Thumbnail from '../../../Thumbnail/component.desktop';
import { Type } from '../../../../core/message/message';
import { formatTimeRelative } from '../../../../util/formatters/formatters';
import { buildDocFromMsg } from '../helper'
import SummaryInfo from '../SummaryInfo/component.desktop'
import HandleInfo from '../HandleInfo/component.desktop';
import SecurityInfo from '../SecurityInfo/component.desktop';
import * as gotImg from './assets/got.png';
import * as styles from '../styles.desktop.css';


/**
 * 渲染安全消息列表
 * @export
 * @param {Components.Message2.RenderMsgs.SecurityMsgs.Props} { msgs, csfSysId, csfTextArray, onRead, showResultDialog, doPreview, doCheck, doRedirect } 
 * @returns 
 */
export default function SecurityMsgs({ msgs, csfSysId, csfTextArray, onRead, showResultDialog, doPreview, doCheck, doRedirect }: Components.Message2.RenderMsgs.SecurityMsgs.Props) {
    const msgsDoc = buildDocFromMsg(msgs);
    return (
        <div className={styles['message-list']}>
            <ul>
                {
                    msgs.map(item => {
                        return (
                            <li
                                className={styles['result-item']}
                                onClick={() => onRead(item)}
                                key={item.id}
                            >
                                <h1 className={styles['name-wrapper']}>
                                    {
                                        item.type === Type.IllegalFileIsolated ?
                                            (<span className={styles['title-span']}>
                                                <span className={styles['notice-icon-wrap']}>
                                                    {
                                                        item.isread ?
                                                            null :
                                                            <FontIcon
                                                                font={'Anyshare'}
                                                                size="16px"
                                                                code={'\uf004'}
                                                                fallback={gotImg}
                                                                className={styles['notice-icon']}
                                                            />
                                                    }
                                                </span>
                                                {
                                                    msgsDoc[item.id].docname ?
                                                        <Thumbnail
                                                            doc={msgsDoc[item.id]}
                                                            size={32}
                                                        />
                                                        :
                                                        null
                                                }
                                                {
                                                    msgsDoc[item.id].docname ? (
                                                        <div className={styles['docname']}>
                                                            <Title content={msgsDoc[item.id].docname}>
                                                                <span className={styles['title-text']}>
                                                                    {msgsDoc[item.id].docname}
                                                                </span>
                                                            </Title>
                                                        </div>
                                                    ) : null
                                                }
                                            </span>)
                                            :
                                            (<a
                                                className={styles['title-a']}
                                                onClick={() => doPreview(msgsDoc[item.id])}
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
                                                <div className={styles['docname']}>
                                                    <Title content={msgsDoc[item.id].docname}>
                                                        <span
                                                            className={styles['title-text']}
                                                        >
                                                            {msgsDoc[item.id].docname}
                                                        </span>
                                                    </Title>
                                                </div>
                                            </a>
                                            )
                                    }
                                </h1>
                                <div className={styles['content']}>
                                    <div className={styles['layout-spacing']}>
                                        <div className={styles['atom']}>
                                            <span>{formatTimeRelative(item.time / 1000)}</span>
                                        </div>
                                        <div className={styles['atom']}>
                                            <SecurityInfo msg={item} />
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
                                            doCheck={doCheck}
                                            showResultDialog={showResultDialog}
                                            doRedirect={doRedirect}
                                        />
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}