import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { shallowEqual } from '../util/accessor/accessor';

/**
 * 利用shouldComponentUpdate Hook，对props和state更新做一次浅比较，用于提升性能
 * props和state中的成员必须为不可变对象，或避免直接对其属性进行操作。
 * @param constructor 类构造函数
 */
export function PureComponent(constructor: Function) {
    constructor.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
    }
}

/**
 * NWWindow 内的组件获取 contextWindow
 * @param constructor 
 */
export function getContextWindow<T extends { new(...args: any[]): React.Component }>(constructor: T) {

    return class extends constructor {
        static contextTypes = { ...(constructor.contextTypes || {}), getContextWindow: React.PropTypes.func }

        getContextWindow() {
            if (this.context && typeof this.context.getContextWindow === 'function') {
                return this.context.getContextWindow() || window
            }
            return window
        }
    }
}

/**
 * 添加 destroy 方法
 * @param constructor 
 */
export function webcomponent<T extends { new(...args: any[]): React.Component }>(constructor: T) {
    return class extends constructor {
        destroy() {
            if ((typeof this.props.beforeDestroy !== 'function') || this.props.beforeDestroy() !== false) {
                const dom = ReactDOM.findDOMNode(this);
                const container = dom ? dom.parentNode : null;

                if (typeof this.componentWillUnmount === 'function') {
                    this.componentWillUnmount();
                }

                if (container) {
                    ReactDOM.unmountComponentAtNode(container);
                }
            }
        }
    }
}