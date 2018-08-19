import * as React from 'react'

export const mountFlash = ({ name, flashPath, callback }) => ({
    __html:
        `<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="" id="${name}" width="100%" height="100%">
        <param name="movie" value="${flashPath}?inline=1" />
        <param name="quality" value="autohigh" />
        <param name="swliveconnect" value="true" />
        <param name="allowScriptAccess" value="always" />
        <param name="bgcolor" value="#0" />
        <param name="allowFullScreen" value="false" />
        <param name="wmode" value="transparent" />
        <param name="FlashVars" value="callback=${callback}" />
        <embed
            src="${flashPath}?inline=1"
            width="100%"
            height="100%"
            name="${name}"
            quality="autohigh"
            bgcolor="#0"
            align="middle"
            allowFullScreen="false"
            allowScriptAccess="always"
            type="application/x-shockwave-flash"
            swliveconnect="true"
            wmode="opaque"
            FlashVars="callback=${callback}"
            pluginspage="http://www.macromedia.com/go/getflashplayer"
        </embed>
    </object>`
})

interface FlashVideoProps {
    flashPath: string;
    src?: string;
    autoPlay?: boolean;
    muted: boolean;
    onManifestLoaded: any;
    onPositionChange: any;
    onEnded?: any;
    onPlay?: any;
    onPause?: any;
}

export default class FlashVideo extends React.Component<FlashVideoProps, any> {
    flashObject: any
    id: number = document.embeds.length
    name: string = `flashVideo${this.id}`
    callbackName: string = `flashVideoCallback${this.id}`
    volume: number = 0
    currentTime: number = 0

    componentDidMount() {
        window[this.callbackName] = this.callback.bind(this)
    }

    componentWillReceiveProps({ muted, src }) {
        if (typeof muted !== 'undefined') {
            if (this.flashObject) {
                this.flashObject.playerVolume(muted ? 0 : this.volume)
            }
        }

        if (src !== this.props.src) {
            this.load(src)
        }
    }

    componentWillMount() {
        window[this.callbackName] = null;
    }

    callback(eventName, args) {
        switch (eventName) {
            case 'ready':
                this.initPlayer()
                break
            case 'manifest':
                this.props.onManifestLoaded({
                    duration: this.flashObject.getDuration()
                })
                if (this.props.autoPlay) {
                    this.play(this.currentTime)
                }
                break
            case 'position':
                this.currentTime = args[0].position
                this.props.onPositionChange({ duration: args[0].duration, currentTime: args[0].position })
                break
            case 'complete':
                this.currentTime = 0
                this.props.onEnded()
                break
            default:
                break
        }
    }

    private initPlayer() {
        this.flashObject = document[this.name] || document.embeds[this.name]
        this.load(this.props.src)
    }

    public load(src) {
        this.flashObject.playerLoad(src)
    }

    public play(offset = 0) {
        this.props.onPlay()
        this.flashObject.playerPlay(offset)
    }

    public pause() {
        this.props.onPause()
        this.flashObject.playerPause()
    }

    public setPosition(offset) {
        this.play(offset)
    }

    public setVolume(volume) {
        this.volume = volume * 100
        this.flashObject.playerVolume(volume * 100)
    }
}