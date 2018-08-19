import * as React from 'react';
import { noop, isFunction } from 'lodash';
import { PureComponent } from '../decorators';

@PureComponent
export default class DateBoxBase extends React.Component<UI.DateBox.Props, UI.DateBox.State> implements UI.DateBox.Component {
    static defaultProps = {
        active: false,

        format: 'yyyy-MM-dd',

        dropAlign: 'bottom left',

        onChange: noop,

        selectRange: [],

        shouldShowblankStatus: false,

        startsFromZero: false,

        onDatePickerClick: noop
    }

    state = {
        value: this.props.value || new Date(),

        active: this.props.active,
    }

    componentWillReceiveProps({ value }) {
        if (value !== this.props.value) {
            this.updateDate(value);
        }
    }

    /**
     * 更新选中日期
     * @param value 日期对象
     */
    private updateDate(value: Date) {
        this.setState({
            value,
            active: false
        });

        this.fireChangeEvent(value);
    }

    /**
     * 选中日期时触发
     * @param value 日期对象
     */
    private fireChangeEvent(value: Date) {
        isFunction(this.props.onChange) && this.props.onChange(value);
    }

    /**
     * 从日历中选择日期
     * @param value 日期对象
     */
    protected select(value) {
        this.updateDate(value);
    }
}