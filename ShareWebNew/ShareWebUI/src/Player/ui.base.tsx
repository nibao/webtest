/// <reference path="../../../typings/index.d.ts" />
/// <reference path="./ui.base.d.ts" />

import {Component} from 'react';

export default class PlayerBase extends Component<UI.Player.Props, any> implements UI.Player.Base {
    constructor(props) {
        super(props)
    }

    static defaultProps = {
        src: '',

        width: 480,

        height: 320
    }

    player = null

    componentDidMount() {
        if (this.props.src) {
            this.play(this.props.src);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.src && nextProps.src !== this.props.src) {
            this.play(nextProps.src, { restart: false });
        }
    }

    initPlayer() {
        this.player = videojs(this.refs.video, {
            techOrder: ['html5', 'flash'],
            controls: true
        });
    }

    pause() {
        this.player.pause();
    }

    play(src: string, {restart = true} = {}) {
        if (!this.player) {
            this.initPlayer();
        }

        const currentTime = this.player.currentTime();

        this.player.src({
            src,
            type: 'application/x-mpegURL'
        });

        this.player.on('loadstart', () => {
            this.player.play();

            if (!restart) {
                this.player.currentTime(currentTime);
            }
        });
    }
}