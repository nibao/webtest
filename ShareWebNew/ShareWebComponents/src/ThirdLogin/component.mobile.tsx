import * as React from 'react';
import ThirdLoginBase from './component.base';
import { ClassName } from '../../ui/helper';
import Button from '../../ui/Button/ui.mobile';
import * as styles from './styles.mobile.css';
import __ from './locale';

export default class ThirdLogin extends ThirdLoginBase {
    render() {
        const { thirdauth } = this.state;
        return (
            <div className={styles.thirdLogin}>
                <Button
                    type="submit"
                    className={ClassName.BackgroundColor}
                    onClick={this.thirdLoad.bind(this)}
                >
                    {
                        (thirdauth && thirdauth.config && thirdauth.config.loginButtonText) ?
                            thirdauth.config.loginButtonText :
                            __('第三方登录')
                    }
                </Button>
            </div>
        )
    }
}