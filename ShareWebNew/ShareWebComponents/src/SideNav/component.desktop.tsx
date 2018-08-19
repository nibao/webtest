import * as React from 'react'
import * as classnames from 'classnames'
import RouteLink from '../RouteLink/ui.desktop'
import { isBrowser, Browser, useHTTPS } from '../../util/browser/browser';
import { UIIcon, Badge } from '../../ui/ui.desktop'
import { ClassName } from '../../ui/helper'
import SideNavBase from './component.base'
import ClientsDownloadCondensed from '../ClientsDownloadCondensed/component.desktop'
import * as styles from './styles.desktop.css'


// IE8/IE9 在HTTPS下不支持 @font-face，使用fallback图片代替，同时设置字体颜色为#505050
const FALLBACKED = isBrowser({ app: Browser.MSIE, version: 8 }) || (useHTTPS() && isBrowser({ app: Browser.MSIE, version: 9 }));

export default class SideNav extends SideNavBase {

    render() {
        const { nav } = this.props
        const { specificMsgNum, auditNum } = this.state
        return (
            <div className={styles['side-bar']}>
                <ul className={styles['nav']}>
                    {
                        nav.map(({ label, path, icon }) => (
                            <li className={styles['nav-item']}>
                                <RouteLink
                                    className={classnames(styles['nav-link'], { [styles['fallbacked']]: FALLBACKED })}
                                    activeClassName={classnames(styles['active'], ClassName.BorderLeftColor)}
                                    to={path}
                                    disableWhenActived={true}
                                >
                                    <UIIcon size="18px" code={icon} className={styles['icon']} />
                                    {label}
                                </RouteLink>
                                {
                                    path === '/home/message/share' && specificMsgNum.shareMsgNum !== 0
                                        ?
                                        <div
                                            className={styles['number-icon']}
                                        >
                                            <Badge
                                                count={specificMsgNum.shareMsgNum}
                                            />
                                        </div> : null
                                }
                                {
                                    path === '/home/message/review' && specificMsgNum.checkMsgNum !== 0
                                        ?
                                        <div
                                            className={styles['number-icon']}
                                        >
                                            <Badge
                                                count={specificMsgNum.checkMsgNum}
                                            />
                                        </div> : null
                                }
                                {
                                    path === '/home/message/security' && specificMsgNum.securityMsgNum !== 0
                                        ?
                                        <div
                                            className={styles['number-icon']}
                                        >
                                            <Badge
                                                count={specificMsgNum.securityMsgNum}
                                            />
                                        </div> : null
                                }
                                {
                                    path === '/home/approvals/share-review' && auditNum.shareApv !== 0
                                        ?
                                        <div className={styles['number-icon']}>
                                            <Badge
                                                count={auditNum.shareApv}
                                            />
                                        </div>
                                        : null
                                }

                            </li>
                        ))
                    }
                </ul>

                <div className={styles['clients-download']}>
                    <ClientsDownloadCondensed
                        doClientDownload={(URL) => { location.assign(URL) }}
                    />
                </div>
            </div>
        )

    }

}


