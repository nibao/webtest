/// <reference path="./ui.base.d.ts" />

import * as React from 'react';
import { render } from 'react-dom'

export default class StarBase extends React.Component<any, any> {

    static defaultProps = {
        score: 0
    }

    state = {
        score: this.props.score
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            score: nextProps.score
        })
    }

    handleMouseEnter(score) {
        this.setState({
            score
        })
    }

    handleMouseLeave() {
        this.setState({
            score: this.props.score
        })
    }
} 