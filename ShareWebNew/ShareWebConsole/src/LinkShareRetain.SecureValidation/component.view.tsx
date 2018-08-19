import * as React from 'react'
import { includes } from 'lodash'
import { getErrorMessage } from '../../core/exception/exception'
import Form from '../../ui/Form/ui.desktop';
import Button from '../../ui/Button/ui.desktop'
import TextBox from '../../ui/TextBox/ui.desktop'
import LinkShareRetainSecureValidationBase from './component.base'
import * as styles from './styles.view.css'
import __ from './locale';

function getErrorMess(error) {
    switch (error.errID) {
        // 密码错误
        case 20108:
            return __('密码不正确')

        // 输入错误次数超过限制，账号已被锁定，XX分钟内无法登录，请稍后重试
        case 20130:
        case 20135:
            const time = JSON.parse(error.errDetail).remainlockTime

            return __('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试。', { time })

        default:
            return getErrorMessage(error.errID)
    }
}

export default class LinkShareRetainSecureValidation extends LinkShareRetainSecureValidationBase {
    render() {
        const { vCode, error } = this.state;

        return (
            <div>
                <div className={styles['title']}>{__('安全验证：')}</div>
                <Form>
                    <Form.Row>
                        <Form.Label>
                            <label>{__('请输入您的登录密码：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <TextBox
                                type="password"
                                value={vCode}
                                onChange={(value) => this.setState({
                                    vCode: value,
                                    error: (error && includes([20130, 20135], error.errID)) ? error : null
                                })}
                            />
                            <span className={styles['tag']}>{'*'}</span>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <div></div>
                        </Form.Label>
                        <Form.Field>
                            {
                                error
                                    ? <div className={styles['warning']}>{getErrorMess(error)}</div>
                                    : null
                            }
                            <Button
                                className={styles['ok-btn']}
                                disabled={!vCode}
                                onClick={this.validate.bind(this)}
                            >
                                {__('确定')}
                            </Button>
                        </Form.Field>
                    </Form.Row>
                </Form>
            </div>
        )
    }
}