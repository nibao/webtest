import * as React from 'react';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import WebComponent from '../../webcomponent';
import __ from './locale';
import * as styles from './styles.desktop';

export default class Confirmation extends WebComponent<any, any>{
    render() {
        return (
            <ConfirmDialog
                onConfirm={this.props.onConfirm}
                onCancel={this.props.onCancel}
            >
                <div className={styles['message-text']}>{__('确认要屏蔽当前选中的共享文档吗？')}</div>
                <div className={styles['message-comment']}>{__('提示：对于已屏蔽的共享文档，可以在“已屏蔽共享”页面进行恢复。')}</div>
            </ConfirmDialog >
        )
    }

}