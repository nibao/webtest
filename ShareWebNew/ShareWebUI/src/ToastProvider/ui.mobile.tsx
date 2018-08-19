import * as React from 'react'
import ToastProviderBase from './ui.base'
import PopOver from '../PopOver/ui.desktop'
import Toast from '../Toast/ui.desktop'
import { PureComponent } from '../decorators'
import * as styles from './styles.desktop.css'

@PureComponent
class ShouldRerenderChildren extends React.Component<any, any>{
    render() {
        return this.props.children
    }
}

export default class ToastProvider extends ToastProviderBase {

    static childContextTypes = ToastProviderBase.childContextTypes

    render() {
        const { toasts } = this.state

        return (
            <div>
                <PopOver
                    open={!!toasts.length}
                    anchorOrigin={['center', 'bottom']}
                    targetOrigin={['center', window.screen.height * 0.2]}
                    freezable={false}
                    autoFix={false}
                    watch={!!toasts.length}
                >
                    {
                        toasts.map(([text, options], i) => (
                            <div
                                className={styles['container']}
                                onMouseEnter={this.stop.bind(this)}
                                onMouseLeave={this.start.bind(this)}
                            >
                                <Toast {...options} onClose={this.handleClose.bind(this, i)}>
                                    {text}
                                </Toast>
                            </div>
                        ))
                    }
                </PopOver>
                <ShouldRerenderChildren>
                    {this.props.children}
                </ShouldRerenderChildren>
            </div>
        )
    }
}