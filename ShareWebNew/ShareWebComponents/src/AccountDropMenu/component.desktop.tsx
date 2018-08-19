import * as React from 'react';
import * as classnames from 'classnames';
import session from '../../util/session/session';
import { formatSize } from '../../util/formatters/formatters';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import PopMenu from '../../ui/PopMenu/ui.desktop';
import StackBar from '../../ui/StackBar/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import AccountDropMenuBase from './component.base';
import { UserType } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class AccountDropMenu extends AccountDropMenuBase {

    render() {
        const { link } = this.props
        const info = session.get('login');
        const { quotainfo, config } = this.state;
        if (!info) {
            return null
        }
        return (
            <PopMenu
                targetOrigin={['right', 0]}
                anchorOrigin={['right', 50]}
                triggerEvent="mouseover"
                closeWhenMouseLeave={true}
                onRequestCloseWhenClick={(close) => close()}
                freezable={false}
                watch={true}
                trigger={
                    <div className={styles['current']}>
                        <UIIcon
                            code="\uf01f"
                            size={16}
                            className={styles['username-icon']}
                        />
                        <div className={styles['username']}><Text>{info.name}</Text></div>
                        <UIIcon
                            code="\uf04c"
                            size={16}
                            className={styles['username-icon']}
                        />
                    </div>
                }
            >
                {
                    !link && (
                        <div className={classnames(styles['account-item'], styles['user-info-wrap'])}>
                            <div>
                                <UIIcon code="\uf01f" size={26} className={styles['user-icon']} />
                                <div className={styles['user-info']}>
                                    <div className={styles['user-name']}><Text>{info.name}</Text></div>
                                    <div className={styles['account-name']}><Text>{info.account}</Text></div>
                                </div>

                            </div>
                            <StackBar
                                className={styles['stack-bar']}
                            >
                                <StackBar.Stack
                                    className={styles['stack']}
                                    background="#b2c9ce"
                                    rate={quotainfo.used / quotainfo.quota}>
                                </StackBar.Stack>
                                <StackBar.Stack
                                    className={styles['stack']}
                                    background="#ffffff"
                                    rate={(quotainfo.quota - quotainfo.used) / quotainfo.quota}>
                                </StackBar.Stack>
                            </StackBar>
                            <p className={styles['quota-info']}>{formatSize(quotainfo.used)}/{formatSize(quotainfo.quota)}</p>
                        </div>
                    )
                }
                {
                    !link && (config.usertype === UserType.LocalUser || config.passwordUrl) ? (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('修改密码')}
                            onClick={() => { this.handleChangePassword() }}
                        />
                    ) : null
                }

                {
                    !link && config.helper && (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('查看帮助')}
                            onClick={() => { this.props.doOpenAgreement(config.helper) }}
                        />
                    )
                }

                {
                    !link && config.FAQ && (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('常见问题')}
                            onClick={() => { this.props.doOpenAgreement(config.FAQ) }}
                        />
                    )
                }

                {
                    !link && config.userAgreement ? (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('用户协议')}
                            onClick={() => { this.props.doOpenAgreement('#/useragreement') }}
                        />
                    ) : null
                }
                {
                    !link && info.ismanager ? (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('管理控制台')}
                            onClick={() => {
                                this.props.doOpenConsole(`http://${config.host}:8000`)
                            }}
                        />
                    ) : null
                }
                {
                    !link && navigator.userAgent.indexOf('Windows') !== -1 && (Number(config.forbidOstype) & 16) !== 16 ? (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('打开客户端')}
                            onClick={() => { this.props.doOpenClient(getOpenAPIConfig().host) }}
                        />
                    ) : null
                }
                {
                    link && (
                        <PopMenu.Item
                            className={styles['account-item']}
                            label={__('进入云盘')}
                            onClick={() => { this.handleEnterDisk() }}
                        />
                    )
                }
                <PopMenu.Item
                    className={styles['account-item']}
                    label={__('退出')}
                    onClick={() => { this.handleLogout() }}
                />
            </PopMenu>
        )
    }
}