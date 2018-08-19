import * as React from 'react';
import { noop } from 'lodash';
import { formatTime } from '../../util/formatters/formatters';
import { today } from '../../util/date/date';
import __ from './locale';

export default class ValidityBox2Base extends React.Component<Components.ValidityBox2.Props, Components.ValidityBox2.State> {
    static defaultProps = {
        onChange: noop,

        dropAlign: 'bottom left',

        allowPermanent: false,

        selectRange: [new Date()],

        defaultSelect: 30
    }

    state = {
        value: this.props.value
    }

    select = null

    deactivePrevented: boolean = false  // 是否选中了Menu区域

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
    }

    /**
     * 更新数据值
     * value 有效期长度，微秒单位
     */
    private updateValue(value: number, { active = false } = {}) {
        this.setState({ value, active });
        this.fireChangeEvent(value);
    }

    /**
     * 设定选中的日期
     * @param value 日期对象
     */
    protected setValidity(value: Date) {
        this.updateValue(value.getTime() * 1000);
    }

    /**
     * 切换勾选永久有效
     * @param permanent 是否勾选永久有效
     * @param permVal 用来表示永久有效的value值
     */
    protected switchPermanent(permanent: boolean, permVal: number): void {
        if (permanent) {
            this.updateValue(permVal);
        } else {
            let defaultDate = today().setDate(today().getDate() + this.props.defaultSelect);
            this.updateValue(defaultDate * 1000, { active: true });
        }
    }

    /**
     * 格式化选中值
     * @param date 选中的日期
     */
    protected validityFormatter(date: number): string {
        if (date === -1) {
            return __('永久有效');
        } else {
            return formatTime(date, 'yyyy-MM-dd')
        }
    }

    /**
     * 触发选中事件
     * @param value 日期微秒
     */
    private fireChangeEvent(value: number): void {
        this.props.onChange(value);
    }

    /**
     * 切换选中状态
     */
    protected toggleActive() {
        this.setState({
            active: !this.state.active
        })
    }

    protected onSelectBlur(e) {
        if (this.deactivePrevented) {
            // 当日期下拉出现时，select需要focuse
            this.select.focus();
        } else {
            this.setState({
                active: false
            })
        }

        this.deactivePrevented = false;
    }
}