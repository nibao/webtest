import * as React from 'react';
import Icon from '../../ui/Icon/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import * as styles from './styles.desktop.css';
import LinkPasswordBase from './component.base';
import { ErrorType } from './component.base';
import __ from './locale';

export default class LinkPassword extends LinkPasswordBase {
    render() {
        return (
            <div className={ styles['container'] }>

                {
                    this.state.errorType === ErrorType.SUCCESS ?
                        null :
                        this.state.existPassword ?
                            this.getPasswordTemplate() :
                            this.renderLinkError(this.state.errorType)
                }
            </div>
        )

    }

    getPasswordTemplate() {
        return (
            <div>
                <img src={ this.state.titleIcon } />
                <div className={ styles['link-password'] }>
                    <div className={ styles['password'] }>
                        <TextBox width={ 300 } value={ this.state.password } onChange={ password => { this.getPassword(password) } } placeholder={ __('请输入访问密码') } />
                    </div>
                    <div className={ styles['password-btn'] }>
                        <Button onClick={ () => { this.setLinkStatus() } } type="submit">
                            { __('确定') }
                        </Button>
                    </div>
                </div>
                <div className={ styles['password-error'] }>
                    { this.getHasPasswordError() }
                </div>
            </div>
        )
    }

    getHasPasswordError() {
        if (this.state.errorType === 401002 && this.state.existPassword) {
            return __('密码错误，请重新输入。');


        } else if (this.state.errorType === ErrorType.NO_PASSWORD) {
            return __('密码不能为空。')
        }
    }

    renderLinkError(errorType) {
        switch (errorType) {
            case 404008:
                return this.formatErrorDisplay(__('外链地址已失效。'));
            case 401030:
                return this.formatErrorDisplay(__('抱歉，您的打开次数已达上限！'))
        }
    }


    formatErrorDisplay(message) {
        return (
            <div className={ styles['error'] }>
                <div>
                    <UIIcon code={ '\uf021' } size="96" />
                </div>
                <div className={ styles['error-tip'] } >
                    { message }
                </div>
            </div>
        )
    }
}