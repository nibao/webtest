import * as React from 'react';
import ToastProvider from '../ToastProvider/ui.desktop'

export default class NWProvider extends React.Component<UI.NWProvider.Props, any> {

    static defaultProps = {
        window: window
    }

    static childContextTypes = {
        getContextWindow: React.PropTypes.any
    }

    getChildContext() {
        return {
            getContextWindow: () => this.props.window
        }
    }

    render() {
        return (
            <ToastProvider>
                {this.props.children}
            </ToastProvider>
        )
    }
}