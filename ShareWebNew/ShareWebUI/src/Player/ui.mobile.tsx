import * as React from 'react';
import * as classnames from 'classnames';
import {pick} from 'lodash';
import PlayerBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class Player extends PlayerBase {
    render() {
        return (
            <video
                ref="video"
                className={classnames('video-js vjs-default-skin vjs-big-play-centered', styles.controls) }
                style={pick(this.props, ['width', 'height']) }
                >
            </video>
        )
    }
}