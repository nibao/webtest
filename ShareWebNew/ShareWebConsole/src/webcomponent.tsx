/// <reference path="./webcomponent.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isFunction } from 'lodash';

export default class WebComponent<P extends Components.WebComponent.Props, T> extends React.Component<P, T> {
    /**
     * 销毁组件
     */
    destroy() {
        if (!isFunction(this.props.beforeDestroy) || this.props.beforeDestroy() !== false) {
            const dom = ReactDOM.findDOMNode(this);
            const container = dom ? dom.parentNode : null;

            if (isFunction(this.componentWillUnmount)) {
                this.componentWillUnmount();
            }

            if (container) {
                ReactDOM.unmountComponentAtNode(container);
            }
        }
    }
}