import * as React from 'react'
import VideoBase from './ui.base'

export default class Video extends VideoBase {

    render() {
        let { muted } = this.props
        return (
            <video
                style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
                controls={true}
                muted={muted}
                ref={video => this.player = video}
            >
            </video>
        )
    }
}