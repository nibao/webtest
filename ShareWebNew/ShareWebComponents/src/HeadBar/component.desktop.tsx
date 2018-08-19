import * as React from 'react';
import * as classnames from 'classnames';
import session from '../../util/session/session';
import AccountDropMenu from '../AccountDropMenu/component.desktop';
import LanguageSwitch from '../LanguageSwitch/component.desktop';
import HeadBarBase from './component.base';
import RouteLink from '../RouteLink/ui.desktop';
import { getErrorMessage } from '../../core/errcode/errcode';
import { AppBar, Badge } from '../../ui/ui.desktop';
import { ClassName } from '../../ui/helper';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import HelpDropMenu from '../HelpDropMenu/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class HeadBar extends HeadBarBase {
    render() {
        const { nav, link } = this.props
        const { msgNum, auditNum, helper, FAQ } = this.state

        return (
            <AppBar style={{ backgroundImage: `url(data:image/png;base64,${this.state.logo})` }}>
                <div className={styles['wrapper']}>
                    <ul className={styles['nav']}>
                        {
                            nav.map(({ label, path }) => (
                                <li className={styles['nav-item']}>
                                    <RouteLink
                                        className={classnames(styles['nav-link'], ClassName.Color__Hover)}
                                        activeClassName={classnames(styles['active'], ClassName.Color, ClassName.BorderBottomColor)}
                                        to={path}
                                        disableWhenActived={true}
                                    >
                                        <span className={styles['nav-label']}>
                                            {label}
                                            {
                                                path === '/home/message' && msgNum !== 0
                                                    ?
                                                    <div className={styles['number-icon']}>
                                                        <Badge
                                                            count={msgNum}
                                                        />
                                                    </div>
                                                    : null
                                            }
                                            {
                                                path === '/home/approvals' && auditNum !== 0
                                                    ?
                                                    <div className={styles['number-icon']}>
                                                        <Badge
                                                            count={auditNum}
                                                        />
                                                    </div>
                                                    : null
                                            }
                                        </span>
                                    </RouteLink>
                                </li>
                            ))
                        }
                    </ul>
                    <ul className={styles['right']}>
                        {
                            this.state.superChart && session.get('login') ? (
                                <li
                                    className={classnames(styles['right-item'], styles['super-chart'])}
                                    onClick={this.handleSuperChart.bind(this)}
                                >
                                    {__('在线表格')}
                                </li>
                            ) : null
                        }
                        {
                            !session.get('login') && this.state.userAgreementConfig && !link ? 
                                <li 
                                    className={classnames(styles['right-item'], styles['user-agreement'])}
                                    onClick={() => { this.openAgreement('#/useragreement') }}
                                >
                                    {__('用户协议')}
                                </li>
                                : null
                        }
                        {
                            !session.get('login') && !link && (helper || FAQ) ?
                                <li className={styles['right-item']}>
                                    <HelpDropMenu  
                                        OEMHelper={helper}
                                        OEMFAQ={FAQ}
                                    />
                                </li>
                                : null
                        }
                        <li className={styles['right-item']}>
                            <LanguageSwitch
                                onSelectLanguage={(lang) => { this.handleSetLanguage(lang) }}
                            />
                        </li>
                        {
                            session.get('login') ?
                                <li className={styles['right-item']}>
                                    <AccountDropMenu
                                        link={this.props.link}
                                        doLogout={(url) => { this.logoutSuccess(url) }}
                                        doChangePassword={(url) => { this.props.doChangePassword(url) }}
                                        doOpenConsole={(url) => { this.openConsole(url) }}
                                        doOpenClient={(host) => { this.openClient(host) }}
                                        doEnterDisk={this.props.doEnterDisk}
                                        doOpenAgreement={(url) => { this.openAgreement(url) }}
                                    />
                                </li>
                                : null
                        }
                    </ul>
                </div>
                {
                    this.state.errcode ?
                        <MessageDialog onConfirm={this.handleErrorConfirm.bind(this)}>
                            <p className={styles['msgRed']}>{__('跳转失败')}</p>
                            {getErrorMessage(this.state.errcode)}
                        </MessageDialog> : null
                }
            </AppBar>
        )
    }
}