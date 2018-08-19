import * as React from 'react';
import Mask from '../Mask/ui.mobile';
import DialogBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class Dialog extends DialogBase {
    render() {
        return (
            <div>
                <Mask />
                <div
                    ref={ (container => this.container = container) }
                    className={ styles['container'] }
                    style={ { width: this.props.width } }>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}