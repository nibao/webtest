import * as React from 'react';

import ClientsDownloadBase from './component.base';
import Client from '../Client/component.desktop';
import { ClientTypes } from '../../core/clients/clients';
import { userAgent } from '../../util/browser/browser'
import * as styles from './styles.desktop.css';

export default class ClientsDownload extends ClientsDownloadBase {
    render() {
        // 判断是否是windows xp系统
        const sUserAgent = navigator.userAgent
        const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
        // 如果是xp，使用windows旧客户端，否则使用windows新客户端
        const windowsClient = isWinXP ? (userAgent().platform === 32 ? ClientTypes.WIN_32 : ClientTypes.WIN_64) : (userAgent().platform === 32 ? ClientTypes.WIN_32_ADVANCED : ClientTypes.WIN_64_ADVANCED)

        return (
            <div className={styles['container']}>
                {
                    [
                        windowsClient,
                        ClientTypes.MAC,
                        ClientTypes.IOS,
                        ClientTypes.ANDROID,
                        ClientTypes.OFFICE_PLUGIN,
                    ]
                        .filter(type => this.state.list[type] === true)
                        .map(type => (
                            <div className={styles['client']}>
                                <Client
                                    type={type}
                                    host={location.origin ? location.origin : location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')}
                                    onClientMiss={this.handleClientMiss.bind(this)}
                                    onClientClick={URL => this.props.onClientClick(URL)}
                                />
                            </div>
                        ))
                }
            </div>
        )
    }
}
