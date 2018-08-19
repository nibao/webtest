import * as React from 'react';
import * as classnames from 'classnames';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Login from '../Login/component.desktop';
import AuthError from '../AuthError/component.desktop'
import ThirdLogin from '../ThirdLogin/component.desktop';
import AccessCode from '../AccessCode/component.desktop';
import IndexBase from './component.base';
import { PanelType } from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class Index extends IndexBase {

    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['header-line']}></div>
                <div className={styles['login-body']}>
                    {
                        this.state.panel === PanelType.ACCESSCODE ?
                            <div className={styles['header-font']}>{__('文件提取')}</div> :
                            <div>
                                <div className={styles['header-font']}>{__('欢迎登录')}</div>
                                <div className={styles['oem-organization']}>{this.state.slogan}</div>
                            </div>
                    }

                    {
                        this.state.panel === PanelType.NORMAL_LOGIN ? this.getLoginComponent() : null
                    }
                    {
                        this.state.panel === PanelType.THIRD_LOGIN ?
                            this.getThirdLoginComponent()
                            :
                            null
                    }
                    {
                        this.state.panel === PanelType.ACCESSCODE ?
                            this.getAccessCodeComponent()

                            : null
                    }


                </div>
            </div>
        )
    }

    getLoginComponent() {
        return (
            <div>
                <Login onSuccess={(userInfo) => { this.props.onSuccess(userInfo) }} onPasswordChange={(userName) => { this.props.onPasswordChange(userName) }} />
                <div className={styles['panel-selected']}>
                    <FlexBox>
                        {
                            this.state.linkAccessCode ?
                                <FlexBox.Item align="left middle">
                                    <LinkChip onClick={() => { this.changePanel(PanelType.ACCESSCODE) }} className={styles['selected-color']}>
                                        {__('提取文件')}
                                    </LinkChip>
                                </FlexBox.Item> :
                                null
                        }
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
                    <ThirdLogin
                        doSSO={authServer => { this.props.onThirdLogin(authServer) }}
                        onAuthSuccess={this.props.onSuccess.bind(this)}
                    />
                </div>
                <AuthError />
                <div className={styles['panel-selected']}>
                    <FlexBox>
                        {
                            this.state.linkAccessCode ?
                                <FlexBox.Item align="left middle">
                                    <LinkChip onClick={() => { this.changePanel(PanelType.ACCESSCODE) }} className={styles['selected-color']}>
                                        {__('提取文件')}
                                    </LinkChip>
                                </FlexBox.Item> :
                                null
                        }
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

    getAccessCodeComponent() {
        return (

            <div>
                <div>
                    <div className={styles['user-icon']}>
                        <UIIcon code={'\uf06f'} size={86} />
                    </div>
                    <AccessCode onGetLink={this.openLink} />
                </div>
                <div className={styles['panel-selected']}>
                    <FlexBox>
                        {
                            this.state.thirdAuth && !this.state.thirdAuth.config.hideThirdLogin ?
                                <FlexBox.Item align="right middle">
                                    <LinkChip onClick={() => { this.changePanel(PanelType.THIRD_LOGIN) }} className={styles['selected-color']}>
                                        {__('切换登录方式')}
                                    </LinkChip>
                                </FlexBox.Item> :
                                <FlexBox.Item align="right middle">
                                    <LinkChip onClick={() => { this.changePanel(PanelType.NORMAL_LOGIN) }} className={styles['selected-color']}>
                                        {__('切换登录方式')}
                                    </LinkChip>
                                </FlexBox.Item>
                        }
                    </FlexBox>
                </div>
            </div>

        )
    }
}