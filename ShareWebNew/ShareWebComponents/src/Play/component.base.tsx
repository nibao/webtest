import * as React from 'react';
import WebComponent from '../webcomponent';
import { pick, merge, noop } from 'lodash';
import { timer } from '../../util/timer/timer';
import { findType } from '../../core/extension/extension';
import { docname } from '../../core/docs/docs';
import { getPlayInfo, buildUrl } from '../../core/player/player';
import { download, getDownloadURL } from '../../core/download/download';
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { Status, Definition, PlayType } from './helper';

export default class PlayBase extends WebComponent<Components.Play.Props, Components.Play.State> {
    static defaultProps = {
        type: PlayType.VIDEO,

        onError: noop
    }

    state = {
        active: false,

        status: Status.CONVERTING,

        fullScreen: false
    }

    playType = findType(docname(this.props.doc)) === 'VIDEO' ? PlayType.VIDEO : PlayType.AUDIO

    componentDidMount() {
        this.play();
    }

    /**
     * 更新播放信息
     */
    async updatePlayInfo(definition?) {
        const { doc: { link, password, docid, rev } } = this.props
        const playInfo = await getPlayInfo({ link, password, docid, rev, definition })

        this.setState({ playInfo });

        if (playInfo.status === 0 || playInfo.status === 1) {
            this.setState({ status: Status.CONVERTING });
        }
        else if (playInfo.status === 2) {
            this.setState({ status: Status.PAUSE });
        }

        return playInfo;
    }


    /**
     * 轮询当前视频转码状态
     */
    async rollPollStatus(definition?) {
        const { doc: { link, password } } = this.props;

        const stop = timer(async () => {
            try {
                const { status, docid, odstat, sdstat } = await this.updatePlayInfo(definition)

                switch (status) {
                    case 1:
                        this.setState({ status: Status.CONVERTING })
                        break

                    case 2:
                        stop();
                        this.setState({
                            src: buildUrl(link ? 'link' : 'file', { docid, link, password }),
                            definition: definition ?
                                definition :
                                odstat ? Definition.OD : Definition.SD // 如果有原画质，则服务端优先返回原画质，否则返回流畅画质
                        });
                        break

                }
            } catch (err) {
                stop();

                switch (err.errcode) {
                    case 403047:
                        this.setState({
                            status: Status.FAIL
                        });
                        break;

                    case 403069:
                        this.setState({
                            status: Status.LOW_DISK
                        });
                        break;

                    // 无权限
                    case 403002:
                        this.setState({
                            status: Status.NO_PERMISSION
                        });
                        this.props.onError(err.errcode)
                        break;

                    // 外链关闭
                    case ErrorCode.LinkInaccessable:
                    // 外链密码不正确
                    case ErrorCode.LinkAuthFailed:
                        this.props.onError(err.errcode)
                        break

                    case 403065:
                        // 密级不足
                        this.props.onError(err.errcode)
                }
            }
        })
    }


    /**
     * 播放视频
     */
    play(definition?) {
        if (definition) {
            this.setState({
                definition
            });
        }

        this.rollPollStatus(definition);
    }


    /**
     * 切换画质
     */
    switchDefinition(definition: string) {
        if (definition !== this.state.definition) {
            this.refs.player.pause();
            this.play(definition);
        }
    }

    /**
     * IE8 获取下载
     */
    prepareDownload() {
        const { doc } = this.props;

        getDownloadURL(pick(doc, ['link', 'password', 'docid', 'rev']))
            .then((url) => {
                this.setState({
                    downloadUrl: url
                })
            });
    }


    /**
     * 下载按钮
     * @description 如果是IE8 则弹出提示框 点击确认按钮才开始下载
     */
    downloadTrigger() {
        const { doc } = this.props;
        if (navigator.userAgent.match(/MSIE 8\.0/)) {
            this.prepareDownload();
        } else {
            download(pick(doc, ['link', 'password', 'docid', 'rev']));
        }
    }

    /**
     * 点击显示侧栏
     */
    toggleSidebar() {
        if (this.state.active) {
            this.setState({ active: false });
        } else {
            this.setState({ active: true });
        }
        return true;
    }

    /**
     * 全屏切换
     * @param fullScreen 
     */
    handleFullScreenChange(fullScreen) {
        this.setState({
            fullScreen
        })
    }
}