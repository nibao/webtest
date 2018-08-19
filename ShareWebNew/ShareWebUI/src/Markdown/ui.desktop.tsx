import * as React from 'react';
import MarkdownBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class Markdown extends MarkdownBase {
    render() {
        return (
            <div className={styles['markdown']} dangerouslySetInnerHTML={{ __html: this.props.children }}></div>
        )
    }
}