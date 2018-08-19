import * as React from 'react'
import Video from './Video/ui.desktop'
import FlashVideo from './FlashVideo/ui.desktop'

interface HlsPlayerProps {
    src: string;

    type: 'video' | 'audio';

    /**
     * 是否使用Flash播放
     */
    flash?: boolean;

    swf?: string;

    width?: string | number;

    height?: string | number;

    controls?: boolean;

    autoPlay?: boolean;

    onFullScreenChange?: (fullScreen: boolean) => any
}

export default class HlsPlayer extends React.Component<HlsPlayerProps, any>{

    static defaultProps = {
        flash: false
    }

    isHlsSupported = typeof Hls === 'function' && Hls.isSupported()
    player: Video | FlashVideo
    container: HTMLDivElement
    hideControlTimeoutId = 0

    state = {
        paused: true,
        muted: false,
        volume: 0.3,
        duration: 0,
        currentTime: 0,
        fullScreen: false,
        showControls: false,
        ended: false
    }

    componentDidMount() {
        this.showControls()
    }

    public pause() {
        this.player.pause()
    }

    public play(currentTime = 0) {
        this.player.play(currentTime)
        this.setState({
            ended: false
        })
    }

    handlePause() {
        this.setState({
            paused: true
        })
    }

    handlePlay() {
        this.setState({
            paused: false
        })
    }

    public setPosition(currentTime) {
        this.setState({
            currentTime
        })
        this.player.setPosition(currentTime)
    }

    handleMute() {
        this.mute(!this.state.muted)
    }

    public mute(muted) {
        this.setState({
            muted
        })
    }

    public setVolume(volume) {
        this.setState({
            volume
        })
        this.player.setVolume(volume)
    }

    public requestFullScreen() {
        const requestFullScreen = this.container['requestFullscreen'] || this.container['webkitRequestFullScreen'] || this.container['mozRequestFullScreen'] || this.container['msRequestFullscreen']
        requestFullScreen && requestFullScreen.bind(this.container)()
        this.setState({
            fullScreen: true
        }, () => {
            if (typeof this.props.onFullScreenChange === 'function') {
                this.props.onFullScreenChange(this.state.fullScreen)
            }
        })
    }

    public exitFullScreen() {
        const exitFullScreen = document['exitFullscreen'] || document["webkitExitFullscreen"] || document['mozCancelFullScreen'] || document['msExitFullscreen']
        exitFullScreen && exitFullScreen.bind(document)()
        this.setState({
            fullScreen: false
        }, () => {
            if (typeof this.props.onFullScreenChange === 'function') {
                this.props.onFullScreenChange(this.state.fullScreen)
            }
        })
    }

    handleToggleFullScreen() {
        let { fullScreen } = this.state
        if (fullScreen) {
            this.exitFullScreen()
        } else {
            this.requestFullScreen()
        }
    }

    handleManifestLoaded({ duration }) {
        this.setState({
            duration
        })
        this.player.setVolume(this.state.volume)
    }

    handlePositionChange({ duration, currentTime }) {
        this.setState({
            duration,
            currentTime
        })
    }

    handleEnded() {
        this.setState({
            paused: true,
            ended: true
        })
    }

    showControls() {
        clearTimeout(this.hideControlTimeoutId)
        this.setState({
            showControls: true
        })
        this.hideControlTimeoutId = setTimeout(() => {
            this.setState({
                showControls: false
            })
        }, 5000)
    }
}