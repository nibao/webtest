import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import { getLinkErrorMessage, EmptyLinkPassword } from '../../../core/permission/permission'
import { ClassName } from '../../../ui/helper';
import { Centered } from '../../../ui/ui.desktop'
import { Button, TextBox } from '../../../ui/ui.mobile'
import PasswordValidationBase from './component.base'
import * as styles from './styles.mobile.css'
import __ from './locale'

export default class PasswordValidation extends PasswordValidationBase {
    render() {
        const { value, errCode } = this.state

        return (
            <Centered>
                <div className={styles['text']}>
                    {__('该共享已加密，请您输入密码')}
                </div>
                <TextBox
                    className={styles['text-box']}
                    width={300}
                    value={value}
                    onChange={this.handleChange.bind(this)}
                />
                <div>
                    <Button
                        className={classnames(ClassName.BackgroundColor, styles['ok-btn'])}
                        type="submit"
                        onClick={this.validate.bind(this)}
                    >
                        {__('确定')}
                    </Button>
                </div>
                <div className={styles['error-message']}>
                    {
                        includes([ErrorCode.LinkAuthFailed, EmptyLinkPassword], errCode) && getLinkErrorMessage(errCode)
                    }
                </div>
            </Centered>
        )
    }
}