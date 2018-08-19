import * as React from 'react';
import { render } from 'react-dom';

/**
 * 创建独立组件
 */
export function createStandaloneComponent(Component) {
    return function (props, dom) {
        const component = render(
            <Component {...props} />,
            dom
        );

        return component.destroy.bind(component);
    }
}

/**
 * 创建独立UI
 */
export function createStandaloneUI(UI) {
    return function (props, dom) {
        const component = render(
            <UI {...props} />,
            dom
        );
    }
}