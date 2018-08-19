import * as React from 'react';
import * as classnames from 'classnames';
import { Browser, isBrowser } from '../../util/browser/browser';
import Centered from '../../ui/Centered/ui.desktop';
import HlsPlayer from '../../ui/HlsPlayer/ui.desktop'
import PlayBase from './component.base';
import { Definition, PlayType, Status } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Play extends PlayBase {
    switchContent(type, status) {
        switch (true) {
            case type === PlayType.VIDEO && status === Status.CONVERTING:
                return (
                    <div className={styles['message']} >{__('视频正在转码，请稍等...')}</div>
                )

            case type === PlayType.AUDIO && status === Status.CONVERTING:
                return (
                    <div className={styles['message']} >{__('音频正在转码，请稍等...')}</div>
                )

            case status === Status.LOW_DISK:
                return (
                    <div className={styles['message']} >{__('转码失败，服务器缓存空间不足')}</div>
                )

            case status === Status.FAIL:
                return (
                    <div className={styles['message']}>
                        <p className={styles['paragraph']}>{__('文件转码失败')}</p>
                        {
                            this.props.link && (this.props.perm & 2) === 2 ?
                                <p className={styles['paragraph']}>
                                    <span>{__('您可以：')}</span>
                                    <a className={styles['link']} href="javascript:void(0)" onClick={this.downloadTrigger.bind(this, null)}>{__('下载文件')}</a>
                                </p> :
                                null
                        }
                    </div>
                )

            default:
                return (
                    <div className={classnames({
                        [styles['video']]: this.props.type === 'video',
                        [styles['audio']]: this.props.type === 'audio'
                    })}
                    >
                        <HlsPlayer
                            ref="player"
                            flash={this.playType === PlayType.AUDIO && (isBrowser({ app: Browser.Safari }) || isBrowser({ app: Browser.Edge }) || isBrowser({ app: Browser.MSIE, version: 11 }))}
                            src={this.state.src}
                            swf={this.props.swf}
                            type={this.props.type}
                            autoPlay={false}
                            controls
                            width={640}
                            height={this.playType === PlayType.AUDIO ? 30 : 480}
                            onFullScreenChange={this.handleFullScreenChange.bind(this)}
                        />
                        <div className={classnames(styles['sidebar'], { [styles['hide']]: this.state.fullScreen })}>
                            <div className={styles['sidebarPadding']}>
                                <div className={styles['sidebarFlexbox']}>
                                    <ul className={styles['sidebarTools']}>
                                        {
                                            this.state.playInfo && this.state.playInfo.sdstat ?
                                                <li className={styles['sidebarTool']}>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className={classnames(styles['sidebarButton'], { [styles['activeDefinition']]: this.state.definition === Definition.SD })}
                                                        onClick={() => { this.switchDefinition(Definition.SD) }}
                                                    >
                                                        {__('流畅')}
                                                    </a>
                                                </li> :
                                                null
                                        }
                                        {
                                            this.state.playInfo && this.state.playInfo.odstat ?
                                                <li className={styles['sidebarTool']}>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className={classnames(styles['sidebarButton'], { [styles['activeDefinition']]: this.state.definition === Definition.OD })}
                                                        onClick={() => { this.switchDefinition(Definition.OD) }}
                                                    >
                                                        {__('原画质')}
                                                    </a>
                                                </li> :
                                                null
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    render() {
        const { type } = this.props
        const { status } = this.state

        return (
            <Centered>
                {
                    this.switchContent(type, status)
                }
            </Centered>
        )
    }
}