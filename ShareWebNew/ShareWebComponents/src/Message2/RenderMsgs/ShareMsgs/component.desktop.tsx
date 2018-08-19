import * as React from 'react';
import FontIcon from '../../../../ui/FontIcon/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import Thumbnail from '../../../Thumbnail/component.desktop';
import { formatTimeRelative } from '../../../../util/formatters/formatters';
import { Type } from '../../../../core/message/message';
import { CSFInfo, permissionInfo, buildDocFromMsg } from '../helper';
import * as gotImg from './assets/got.png';
import * as styles from '../styles.desktop.css';
import __ from './locale';

/**
 * 渲染共享消息列表
 * @export
 * @param {Components.Message2.RenderMsgs.Sharemsgs.Props} { msgs, csfSysId, csfTextArray, onRead, doPreview, doRedirect } 
 * @returns 
 */
export default function ShareMsgs({ msgs, csfSysId, csfTextArray, onRead, doPreview, doRedirect }: Components.Message2.RenderMsgs.Sharemsgs.Props) {
    const msgsDoc = buildDocFromMsg(msgs);

    return (
        <div className={styles['message-list']}>
            <ul>
                {
                    msgs.map(item => {

                        return (
                            <li
                                className={styles['result-item']}
                                onClick={() => onRead(msgsDoc[item.id])}
                                key={item.id}
                            >
                                <h1 className={styles['name-wrapper']}>
                                    {
                                        item.type === Type.OpenShare || item.type === Type.SetOwner ?
                                            (
                                                <a className={styles['title-a']} onClick={() => doPreview(msgsDoc[item.id])}>
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
                                                    <Thumbnail doc={msgsDoc[item.id]} size={32} />
                                                    <div className={styles['docname']}>
                                                        <Title content={msgsDoc[item.id].docname}>
                                                            <span className={styles['title-text']}>
                                                                {msgsDoc[item.id].docname}
                                                            </span>
                                                        </Title>
                                                    </div>
                                                </a>
                                            ) :
                                            (
                                                <span className={styles['title-span']}>
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
                                                    <Thumbnail doc={msgsDoc[item.id]} size={32} />
                                                    <div className={styles['docname']}>
                                                        <Title content={msgsDoc[item.id].docname}>
                                                            <span className={styles['title-text']}>
                                                                {msgsDoc[item.id].docname}
                                                            </span>
                                                        </Title>
                                                    </div>
                                                </span>
                                            )
                                    }
                                </h1>
                                <div className={styles['content']}>
                                    <div className={styles['layout-spacing']}>
                                        <div className={styles['atom']}>
                                            <span>{formatTimeRelative(item.time / 1000)}</span>
                                        </div>
                                        <div className={styles['atom']}>
                                            <span>
                                                {
                                                    item.type === Type.OpenShare || item.type === Type.SetOwner ?
                                                        __('${sender}给${accessorname}共享了文档', { 'sender': item.sender, accessorname: item.accessortype === 'user' ? __('您') : item.accessorname })
                                                        :
                                                        __('${sender}给${accessorname}取消了共享', { 'sender': item.sender, accessorname: item.accessortype === 'user' ? __('您') : item.accessorname })
                                                }
                                            </span>
                                        </div>
                                        <div className={styles['atom']}>
                                            <label>{__('权限：')}</label>
                                            <span>
                                                {
                                                    item.type === Type.OpenShare || item.type === Type.CloseShare ?
                                                        permissionInfo(item)
                                                        :
                                                        __('所有者')
                                                }
                                            </span>
                                        </div>
                                        <div className={styles['atom']}>
                                            <label>{__('有效期至：')}</label>
                                            {
                                                item.end && item.end !== -1 ? formatTimeRelative(item.end / 1000) : __('永久有效')
                                            }
                                        </div>
                                        <div className={styles['atom']}>
                                            <label>{__('文件密级：')}</label>
                                            <span>{CSFInfo(item.csf, csfSysId, csfTextArray)}</span>
                                        </div>
                                    </div>
                                    {
                                        item.type === Type.OpenShare || item.type === Type.SetOwner ?
                                            (
                                                <div className={styles['handle-layout-spacing']}>
                                                    <div className={styles['atom']}>
                                                        <label>{__('所在位置：')}</label>
                                                        <Title content={msgsDoc[item.id].path}>
                                                            <a
                                                                href="javascript:void(0)"
                                                                className={styles['link']}
                                                                onClick={() => doRedirect(msgsDoc[item.id].parent)}
                                                            >
                                                                {
                                                                    msgsDoc[item.id].path
                                                                }
                                                            </a>
                                                        </Title>
                                                    </div>

                                                </div>
                                            ) :
                                            null
                                    }
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}