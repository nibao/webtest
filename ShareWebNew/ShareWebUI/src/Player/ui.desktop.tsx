import * as React from 'react';
import {pick} from 'lodash';
import PlayerBase from './ui.base';

export default class Player extends PlayerBase {
    render() {
        return (
            <video
                ref="video"
                className="video-js vjs-default-skin vjs-big-play-centered"
                style={pick(this.props, ['width', 'height']) }
                >
            </video>
        )
    }
}