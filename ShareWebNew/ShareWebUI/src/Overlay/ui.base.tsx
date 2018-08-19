/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import { assign } from 'lodash';

export default class OverlayBase extends React.Component<any, any> {
    static defaultProps = {
        position: ''
    }

    state = {
        align: {}
    }

    static contextTypes = {
        getContextWindow: React.PropTypes.func
    }

    getContextWindow = typeof this.context.getContextWindow === 'function' ? this.context.getContextWindow : () => window

    componentDidMount() {
        if (this.props.position) {
            this.setState({
                align: this.align()
            });
        }
    }

    align() {
        const document = (this.getContextWindow() || window).document

        return this.props.position.split(/\s+/).reduce((align, key, i) => {
            switch (key) {
                case 'top':
                    return assign(align, { top: 0 });

                case 'right':
                    return assign(align, { right: 0 });

                case 'bottom':
                    return assign(align, { bottom: 0 });

                case 'left':
                    return assign(align, { left: 0 });

                case 'middle':
                    return assign(align, { top: (document.documentElement.clientHeight - this.refs.overlay.clientHeight) / 2 });

                case 'center':
                    return assign(align, { left: (document.documentElement.clientWidth - this.refs.overlay.clientWidth) / 2 });

                default:
                    if (i === 0) {
                        return assign(align, { left: key });
                    } else if (i === 1) {
                        return assign(align, { top: key });
                    }
            }
        }, { position: 'fixed' })
    }
}