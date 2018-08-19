import * as React from 'react';
import AccessCodeBase from './component.base';
import TextBox from '../../ui/TextBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import * as classnames from 'classnames';
import { ClassName } from '../../ui/helper';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class AccessCode extends AccessCodeBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['text-box']}>
                    <TextBox
                        placeholder={__('请输入文件提取码')}
                        className={styles['input-wrap']}
                        value={this.state.code}
                        validator={this.validateCode.bind(this)}
                        onChange={val => this.setCode.bind(this)(val)}
                    />
                </div>
                <div className={styles['button-wrapper']}>
                    <Button className={classnames(styles['access-file-button'], ClassName.BackgroundColor)} onClick={this.accessFile.bind(this)}>{__('提取文件')}</Button>
                </div>
                <div className={styles['error-wrap']}>
                    <p className={styles['error-message']}>
                        {
                            this.state.codeError ? __('提取码不存在') : null
                        }
                    </p>
                </div>
            </div>

        )
    }

}

