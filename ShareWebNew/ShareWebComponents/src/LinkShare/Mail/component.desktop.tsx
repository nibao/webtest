import * as React from 'react';
import { noop } from 'lodash';
import { mail } from '../../../util/validators/validators';
import { mail as sendMail } from '../../../core/linkconfig/linkconfig';
import Button from '../../../ui/Button/ui.desktop';
import ComboArea from '../../../ui/ComboArea/ui.desktop';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import Icon from '../../../ui/Icon/ui.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as mailIcon from './assets/mail.png';


export default function Mail({ doc, link, password, endtime, accesscode, enableLinkAccessCode, mailto, onMailsChange = noop, onMailSendSuccess = noop, onMailSendError = noop, }: Components.LinkShare.Mails.Props) {
    /**
     * 执行发送邮件
     */
    async function send() {
        try {
            await sendMail({ doc, link, password, endtime, accesscode, mailto, enableLinkAccessCode });
            onMailSendSuccess();
        } catch (ex) {
            onMailSendError(ex);
        }
    }

    return (
        <div>
            <div className={ styles['block'] }>
                {
                    enableLinkAccessCode ? __('您可以通过邮件方式发送提取码：') : __('您可以通过邮件方式发送链接：')
                }
            </div>
            <div className={ styles['spliter'] }></div>
            <div className={ styles['block'] }>
                <FlexBox>
                    <FlexBox.Item width="100">
                        <div className={ styles['sendMailIcon'] }>
                            <Icon size="64" url={ mailIcon } />
                            <p>{ __('发至邮箱') }</p>
                        </div>
                    </FlexBox.Item>
                    <FlexBox.Item>
                        <ComboArea
                            width={ '100%' }
                            height={ 100 }
                            className={ styles['mails'] }
                            value={ mailto }
                            spliter={ [';', ',', ' '] }
                            validator={ mail }
                            placeholder={ __('请输入邮箱地址，用逗号、分号或空格分隔') }
                            onChange={ onMailsChange }
                        />
                    </FlexBox.Item>
                </FlexBox>
            </div>
            <div className={ styles['block'] }>
                <FlexBox>
                    <FlexBox.Item align="right middle">
                        <Button
                            onClick={ send }
                            disabled={ !mailto || !mailto.length }
                        >
                            { __('发送') }
                        </Button>
                    </FlexBox.Item>
                </FlexBox>
            </div>
        </div>
    )
}