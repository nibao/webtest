
import * as React from 'react';
import PDFPageBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class PDFPage extends PDFPageBase {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className={styles.pageContainer}>
                <canvas className={styles.pageCanvas} ref="canvas"></canvas>
            </div>
        )
    }
}