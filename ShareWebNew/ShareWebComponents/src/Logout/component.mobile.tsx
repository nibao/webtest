import * as React from 'react';
import LogoutBase from './component.base';
import Button from '../../ui/Button/ui.mobile';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.mobile';
import { ClassName } from '../../ui/helper';
import __ from './locale';
import * as styles from './styles.mobile';

export default class Logout extends LogoutBase {


    render() {
        return (
            <div className={styles['logout']}>

                <Button
                    type="submit"
                    className={ClassName.BackgroundColor}
                    onClick={this.confirm.bind(this)}
                >
                    {
                        __('退出')
                    }
                </Button>
                {
                    this.state.confirming ?
                        <ConfirmDialog onConfirm={this.confirmLogout.bind(this)} onCancel={this.cancel.bind(this)}>
                            <h1 className={styles['message']}>{__('您确定要退出登录吗？')}</h1>
                        </ConfirmDialog>
                        : null
                }

            </div>

        )
    }
}
