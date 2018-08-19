import * as React from 'react';
import PopMenu from '../../ui/PopMenu/ui.desktop';
import HelpDropMenuBase from './component.base';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class HelpDropMenu extends HelpDropMenuBase {
    render() {
        const { OEMHelper, OEMFAQ } = this.props;

        return (
            <div>
                <PopMenu
                    targetOrigin={['right', 0]}
                    anchorOrigin={['right', 50]}
                    triggerEvent="mouseover"
                    closeWhenMouseLeave={true}
                    onRequestCloseWhenClick={(close) => close()}
                    freezable={false}
                    watch={true}
                    trigger={
                        <div className={styles['current']}>
                            <UIIcon
                                code="\uf055"
                                size={16}
                                className={styles['help-icon']}
                            />
                            <div className={styles['help']}>{__('帮助')}</div>
                            <UIIcon
                                code="\uf04c"
                                size={16}
                                className={styles['help-icon']}
                            />
                        </div>
                    }
                >

                    {
                        OEMHelper ?
                            <PopMenu.Item
                                className={styles['help-item']}
                                label={__('查看帮助')}
                                onClick={() => {this.handleHelp(OEMHelper)}}
                            />
                            : null
                    }

                    {
                        OEMFAQ ? 
                            <PopMenu.Item
                                className={styles['help-item']}
                                label={__('常见问题')}
                                onClick={() => {this.handleHelp(OEMFAQ)}}
                            />
                            : null
                    }
                </PopMenu>
            </div>
        )
    }
}