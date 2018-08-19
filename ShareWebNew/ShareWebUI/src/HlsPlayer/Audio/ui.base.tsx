import * as React from 'react'

interface AudioProps {
    src?: string;
    autoPlay?: boolean;
    muted: boolean;
    onManifestLoaded: any;
    onPositionChange: any;
    onEnded?: any;
    onPlay?: any;
    onPause?: any;
}

export default class Audio extends React.Component<AudioProps, any>{

    player: HTMLAudioElement
    intervalId: number
    hls: any

    componentDidMount() {
        this.initPlayer()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.src !== this.props.src) {
            this.pause()
            this.load(nextProps.src)
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    initPlayer() {
        this.load(this.props.src)
    }

    public load(src) {
        if (this.hls) {
            this.hls.detachMedia()
            this.hls.destroy()
        }
        this.hls = new Hls()
        this.hls.loadSource(src)
        this.hls.attachMedia(this.player)
        return new Promise(resolve => {
            this.hls.on(Hls.Events.MANIFEST_PARSED, resolve)
        })
    }

    public play(currentTime = 0) {
        this.props.onPlay()
        this.player.play()
        const playStartHaldler = () => {
            this.player.currentTime = currentTime
            this.player.onplaying = null
            this.intervalId = setInterval(() => {
                this.props.onPositionChange({ duration: this.player.duration || 0, currentTime: this.player.currentTime })
                if (this.player.currentTime >= this.player.duration) {
                    clearInterval(this.intervalId)
                    this.props.onEnded()
                }
            }, 100)
        }
        this.player.onplaying = playStartHaldler
    }

    public pause() {
        this.props.onPause()
        this.player.pause()
        clearInterval(this.intervalId)
    }
}