import * as React from 'react'
import * as classnames from 'classnames'
import HlsPlayerBase from './ui.base'
import Video from './Video/ui.desktop'
import FlashVideo from './FlashVideo/ui.desktop'
import Controls from './Controls/ui.desktop'
import * as styles from './styles.desktop.css'

class HlsPlayer extends HlsPlayerBase {
    render() {
        let { width = 300, height = 150, src, autoPlay, type } = this.props,
            { muted, paused, volume, duration, currentTime, fullScreen, ended } = this.state

        return (
            <div style={
                fullScreen ?
                    { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 } :
                    { position: 'relative', display: 'inline-block', width, height }
            }
                ref={container => this.container = container}
                onMouseMove={this.showControls.bind(this)}
            >

                <div className={classnames({
                    [styles['video']]: type === 'video',
                    [styles['audio']]: type === 'audio',
                })}>
                    {
                        this.props.src ?
                            this.isHlsSupported && !this.props.flash ?
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
                                /> :
                                <FlashVideo
                                    flashPath={this.props.swf}
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
                <div>
                    {
                        this.props.controls ? (
                            <Controls
                                style={{ display: (type === 'audio' || this.state.showControls) ? 'block' : 'none' }}
                                paused={paused}
                                ended={ended}
                                duration={duration}
                                currentTime={currentTime}
                                muted={muted}
                                volume={volume}
                                fullScreen={fullScreen}
                                onPause={this.pause.bind(this)}
                                onPlay={this.play.bind(this)}
                                onSetPosition={this.setPosition.bind(this)}
                                onMute={this.handleMute.bind(this)}
                                onSetVolume={this.setVolume.bind(this)}
                                onToggleFullScreen={this.handleToggleFullScreen.bind(this)}
                            />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

export default HlsPlayer