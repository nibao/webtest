import * as React from 'react';
import * as classnames from 'classnames';
import { getErrorMessage } from '../../core/errcode/errcode';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import CsfCheckBase from './component.base';
import __ from './locale';
import * as styles from './styles.view';

export default class CsfCheck extends CsfCheckBase {
    render() {
        return (
            <div className={styles['container']}>
                <CheckBoxOption
                    checked={this.state.status}
                    value={this.state.status}
                    onChange={value => { this.setCsfLevelStatus(value) }}
                >
                    {__('启用文件改密审核机制')}
                </CheckBoxOption>
                <div className={styles['csf-message']}>
                    {__('当用户更改文件密级时，需经过文档审核员审核，审核通过后更改才能生效')}
                </div>
                {
                    this.state.errorInfo ?
                        <MessageDialog onConfirm={() => { this.setState({ errorInfo: null }) }}>
                            {getErrorMessage(this.state.errorInfo.errorID)}
                        </MessageDialog> :
                        null
                }
            </div>
        )
    }
}
