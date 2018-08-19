import * as React from 'react';
import { natural } from '../../util/validators/validators';
import CheckBoxeOption from '../../ui/CheckBoxOption/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop';
import NumberBox from '../../ui/NumberBox/ui.desktop';
import PanelButton from '../../ui/Panel.Button/ui.desktop'
import CaptchaConfigBase from './component.base';
import { getErrorMessage } from '../../core/exception/exception';
import __ from './locale';
import * as styles from './styles.view.css';

export default class CaptchaConfig extends CaptchaConfigBase {
    render() {
        return (
            <div className={styles['content']}>
                <div>
                    <CheckBoxeOption checked={this.state.vcodeConfig.isEnable} onChange={value => this.changeCaptchStatus(value)}>
                        {
                            __('启用登录验证码')
                        }
                    </CheckBoxeOption>

                </div>

                <div className={styles['message']}>
                    <span className={styles['message-color']}>
                        {
                            __('用户登录时，连续输错密码 ')
                        }
                    </span>
                    <NumberBox
                        width={80}
                        value={this.state.value}
                        disabled={!this.state.vcodeConfig.isEnable}
                        max={99}
                        min={0}
                        onChange={value => { this.changeErrorTimes(value) }}
                        validator={natural}
                        ValidatorMessage={
                            {
                                max: __('输错密码最大次数为99')
                            }
                        }
                    />
                    <span className={styles['message-color']}>
                        {
                            __(' 次，则开启登录验证码')
                        }
                    </span>
                </div>

                {
                    this.state.changed ?
                        (

                            < div className={styles['foot']} >
                                <PanelButton onClick={this.saveCaptchaConfig.bind(this)}>
                                    {
                                        __('保存')
                                    }
                                </PanelButton>
                                <PanelButton onClick={this.cancelCaptchaConfig.bind(this)}>
                                    {
                                        __('取消')
                                    }
                                </PanelButton>
                            </div>
                        ) : null
                }

                {
                    this.state.succeed ?
                        (
                            <SuccessDialog onConfirm={this.onSuccessConfirm.bind(this)}>
                                {
                                    __('保存成功')
                                }
                            </SuccessDialog>
                        ) :
                        null
                }

                {
                    this.state.errcode ?
                        (
                            <MessageDialog onConfirm={this.handleErrorConfirm.bind(this)}>
                                {
                                    getErrorMessage(this.state.errcode)
                                }
                            </MessageDialog>
                        ) :
                        null
                }

            </div>
        )
    }
}