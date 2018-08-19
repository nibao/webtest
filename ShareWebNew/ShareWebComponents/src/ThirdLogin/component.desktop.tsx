import * as React from 'react';
import * as classnames from 'classnames';
import ThirdLoginBase from './component.base';
import Button from '../../ui/Button/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import { loginStatus } from './component.base';
import Auth711 from '../Auth711/component.desktop';
import { ClassName } from '../../ui/helper';
import * as load from './assets/loading.gif';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ThirdLogin extends ThirdLoginBase {
    render() {
        const { thirdauth } = this.state;
        return (

            < div className={styles.thirdLogin} >

                {
                    thirdauth ?
                        this.getThirdAuthTemplate(thirdauth) :
                        null
                }
            </div >

        )
    }


    getThirdAuthTemplate(thirdauth) {
        switch (thirdauth.id) {
            case 'shcyauth':
                return (
                    <Auth711
                        onAuthSuccess={this.props.onAuthSuccess.bind(this)}
                    />
                )

            default:
                return (
                    <Button
                        type="submit"
                        className={classnames(styles['input-btn'], ClassName.BackgroundColor)}
                        onClick={this.thirdLoad.bind(this)}
                    >
                        {
                            (thirdauth && thirdauth.config && thirdauth.config.loginButtonText) ?
                                thirdauth.config.loginButtonText :
                                __('第三方登录')
                        }
                    </Button>

                )

        }
    }
}