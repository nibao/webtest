import * as React from 'react';
import { noop } from 'lodash';
import { Dialog2 as Dialog, Panel, QRCode } from '../../../../ui/ui.desktop';
import __ from './locale';
import * as styles from './styles.view.css';

export default function ViewQRConfig({ machineCode, onViewQRCancel = noop }) {

    return (
        <Dialog title={__('查看机器码')} onClose={onViewQRCancel}>
            <Panel>
                <Panel.Main>
                    <div className={styles['qrcode-text']}>
                        {__('机器码：')}
                        <span className={styles['machine-code']}>{machineCode}</span>
                    </div>
                    <div className={styles['qrcode-item']}>
                        <QRCode text={machineCode} cellSize={8} />
                    </div>
                    <div className={styles['qrcode-text']}>
                        {__('手机扫一扫获取机器码')}
                    </div>
                </Panel.Main>
            </Panel>
        </Dialog>
    )
}