import * as React from 'react';
import { noop, isFunction } from 'lodash';
import { PureComponent } from '../decorators';
import __ from './locale';


export enum Validator {
    // 正常
    Ok,

    // 文本框为空
    NoValue,

    // 最大错误次数
    MaxValue,

    // 最小错误次数
    MinValue
}

@PureComponent
export default class NumberBoxBase extends React.Component<UI.NumberBox.Props, UI.NumberBox.State> {
    static defaultProps = {
        disabled: false,

        validator: (_value) => true,

        autoFocus: false,

        value: '0',

        step: 1,

        onFocus: noop,

        onBlur: noop,

        onChange: noop,

        onEnter: noop,

        onClick: noop,

        onKeyDown: noop,
    }


    timer: number | undefined;

    interval: number | undefined;

    state: UI.NumberBox.State = {
        value: String(this.props.value),
        validateState: Validator.Ok,
        validateMessages: {
            [Validator.NoValue]: __('此输入项不能为空。'),
            [Validator.MaxValue]: this.props.ValidatorMessage && this.props.ValidatorMessage.max ? this.props.ValidatorMessage.max : '',
            [Validator.MinValue]: this.props.ValidatorMessage && this.props.ValidatorMessage.min ? this.props.ValidatorMessage.min : ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            })
        }
        if (this.state.validateState !== Validator.Ok) {
            this.setState({
                validateState: Validator.Ok
            })
        }
    }

    /**
     * 增加
     */
    private changeValue(step) {
        this.setState({
            value: String(Number(this.state.value) + step)
        })

    }

    /**
     * 增加 按下事件
     */
    protected addValue() {
        if (this.state.validateState !== Validator.Ok) {
            this.setState({
                validateState: Validator.Ok
            })
        }
        if (this.props.max !== undefined && Number(this.state.value) < this.props.max && !this.props.disabled) {
            this.setTimer(this.props.step);
            this.changeValue(this.props.step);
            this.props.onChange(Number(this.state.value));
        }
    }

    /**
     * 减少 鼠标按下事件
     */
    protected subValue() {
        if (this.state.validateState !== Validator.Ok) {
            this.setState({
                validateState: Validator.Ok
            })
        }
        if (this.props.min !== undefined && this.props.min < Number(this.state.value) && !this.props.disabled) {
            this.setTimer(this.props.step * -1)
            this.changeValue(this.props.step * -1);
            this.props.onChange(Number(this.state.value));
        }
    }


    /**
     * 循环增加或减少
     * @param step 步进 
     */
    private setTimer(step: number | undefined) {
        this.timer = setTimeout(() => {
            this.interval = setInterval(() => {
                this.timer = undefined;
                if (step > 0 && this.props.max !== undefined && Number(this.state.value) < this.props.max) {
                    this.changeValue(step);
                } else if (step < 0 && this.props.min !== undefined && this.props.min < Number(this.state.value)) {
                    this.changeValue(step);
                } else {
                    this.clearTimer()
                }
            }, 100)
        }, 500)
    }



    /**
     * 结束增加或减少
     */
    protected clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.props.onChange(Number(this.state.value));
        }
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined;
            this.props.onChange(Number(this.state.value));
        }
    }


    /**
     * 文本框输入
     */
    protected handleChange(value: string) {
        if (value === '') {
            this.setState({
                validateState: Validator.NoValue
            })
        } else if (this.state.validateState !== Validator.Ok) {
            this.setState({
                validateState: Validator.Ok
            })
        }
        if (this.props.max && Number(value) > this.props.max) {
            this.setState({
                value: String(this.props.max)
            })
            if (this.props.ValidatorMessage && this.props.ValidatorMessage.max) {
                this.setState({
                    validateState: Validator.MaxValue
                })
            }
            this.props.onChange(this.props.max);
        } else if (this.props.min && Number(value) < this.props.min) {
            this.setState({
                value: String(this.props.min)
            })
            if (this.props.ValidatorMessage && this.props.ValidatorMessage.min) {
                this.setState({
                    validateState: Validator.MinValue
                })
            }
            this.props.onChange(this.props.min);
        } else {
            this.setState({
                value: value
            })
            this.props.onChange(value);
        }
    }

}