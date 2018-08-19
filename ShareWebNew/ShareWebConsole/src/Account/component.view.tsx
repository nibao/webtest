import * as React from 'react';
import session from '../../util/session/session';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import PopMenu from '../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../ui/PopMenu.Item/ui.desktop';
import AccountBase from './component.base';
import __ from './locale';
import * as styles from './styles.view';

export default class Account extends AccountBase {
    render() {
        const { path } = this.props;

        return (
            path === '/' ?
                null :
                <PopMenu
                    anchorOrigin={['right', 'bottom']}
                    targetOrigin={['right', 'top']}
                    triggerEvent={'mouseover'}
                    trigger={
                        <div
                            className={styles['header-layout']}
                        >
                            <UIIcon
                                code={'\uf01f'}
                                size={16}
                                color={'#757575'}
                                className={styles['header-icon']}
                            />
                            <span className={styles['header-item']}>
                                {session.get('displayname') || session.get('username') || 'admin'}
                            </span>
                            <UIIcon
                                code={'\uf04c'}
                                size={16}
                                color={'#757575'}
                                className={styles['header-icon']}
                            />
                        </div>
                    }
                    watch={true}
                    freezable={false}
                    closeWhenMouseLeave={true}
                    onRequestCloseWhenClick={close => close()}
                >
                    <PopMenuItem
                        label={__('账号设置')}
                        onClick={() => { this.setSmtp() }}
                    >
                    </PopMenuItem>
                    {/* <PopMenuItem
                        label={__('查看帮助')}
                        onClick={() => { this.help() }}
                    >
                    </PopMenuItem> */}
                    <PopMenuItem
                        label={__('退出登录')}
                        onClick={() => { this.logout() }}
                    >
                    </PopMenuItem>
                </PopMenu>
        )
    }
}