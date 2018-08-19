import * as React from 'react';
import * as classnames from 'classnames';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { ClassName } from '../../ui/helper';
import Auth711Base from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class Auth711 extends Auth711Base {
    render() {
        return (
            <div className={styles['container']}>
                <div className={
                    classnames(styles['input-user'],
                        {
                            [styles['input-focus']]: this.state.focusing
                        }
                    )}>
                    <span className={styles['input-icon']} >
                        <UIIcon code={'\uf020'} size={16} className={styles['icon-middle']} />
                        <span className={styles['input-line']} >
                        </span>
                    </span>
                    <input
                        type="password"
                        className={styles['input-login']}
                        value={this.state.pin}
                        ref="password"
                        onFocus={() => { this.setFocusStatus() }}
                        onBlur={() => { this.setBlurStatus() }}
                        onChange={pin => { this.setPin(pin) }}
                        placeholder={__('请输入PIN')}
                    />
                </div>
                <div className={styles.thirdLogin}>
                    <Button type="submit" className={classnames(styles['input-btn'], ClassName.BackgroundColor)} onClick={this.conformAuth.bind(this)} >
                        {
                            __('登 录')
                        }
                    </Button>
                </div>


                {
                    this.state.hr && this.state.hr !== 1 ?
                        (
                            <MessageDialog onConfirm={this.closeError.bind(this)}>{'PIN 码验证失败!'}</MessageDialog>
                        ) :
                        null
                }

            </div>
        )
    }
}