import * as React from 'react';
import { includes } from 'lodash';
import { UIIcon, Button, CheckBoxOption } from '../../ui/ui.desktop';
import MessageSwitchBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class MessageSwitch extends MessageSwitchBase {

    render() {
        const { messageSwitch, changed } = this.state

        return (
            <div className={styles['container']}>
                <div className={styles['msg-title']}>
                    <UIIcon
                        code={'\uf016'}
                        size={'18px'}
                        color={'#555'}
                    />
                    <span className={styles['msg-title-content']}>
                        {__('消息策略')}
                    </span>
                </div>
                <div className={styles['main']}>
                    <CheckBoxOption
                        checked={!messageSwitch}
                        onChange={this.handleMsgSwitchChange.bind(this)}
                        >
                        {__('关闭消息中心')}
                    </CheckBoxOption>
                </div>
                {
                    changed ?
                        <div className={styles['footer']}>
                            <Button
                                className={styles['button-wrapper']}
                                onClick={this.handleSaveMsgSwitchConfig.bind(this)}>
                                {__('保存')}
                            </Button>
                            <Button
                                className={styles['button-wrapper']}
                                onClick={this.handleCancelMsgSwitchConfig.bind(this)}>
                                {__('取消')}
                            </Button>
                        </div>
                        :
                        null
                }
            </div>
        );
    }
}