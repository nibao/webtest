import * as React from 'react';
import * as classnames from 'classnames';
import TabsContentBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class TabsContent extends TabsContentBase {
    render() {
        return (
            <div className={classnames(styles['content'], this.props.className)}>
                {
                    this.props.children
                }
            </div>
        )
    }
}