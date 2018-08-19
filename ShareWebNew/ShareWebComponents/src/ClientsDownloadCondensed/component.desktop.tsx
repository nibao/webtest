import * as React from 'react';
import * as classnames from 'classnames';
import { userAgent } from '../../util/browser/browser';
import QRCode from '../../ui/QRCode/ui.desktop';
import Title from '../../ui/Title/ui.desktop'
import { ClientTypes } from '../../core/clients/clients';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { WindowTitle } from '../../core/clients/clients';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import ClientsDownloadCondensedBase from './component.base';
import { clientIcon } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class ClientsDownloadCondensed extends ClientsDownloadCondensedBase {
    /**
     * 获取左边一列客户端包下载的个数,包括MAC, win standard, win advanced
     * 可能为0,1，2，3
     */
    private getClientNum(list: any) {
        return [ClientTypes.MAC, ClientTypes.WIN_32, ClientTypes.WIN_32_ADVANCED].reduce((prev, item) => {
            return list[item] ? prev + 1 : prev
        }, 0)
    }

    render() {
        const { list } = this.state;
        const WIN = userAgent().platform === 32 ? ClientTypes.WIN_32 : ClientTypes.WIN_64;
        const WIN_ADVANCED = userAgent().platform === 32 ? ClientTypes.WIN_32_ADVANCED : ClientTypes.WIN_64_ADVANCED;
        const host = location.origin ? location.origin : location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
        const clientDownloadNum = this.getClientNum(list)
        // 判断是否是windows xp系统
        const sUserAgent = navigator.userAgent
        const isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1
        // 如果是xp，使用windows旧客户端，否则使用windows新客户端
        const windowsClient = isWinXP ? WIN : WIN_ADVANCED

        return (
            <div className={styles['container']}>
                {
                    clientDownloadNum > 1 ?
                        <div className={styles['client-parent']}>
                            <UIIcon
                                code="\uf08a"
                                size={24}
                                color="#9e9e9e"
                                className={styles['icon-condensed']}
                            />
                            <div className={styles['client-children']}>
                                <div className={styles['client-wrap']} >
                                    <Title
                                        timeout={0}
                                        content={WindowTitle[isWinXP ? ClientTypes.WIN_32 : ClientTypes.WIN_32_ADVANCED]}
                                    >
                                        <UIIcon
                                            code={clientIcon(ClientTypes.WIN_32)}
                                            size={40}
                                            color="#747474"
                                            className={styles['clients']} />
                                        <span
                                            className={styles['title']}
                                            onClick={() => { this.downloadClient(windowsClient) }}
                                        >
                                            {__('下载Windows客户端')}
                                        </span>
                                    </Title>
                                </div>
                                {
                                    !!list[ClientTypes.MAC] && (
                                        <div className={styles['client-wrap']}>
                                            <UIIcon
                                                code={clientIcon(ClientTypes.MAC)}
                                                size={40}
                                                color="#747474"
                                                className={styles['clients']} />
                                            <span
                                                className={styles['title']}
                                                onClick={() => { this.downloadClient(ClientTypes.MAC) }}
                                            >
                                                {__('下载Mac客户端')}
                                            </span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        : (
                            clientDownloadNum === 1 ? (
                                [
                                    WIN,
                                    WIN_ADVANCED,
                                    ClientTypes.MAC
                                ].filter(type => this.state.list[type] === true).map(type => (
                                    <Title
                                        timeout={0}
                                        content={WindowTitle[type]}
                                    >
                                        <UIIcon
                                            code="\uf08a"
                                            size={24}
                                            color="#9e9e9e"
                                            className={styles['icon-condensed']}
                                            onClick={() => { this.downloadClient(type) }}
                                        />
                                    </Title>
                                ))
                            )
                                : null
                        )
                }
                {
                    list[ClientTypes.ANDROID] || list[ClientTypes.IOS] ? (
                        <div className={styles['client-parent']}>
                            <UIIcon
                                code="\uf08b"
                                size={24}
                                color="#9e9e9e"
                                className={styles['icon-condensed']}
                            />
                            <div className={classnames(styles['client-children'], styles['qrcode-wrap'])}>
                                <div className={styles['qrcode-padding']}>
                                    <div className={styles['qrcode']}>
                                        <QRCode cellSize={4} text={`${host}/#/mobileClient`} />
                                    </div>
                                </div>
                                <p className={styles['qrtitle']}>{__('扫描下载移动客户端')}</p>
                            </div>
                        </div>
                    ) : null
                }
                {
                    list[ClientTypes.OFFICE_PLUGIN] ?
                        <div className={styles['client-parent']}>
                            <UIIcon
                                className={styles['icon-condensed']}
                                code={clientIcon(ClientTypes.OFFICE_PLUGIN)}
                                title={__('下载office插件')}
                                titleClassName={styles['title-class']}
                                size={24}
                                color="#9e9e9e"
                                onClick={() => { this.downloadClient(ClientTypes.OFFICE_PLUGIN) }}
                            />
                        </div> : null
                }
            </div>
        )
    }
}
