import * as React from 'react';
import * as classnames from 'classnames';
import TabsMainBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class TabsMain extends TabsMainBase {
    render() {
        return (
            <div className={classnames(styles['main'], this.props.className)}>
                {
                    React.Children.map(this.props.children, (Content, i) => this.props.activeIndex === i ? Content : null)
                }
            </div>
        )
    }
}