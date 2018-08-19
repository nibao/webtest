import * as React from 'react';
import * as classnames from 'classnames';
import QRCodeBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class QRCode extends QRCodeBase {
    render() {
        const { cellSize } = this.props;
        return (
            <div className={styles['qr']}>
                {
                    this.state.modules.map(row => {
                        return (
                            <div
                                style={{ height: cellSize, width: cellSize * row.length }}
                                className={styles['row']}>
                                {
                                    row.map(cell => {
                                        return (
                                            <div
                                                style={{ width: cellSize, height: cellSize }}
                                                className={classnames({ [styles['fill']]: cell === true }, styles['cell'])}>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}