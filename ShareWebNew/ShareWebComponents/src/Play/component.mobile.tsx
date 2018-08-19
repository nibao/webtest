import * as React from 'react'
import * as classnames from 'classnames'
import { docname } from '../../core/docs/docs'
import { Browser, isBrowser, OSType } from '../../util/browser/browser'
import HlsPlayer from '../../ui/HlsPlayer/ui.mobile'
import Viewer from '../Viewer/component.mobile'
import Player from '../../ui/Player/ui.mobile';
import PlayBase from './component.base'
import { Definition, PlayType, Status } from './helper'
import __ from './locale'
import * as styles from './styles.mobile.css'

export default class Play extends PlayBase {
    switchContent(type, status) {
        switch (true) {
            case type === PlayType.VIDEO && status === Status.CONVERTING:
                return (
                    <div className={styles.message} >{__('视频正在转码，请稍等...')}</div>
                )

            case type === PlayType.AUDIO && status === Status.CONVERTING:
                return (
                    <div className={styles.message} >{__('音频正在转码，请稍等...')}</div>
                )

            case status === Status.LOW_DISK:
                return (
                    <div className={styles.message} >{__('转码失败，服务器缓存空间不足')}</div>
                )

            case status === Status.FAIL:
                return (
                    <div className={styles.message}>
                        <p className={styles.paragraph}>{__('文件转码失败')}</p>
                        {
                            this.props.link && this.props.perm & 2 === 2 ?
                                <p className={styles.paragraph}>
                                    <span>{__('您可以：')}</span>
                                    <a className={styles.link} href="javascript:void(0)" onClick={this.downloadTrigger.bind(this, null)}>{__('下载文件')}</a>
                                </p>
                                :
                                ''
                        }
                    </div>
                )

            case status === Status.NO_PERMISSION:
                return (
                    <div className={classnames(styles.message, styles['tip-message'])} >
                        {__('您对文件“${filename}”没有预览权限', { filename: docname(this.props.doc) })}
                    </div>
                )

            case type === PlayType.AUDIO && status === Status.PAUSE:
                return (
                    <div className="wave"
                        ng-className="'playing': playStatus === PLAY_STATUS.PLAYING, 'pause': playStatus === PLAY_STATUS.PAUSE || playStatus === PLAY_STATUS.STOP}"></div>
                )

            default:
                return (
                    <div className={styles.video}>
                        <div className={styles.player}
                            onTouchEnd={this.toggleSidebar.bind(this)}
                            onClick={this.toggleSidebar.bind(this)}
                        >
                            {
                                isBrowser({ os: OSType.IOS }) ?
                                    (
                                        <Player
                                            ref="player"
                                            src={this.state.src}
                                            width="100%"
                                            height="100%"
                                        />
                                    ) : (
                                        <HlsPlayer
                                            ref="player"
                                            src={this.state.src}
                                            type={this.props.type}
                                            autoPlay={false}
                                            controls
                                            width={'100%'}
                                            height={'100%'}
                                        />
                                    )
                            }
                        </div>
                        <div className={classnames(styles.sidebar, { [styles['sidebar-active']]: this.state.active })}>
                            <ul className={styles.sidebarTools}>
                                {/*<li className={styles.sidebarTool}>
                                    <a href="javascript:void(0)" className={styles.sidebarButton} onClick={this.downloadTrigger.bind(this, null)} >{__('下载')}</a>
                                </li>*/}
                                {
                                    this.state.playInfo && this.state.playInfo.sdstat ?
                                        <li className={styles.sidebarTool}>
                                            <a
                                                href="javascript:void(0)"
                                                className={classnames(styles.sidebarButton, { [styles.activeDefinition]: this.state.definition === Definition.SD })}
                                                onClick={() => { this.switchDefinition(Definition.SD) }}
                                            >
                                                {__('流畅')}
                                            </a>
                                        </li>
                                        :
                                        ''
                                }
                                {
                                    this.state.playInfo && this.state.playInfo.odstat ?
                                        <li className={styles.sidebarTool}>
                                            <a
                                                href="javascript:void(0)"
                                                className={classnames(styles.sidebarButton, { [styles.activeDefinition]: this.state.definition === Definition.OD })}
                                                onClick={() => { this.switchDefinition(Definition.OD) }}
                                            >
                                                {__('原画质')}
                                            </a>
                                        </li>
                                        :
                                        ''
                                }
                            </ul>
                        </div>
                    </div>
                )
        }
    }

    render() {
        return (
            <Viewer onRequestBack={this.props.onRequestBack} doc={this.props.doc} link={this.props.link} style={{ background: '#000', backgroundImage: 'none' }}>
                <div className={styles.container}>
                    <div className={styles.main}>
                        <div className={styles.mainPadding}>
                            {
                                this.switchContent(this.props.type, this.state.status)
                            }
                        </div>
                    </div>
                </div>
            </Viewer>
        )
    }
}