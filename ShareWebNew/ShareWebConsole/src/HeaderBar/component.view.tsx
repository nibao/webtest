import * as React from 'react';
import AppBar from '../../ui/AppBar/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import session from '../../util/session/session';
import Account from '../Account/component.view';
import Language from '../Language/component.view';
import EditSystemManager from '../EditSystemManager/component.view';
import { SystemType } from '../helper'
import HeaderBarBase from './component.base';
import __ from './locale';
import * as styles from './styles.view';

export default class HeaderBar extends HeaderBarBase {
    render() {
        const { indexView, showEditSystemManager, logo } = this.state;

        return (
            <div>
                <AppBar
                    className={styles['header']}
                    style={{ backgroundImage: `url(data:image/png;base64,${logo})` }}
                >
                    {
                        indexView ?
                            // <div
                            //     className={styles['header-layout']}
                            //     onClick={this.help.bind(this)}
                            // >
                            //     <UIIcon
                            //         code={'\uf055'}
                            //         size={16}
                            //         color={'#757575'}
                            //         className={styles['header-icon']}
                            //     />
                            //     <span className={styles['header-item']}>{__('查看帮助')}</span>
                            // </div> 暂时屏蔽查看帮助，依赖帮助文档
                            null
                            :
                            <Button
                                className={styles['header-layout']}
                                icon={'\uf0b5'}
                                onClick={this.redirectToApp.bind(this)}
                            >
                                {__('应用管理')}
                            </Button>
                    }
                    <Language />
                    <Account
                        path={this.props.path}
                        onClickEmailConfig={() => this.setSystemManager()}
                    />
                </AppBar>
                {
                    showEditSystemManager ?
                        <EditSystemManager
                            systemType={SystemType.Cluster}
                            account={session.get('username')}
                            adminId={session.get('userid')}
                            displayName={session.get('displayname')}
                            onEditSuccess={this.handleEditSuccess.bind(this)}
                            onEditCancel={this.cancelEditSystemManager.bind(this)}
                            doRedirect={this.handleRedirect.bind(this)}
                        />
                        : null
                }
            </div>
        )
    }
}