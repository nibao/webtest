import * as React from 'react';
import * as classnames from 'classnames';
import Icon from '../Icon/ui.mobile';
import LinkIconBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class LinkIcon extends LinkIconBase {
    render() {
        return (
            <a
                href="javascript:void(0)"
                className={classnames(styles.linkIcon, this.props.className, { [styles.disable]: this.props.disable })}
                onClick={this.clickHandler.bind(this)}
                style={{ width: this.props.size, height: this.props.size }}
                >
                <Icon
                    url={this.props.url}
                    size={this.props.size}
                    />
            </a>
        )
    }
}