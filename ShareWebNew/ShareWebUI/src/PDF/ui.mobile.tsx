import * as React from 'react';
import PDFPage from '../PDFPage/ui.mobile';
import LazyLoader from '../LazyLoader/ui.mobile';
import PDFBase from './ui.base';
import PDFNav from '../PDFNav/ui.mobile'
import * as styles from './style.mobile.css';

export default class PDF extends PDFBase {
    render() {
        const { pageIndex } = this.state;
        return (
            <div>
                <div className={styles.container} ref="container">
                    <div style={{ width: this.props.width * this.state.zoom + 'px' }}>
                        {
                            this.state.pages.length
                                ? <PDFPage
                                    key={`page-${pageIndex}:scale-${this.state.pages[pageIndex].viewport.scale}`}
                                    data={this.state.pages[pageIndex]}
                                    watermark={this.state.watermark}
                                />
                                : null
                        }
                    </div>
                </div>
                <PDFNav
                    onPageChange={this.go.bind(this)}
                    current={this.state.pageIndex}
                    onZoom={this.zoom.bind(this)}
                    limit={this.state.pages.length}
                    start={1}
                    end={10}
                    init={1}
                    step={0.5}
                />
            </div>
        )
    }
}