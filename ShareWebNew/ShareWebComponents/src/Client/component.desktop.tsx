import * as React from 'react';
import * as classnames from 'classnames'
import UIIcon from '../../ui/UIIcon/ui.desktop';
import QRCode from '../../ui/QRCode/ui.desktop';
import Title from '../../ui/Title/ui.desktop'
import { clientName, WindowTitle, ClientTypes } from '../../core/clients/clients';
import ClientBase from './component.base';
import { clientIcon } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Client extends ClientBase {
    render() {
        let type = this.props.type;
        return (
            <Title
                timeout={0}
                content={WindowTitle[type]}
            >
                <div className={classnames(styles['client'], { [styles['office-plugin']]: type === ClientTypes.OFFICE_PLUGIN })}
                    onClick={this.downloadClient.bind(this)}
                >
                    <UIIcon
                        code={clientIcon(type)}
                        size={40}
                        color="#9e9e9e"
                        onClick={this.downloadClient.bind(this)}
                    />
                    <p className={styles['client-name']}>{clientName(type)}</p>
                    {
                        this.state.url ?
                            <div className={styles['qrcode-wrap']}>
                                <div className={styles['qrcode']}>
                                    <QRCode cellSize={4} text={this.state.url} />
                                </div>
                                <p className={styles['qrtitle']}>{__('扫描二维码下载')}</p>
                            </div> : ''
                    }
                </div>
            </Title>
        )
    }
}