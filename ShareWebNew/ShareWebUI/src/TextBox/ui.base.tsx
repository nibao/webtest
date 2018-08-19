import * as React from 'react';
import { noop } from 'lodash';

export default class TextBoxBase extends React.Component<UI.TextBox.Props, UI.TextBox.State> implements UI.TextBox.Element {
    static defaultProps = {
        onFocus: noop,

        onBlur: noop,
    }

    state = {
        focus: false
    }

    /**
     * 聚焦文本框
     * @param event 事件对象
     */
    focus(event) {
        this.setState({ focus: true });
        this.props.onFocus(event);
    }

    /**
     * 失焦文本框
     * @param event 事件对象
     */
    blur(event) {
        this.setState({ focus: false });
        this.props.onBlur(event);
    }
}