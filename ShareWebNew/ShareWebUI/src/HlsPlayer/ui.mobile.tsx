import * as React from 'react'
import * as classnames from 'classnames'
import HlsPlayerBase from './ui.base'
import Audio from './Audio/ui.mobile'
import Video from './Video/ui.mobile'
import * as styles from './styles.mobile.css'

class HlsPlayer extends HlsPlayerBase {
    render() {
        let { width = '100%', height = '100%', src, autoPlay, type } = this.props,
            { muted, fullScreen } = this.state

        return (
            <div style={
                fullScreen ?
                    { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 } :
                    { position: 'relative', display: 'inline-block', width, height }
            }
                ref={container => this.container = container}
            >

                <div className={classnames({
                    [styles['video']]: type === 'video',
                    [styles['audio']]: type === 'audio',
                })}>
                    {
                        this.props.src ?
                            type === 'audio' ?
                                <Audio
                                    ref={player => this.player = player}
                                    autoPlay={autoPlay}
                                    src={src}
                                    muted={muted}
                                    onManifestLoaded={this.handleManifestLoaded.bind(this)}
                                    onPositionChange={this.handlePositionChange.bind(this)}
                                    onEnded={this.handleEnded.bind(this)}
                                    onPlay={this.handlePlay.bind(this)}
                                    onPause={this.handlePause.bind(this)}
                                /> :
                                <Video
                                    ref={player => this.player = player}
                                    autoPlay={autoPlay}
                                    src={src}
                                    muted={muted}
                                    onManifestLoaded={this.handleManifestLoaded.bind(this)}
                                    onPositionChange={this.handlePositionChange.bind(this)}
                                    onEnded={this.handleEnded.bind(this)}
                                    onPlay={this.handlePlay.bind(this)}
                                    onPause={this.handlePause.bind(this)}
                                />
                            : null
                    }
                </div>
            </div>
        )
    }
}

export default HlsPlayer