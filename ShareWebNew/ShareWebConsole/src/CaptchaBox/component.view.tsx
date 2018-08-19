import * as React from 'react';
import TextBox from '../../ui/TextBox/ui.desktop';
import CaptchaBoxBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class CaptchaBox extends CaptchaBoxBase {
    render() {
        return (
            <div className={styles['captach']}>
                <div className={styles['captach-input']}>
                    <TextBox
                        value={this.state.captcha}
                        onChange={this.handleChange.bind(this)}
                        placeholder={__('请输入验证码')}
                        width={120}
                        className={styles['captach-input-size']}
                    />
                </div>
                <div className={styles['captach-img']}>
                    {
                        this.state.codeCreateInfo && this.state.codeCreateInfo.vcode ?
                            <img
                                src={`data:image/jpeg;base64,${this.state.codeCreateInfo.vcode}`}
                                onClick={this.changeNext.bind(this)}
                                height={39}
                            /> :
                            null
                    }

                </div>
            </div>
        )
    }
}