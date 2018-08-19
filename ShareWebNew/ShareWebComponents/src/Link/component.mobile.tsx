import * as React from 'react';
import * as classnames from 'classnames';
import { ClassName } from '../../ui/helper';
import LinkBase from './component.base';
import { Status } from './helper';
import ErrorDialog from '../../ui/ErrorDialog/ui.mobile';
import TextBox from '../../ui/TextBox/ui.mobile';
import Button from '../../ui/Button/ui.mobile';
import { getErrorMessage } from '../../core/errcode/errcode';
import __ from './locale';
import * as styles from './style.mobile.css';

export default class Link extends LinkBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.renderStatus(this.state.status)
                }
            </div>
        )
    }

    renderStatus(status) {
        if (this.state.status === undefined) {

        } else if (this.state.status === Status.OK) {

        } else {
            return this.renderError(status)
        }
    }

    renderError(status) {
        switch (status) {
            case Status.NEED_PASSWORD:
                return (
                    <div className={styles['container']}>
                        <h1 className={styles['spacing']}>{__('您正在打开共享的外部链接')}</h1>
                        <p className={styles['spacing']}>{__('请输入访问密码')}</p>
                        <div className={styles['spacing']}>
                            <TextBox value={this.state.password} onChange={this.updatePassword.bind(this)} />
                        </div>
                        <div className={styles['spacing']}>
                            <Button type="submit" className={ClassName.BackgroundColor} onClick={this.verifyPassword.bind(this, this.state.password)}>{__('确定')}</Button>
                        </div>
                        <div className={styles['spacing']}>
                            <h1 className={styles['error-title']}>
                                {
                                    this.getHasPasswordError()
                                }
                            </h1>
                        </div>
                    </div>
                )

            case Status.EXPIRED:
                return (
                    <h1 className={styles['error-title']}>
                        {
                            __('外链地址已失效。')
                        }
                    </h1>
                )

            default:
                return (
                    <h1 className={styles['error-title']}>
                        {
                            getErrorMessage(status)
                        }
                    </h1>
                )
        }
    }

    getHasPasswordError() {
        if (this.state.errorType === 401002 && this.state.passwordTried) {
            return __('密码错误，请重新输入。');


        } else if (this.state.errorType === Status.NO_PASSWORD) {
            return __('密码不能为空。')
        }
    }

}