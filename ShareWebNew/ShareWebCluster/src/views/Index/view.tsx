import * as React from 'react';
import session from '../../../util/session/session';
import { getOEMConfByOptions } from '../../../core/oem/oem';
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import LoginCluster from '../../../console/LoginCluster/component.view';
import About from '../../../components/About/component.desktop';
import * as styles from './styles.css';

export default class IndexView extends React.Component<any, any> {
    state = {
        background: '',
        appIp: ''
    }

    async componentWillMount() {
        this.setState({
            // 获取应用系统主节点ip
            appIp: await ECMSManagerClient.get_app_master_node_ip()
        }, async () => {
            if (this.state.appIp) {
                this.setState({
                    background: (await getOEMConfByOptions(['background.png']))['background.png']
                })
            }
        })
    }

    handleLoginSuccess(loginResult) {
        const { history, location } = this.props;

        if (typeof (loginResult) === 'string') {
            session.set('userid', loginResult);
            session.set('userInfo', { 'id': loginResult });
        } else {
            session.set('userid', loginResult.id);
            session.set('username', loginResult.user.loginName);
            session.set('displayname', loginResult.user.displayName);
            session.set('userInfo', loginResult);
        }
        history.replace(location.query.redirect ? location.query.redirect : '/home')
    }

    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['wrapper']}>
                    <div
                        className={styles['index']}
                        style={{ backgroundImage: `url('data:image/png;base64,${this.state.background}')` }}
                    >
                        <LoginCluster
                            onLoginSuccess={this.handleLoginSuccess.bind(this)}
                        />
                        <div className={styles['about']}>
                            {
                                this.state.appIp ?
                                    <About
                                        platform="desktop"
                                    />
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}