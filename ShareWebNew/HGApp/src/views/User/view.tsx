import * as React from 'react'
import session from '../../../util/session/session';
import AppBar from '../../../ui/AppBar/ui.mobile'
import Quota from '../../../components/Quota/component.mobile';
import Logout from '../../../components/Logout/component.mobile';
import Personal from '../../../components/Personal/component.mobile';
import Divider from '../../../ui/Divider/ui.desktop'
import * as styles from '../styles.css'

export default class User extends React.Component<any, any>{

    /**
    * 注销成功后跳转页面
    */
    logoutSuccess() {
        session.remove('login');
        if (typeof HGApp !== 'undefined') {
            HGApp.close()
        }
    }

    render() {
        return (
            <div className={styles['user']}>
                <AppBar className={styles['header']}>我的</AppBar>
                <div className={styles['wrapper']}>
                    <Personal />
                    <Divider />
                    <div className={styles['quota']}>
                        <Quota />
                    </div>
                    <Divider />
                    <div className={styles['logout']}>
                        <Logout onSuccess={this.logoutSuccess.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}