import * as React from 'react'
import AudioBase from './ui.base'

export default class Audio extends AudioBase {

    render() {
        let { muted } = this.props
        return (
            <audio
                style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
                controls={true}
                muted={muted}
                ref={audio => this.player = audio}
            >
            </audio>
        )
    }
}