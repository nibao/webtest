import * as React from 'react'
import { hashHistory } from 'react-router'
import session from '../../../util/session/session';
import AppBar from '../../../ui/AppBar/ui.mobile'
import Quota from '../../../components/Quota/component.mobile';
import Logout from '../../../components/Logout/component.mobile';
import Personal from '../../../components/Personal/component.mobile';
import Divider from '../../../ui/Divider/ui.desktop'
import * as styles from '../styles.css'
import { scrollTop } from '../../helper'
import __ from './locale'

export default class User extends React.Component<any, any>{

    /**
    * 注销成功后跳转页面
    */
    logoutSuccess(url: string = '/') {
        session.remove('login');
        location.replace(url)
    }

    render() {
        scrollTop()

        return (
            <div className={styles['user']}>
                <AppBar className={styles['header']}>{__('我的')}</AppBar>
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