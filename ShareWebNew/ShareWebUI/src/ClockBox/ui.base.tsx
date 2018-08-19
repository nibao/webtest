import * as React from 'react';
import { noop, merge, mapValues } from 'lodash';
import { shallowEqual } from '../../util/accessor/accessor';
import { clock } from '../../util/date/date';
import { PureComponent } from '../decorators';

@PureComponent
export default class ClockBoxBase extends React.Component<any, any> {
    static defaultProps = {
        onChange: noop
    }

    constructor(props, context) {
        super(props, context);
        this.triggerChange = this.triggerChange.bind(this);
    }

    state = {
        hours: '',
        minutes: '',
        seconds: ''
    }

    componentWillMount() {
        if (this.props.seconds) {
            this.setState(merge({}, clock(this.props.seconds)))
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!shallowEqual(nextProps.seconds, this.props.seconds)) {
            this.triggerChange(clock(nextProps.seconds));
        }
    }

    /**
     * 触发时间改变
     */
    triggerChange(time) {
        this.setState(merge({}, this.props.state, time), () => {
            const totalSeconds = Number(this.state.hours) * 3600 + Number(this.state.minutes) * 60 + Number(this.state.seconds);
            this.props.onChange(totalSeconds);
        });
    }
}