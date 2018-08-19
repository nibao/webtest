import * as React from 'react'
import { noop } from 'lodash'
import { bindEvent, unbindEvent } from '../../util/browser/browser'
import { getContextWindow } from '../decorators';

function getElementPosition(element) {
    let left = element.offsetLeft,
        top = element.offsetTop
    if (element.offsetParent !== null) {
        left = left + getElementPosition(element.offsetParent).left
        top = top + getElementPosition(element.offsetParent).top
    }
    return { left, top }
}

interface SliderProps {
    axis?: 'x' | 'y';
    max?: number;
    min?: number;
    step?: number;
    value: number;
    size?: number;
    length?: number | string;
    thickness?: number | string;
    backgroundColor?: string;
    foregroundColor?: string;
    onChange?: (newValue: number) => any;
    onDragEnd?: (value: number) => any;
    className?: string;
}

@getContextWindow
export default class SliderBase extends React.Component<SliderProps, any>{

    container: HTMLDivElement

    dragging = false

    static defaultProps = {
        axis: 'x',
        max: 100,
        min: 0,
        step: 1,
        value: 0,
        length: 300,
        size: 4,
        backgroundColor: '#fff',
        foregroundColor: '#aaa',
        onChange: noop
    }


    componentDidMount() {
        const document = this.getContextWindow().document;
        bindEvent(document, 'mouseup', this.handleExitSlide)
        bindEvent(document, 'mousemove', this.handleSlide)
    }

    componentWillUmount() {
        const document = this.getContextWindow().document;
        unbindEvent(document, 'mouseup', this.handleExitSlide)
        unbindEvent(document, 'mousemove', this.handleSlide)
    }

    handleExitSlide = e => {
        if (this.dragging) {
            this.dragging = false;
            if (this.props.onDragEnd) {
                this.props.onDragEnd(this.props.value);
            }
        }
    }

    handleSlide = e => {
        if (this.dragging) {
            let { max, min, axis } = this.props,
                { clientX, clientY } = e,
                containerPos = getElementPosition(this.container),
                offsetX = clientX - containerPos.left,
                offsetY = containerPos.top + this.container.offsetHeight - clientY,
                newValue = axis === 'x' ?
                    offsetX / this.container.offsetWidth * (max - min) + min :
                    offsetY / this.container.offsetHeight * (max - min) + min
            if (newValue <= max && newValue >= min) {
                this.props.onChange(newValue)
            }
        }
    }

    handleMouseDown(e) {
        this.dragging = true
        this.handleSlide(e)
        e.preventDefault();
        e.stopPropagation();
    }
}
