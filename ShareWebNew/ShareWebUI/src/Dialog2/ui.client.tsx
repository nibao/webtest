import * as React from 'react';
import DialogBase from './ui.base';
import * as styles from './styles.client.css';

export default class Dialog extends DialogBase {
    render() {
        return (
            <div
                className={ styles['dialog'] }
                ref={ (container => this.container = container) }
                style={ { width: this.props.width } }
            >
                {
                    this.props.children
                }
            </div>
        )
    }
}