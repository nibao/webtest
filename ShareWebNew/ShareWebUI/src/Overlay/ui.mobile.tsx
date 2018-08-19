import * as React from 'react';
import OverlayBase from './ui.base';
import * as classnames from 'classnames';
import * as styles from './styles.mobile.css';

export default class Overlay extends OverlayBase {
    render() {
        return (
            <div className={classnames(styles['overlay'], this.props.className)} ref="overlay" style={this.state.align}>
                {
                    this.props.children
                }
            </div>
        )
    }
}