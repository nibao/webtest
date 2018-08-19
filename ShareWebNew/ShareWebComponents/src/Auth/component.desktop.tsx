import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Auth711 from '../Auth711/component.desktop';
import Login from '../Login/component.desktop';
import OAuthBase from './component.base';
import { PanelType } from './component.base';
import { ClassName } from '../../ui/helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Auth extends OAuthBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.panel === PanelType.PENNDING ?
                        null :
                        (<Dialog
                            title={__('用户验证')}
                            onClose={() => { this.props.onAuthClose() }}
                        >
                            <Panel>
                                <Panel.Main>
                                    <div className={styles['login-dialog']}>
                                        <div>
                                            <div className={styles['header-font']}>{__('欢迎登录')}</div>
                                            <div className={styles['oem-organization']}>{this.state.slogan}</div>
                                        </div>
                                        <div className={styles['login']} >
                                            {
                                                this.state.panel === PanelType.NORMAL_LOGIN ? this.getLoginComponent() : null
                                            }
                                            {
                                                this.state.panel === PanelType.THIRD_LOGIN ?
                                                    this.getThirdLoginComponent()
                                                    :
                                                    null
                                            }
                                        </div>

                                    </div>

                                </Panel.Main>
                            </Panel>
                        </Dialog>)
                }
            </div>
        )
    }

    getLoginComponent() {
        return (
            <div>
                <Login onSuccess={(userInfo) => { this.getUserInfo(userInfo) }} onPasswordChange={(account) => { this.props.onPasswordChange(account) }} />
                <div className={styles['panel-selected']}>
                    <FlexBox>
                        {
                            this.state.thirdAuth && !this.state.thirdAuth.config.hideThirdLogin ?
                                <FlexBox.Item align="right middle">
                                    <LinkChip onClick={() => { this.changePanel(PanelType.THIRD_LOGIN) }} className={styles['selected-color']}>
                                        {__('切换登录方式')}
                                    </LinkChip>
                                </FlexBox.Item> :
                                null
                        }
                    </FlexBox>
                </div>
            </div>
        )
    }

    getThirdLoginComponent() {
        return (
            <div>
                <div className={styles['login-third']}>
                    <div className={styles['user-icon']}>
                        <UIIcon code={'\uf06e'} size={100} />
                    </div>
                    {
                        this.getThirdAuthTemplate(this.state.thirdAuth)
                    }
                </div>
                <div className={styles['panel-selected']}>
                    <FlexBox>
                        {
                            !this.state.thirdAuth.config.hideLogin ?
                                <FlexBox.Item align="right middle">
                                    <LinkChip onClick={() => { this.changePanel(PanelType.NORMAL_LOGIN) }} className={styles['selected-color']}>
                                        {__('切换登录方式')}
                                    </LinkChip>
                                </FlexBox.Item> :
                                null
                        }
                    </FlexBox>
                </div>
            </div>
        )
    }

    getThirdAuthTemplate(thirdauth) {
        switch (thirdauth.id) {
            case 'shcyauth':
                return (
                    <Auth711
                        onAuthSuccess={this.props.onAuthSuccess.bind(this)}
                    />
                )

            default:
                return (
                    <Button
                        type="submit"
                        className={classnames(styles['input-btn'], ClassName.BackgroundColor)}
                        onClick={() => { this.thirdLogin() }}
                    >
                        {
                            (thirdauth && thirdauth.config && thirdauth.config.loginButtonText) ?
                                thirdauth.config.loginButtonText :
                                __('第三方登录')
                        }
                    </Button>

                )

        }
    }

}