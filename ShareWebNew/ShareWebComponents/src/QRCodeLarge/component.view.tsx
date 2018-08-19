import * as React from 'react';
import Panel from '../../ui/Panel/ui.desktop';
import QRCode from '../../ui/QRCode/ui.desktop';
import QRCodeLargeBase from './component.base';
import * as styles from './styles.desktop.css';

export default class QRCodeLargeView extends QRCodeLargeBase {
    render() {
        return (
            <Panel>
                <Panel.Main>
                    <div className={styles['fullimage']}>
                        <QRCode
                            text={this.props.text}
                            cellSize={8}
                        />
                    </div>
                </Panel.Main>
            </Panel>
        )
    }
}