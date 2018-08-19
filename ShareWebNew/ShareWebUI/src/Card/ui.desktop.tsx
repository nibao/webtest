import * as React from 'react';
import * as classnames from 'classnames';
import CardBase from './ui.base';
import * as styles from './styles.desktop';


export default class Card extends CardBase {
    render() {
        return (
            <div
                className={classnames(styles['card'], this.props.className)}
                style={{ 'width': this.state.width, 'height': this.state.height }}
            >
                {
                    this.props.children
                }
            </div>
        )
    }
}
