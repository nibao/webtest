import * as React from 'react';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import { includes } from 'lodash'
import Button from '../../ui/Button/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop'
import UserAgreementConfigBase, { ShowDialog } from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';
import * as baseinfoImg from './assets/images/base_info.png';
import * as classnames from 'classnames';
import ValidateArea from '../../ui/ValidateArea/ui.desktop';

export default class UserAgreementConfig extends UserAgreementConfigBase {
    render() {
        let { config: { userAgreement, autoPopUserAgreement, agreementText }, changed, error, switchDialog, processCircle } = this.state;
        return (
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <UIIcon
                        code={'\uf016'}
                        size={'18px'}
                        color={'#555'}
                        fallback={baseinfoImg}
                    />
                    <span className={styles['header-label']}>{__('用户协议OEM配置')}</span>
                </div>
                <div className={styles['main']}>
                    <div className={styles['filed']}>
                        <div className={styles['item']}>
                            <input
                                id="user-agreement"
                                type="checkbox"
                                checked={userAgreement}
                                onChange={this.handleUserAgreementChange.bind(this)}
                            />
                            <label
                                htmlFor="user-agreement"
                                className={styles['title']}
                            >
                                {__('在登录界面显示用户协议')}
                            </label>
                        </div>
                        <div className={classnames(styles['item'], styles['autoPopUserAgreement'])}>
                            <input
                                id="first-user-agreement"
                                checked={autoPopUserAgreement}
                                type="checkbox"
                                onChange={this.handleAutoPopUserAgreementChange.bind(this)}
                            />
                            <label
                                htmlFor="first-user-agreement"
                                className={styles['title']}
                            >
                                {__('首次登录时自动弹出用户协议')}
                            </label>
                        </div>
                    </div>
                    <div className={styles['filed']}>
                        <div className={styles['item']}>
                            <label
                                htmlFor="agreement-text"
                                className={styles['tip']}
                            >
                                {__('用户协议内容如下：')}
                            </label>
                        </div>
                    </div>
                    <div className={styles['filed']}>
                        <ValidateArea
                            placeholder=""
                            value={agreementText}
                            validateState={error.agreementText}
                            validateMessages={{
                                true: __('此输入项不能为空'),
                            }}
                            disabled={!(userAgreement || autoPopUserAgreement)}
                            onChange={this.handleUserAgreementTextChange.bind(this)}
                            width={420}
                            height={180}
                            required={true}
                        />
                    </div>
                </div>
                {
                    includes(changed, true) ? <div className={styles['footer']}>
                        <span className={styles['button-wrapper']}>
                            <Button onClick={this.handleSaveUserAgreementConfig.bind(this)}>{__('保存')}</Button>
                        </span>
                        <span className={styles['button-wrapper']}>
                            <Button onClick={this.handleCancelUserAgreementConfig.bind(this)}>{__('取消')}</Button>
                        </span>
                    </div> : null
                }
                {
                    switchDialog === ShowDialog.RESOLVE ?
                        <SuccessDialog onConfirm={this.handleCancelDialog.bind(this)}>
                            {__('保存成功，您的OEM配置将在下次打开浏览器时生效。')}
                        </SuccessDialog> : null
                }
                {
                    switchDialog === ShowDialog.REJECT ?
                        <MessageDialog onConfirm={this.handleCancelDialog.bind(this)}>
                            {__('保存失败，请稍后重试。')}
                        </MessageDialog> : null
                }
                {processCircle ?
                    <ProgressCircle detail={__('正在设置，请稍后...')} /> : null
                }
            </div>
        );
    }
}