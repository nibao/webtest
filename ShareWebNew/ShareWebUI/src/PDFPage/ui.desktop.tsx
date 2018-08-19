
import * as React from 'react';
import PDFPageBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class PDFPage extends PDFPageBase {
    render() {
        return (
            <div className={styles.pageContainer}>
                <canvas className={styles.pageCanvas} ref="canvas"></canvas>
            </div>
        )
    }
}