import * as React from 'react';
import * as classnames from 'classnames';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import DocAccessSetBase, { ValidateMessages } from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';



export default class DocAccessSet extends DocAccessSetBase {
    render() {
        const {accessInfo, validateState, changed} = this.state;
        return (
            accessInfo ?
                <div className={ styles['container'] }>
                    <div className={styles['wrap']}>
                        <div className={styles['check-box']}>
                            <CheckBoxOption 
                                checked={ accessInfo.isEnable } 
                                onChange={ (isEnable) => this.changeLimit(isEnable) } >
                            </CheckBoxOption>
                        </div>
                        <div className={ styles['text-input'] }>
                            { __('在系统CPU使用率高于') }
                            <ValidateBox
                                width={ 55 }
                                className={ styles['text-box'] } 
                                disabled = { !accessInfo.isEnable }
                                validator={input => /^[0-9]{0,3}$/.test(String(input))}
                                value = { accessInfo.limitCPU }
                                onChange = { (limitCPU) => this.handleChange({limitCPU}) }
                                validateMessages={ValidateMessages}
                                validateState={validateState.limitCPU}
                            />
                            {__('%或系统内存使用率高于')}
                            <ValidateBox
                                width={ 55 }
                                className={ styles['text-box'] } 
                                disabled = { !accessInfo.isEnable }
                                validator={input => /^[0-9]{0,3}$/.test(String(input))}
                                value = { accessInfo.limitMemory }
                                onChange = { (limitMemory) => this.handleChange({limitMemory}) }
                                validateMessages={ValidateMessages}
                                validateState={validateState.limitMemory}
                            />
                            {__('%时，只允许权重值低于')}
                            <ValidateBox
                                width={ 55 }
                                className={ styles['text-box'] } 
                                disabled = { !accessInfo.isEnable }
                                validator={input => /^[0-9]{0,3}$/.test(String(input))}
                                value = { accessInfo.limitPriority }
                                onChange = { (limitPriority) => this.handleChange({limitPriority}) }
                                validateMessages={ValidateMessages}
                                validateState={validateState.limitPriority}
                            />
                            {__('的用户登录客户端，其他用户强制退出，无法登录。')}
                        </div>
                    </div>
                    <div className={ classnames(styles['set-limit']) }>
                        <div className={ styles['sub-title'] }>
                            { __('请在 ') }
                            <LinkChip className={ styles['link'] } onClick={ this.handleClick.bind(this) }>
                                { __('用户组织管理') }
                            </LinkChip>
                            { __(' 编辑用户权重，权重值越小，优先级越高。') }
                        </div>
                    </div>
                    <div className={styles['footer']}>
                        {
                            changed ?
                                <div>
                                    <span className={styles['button-wrapper']}>
                                        <Button onClick={this.handleSave.bind(this)}>{__('保存')}</Button>
                                    </span>
                                    <span className={styles['button-wrapper']}>
                                        <Button onClick={this.handleCancel.bind(this)}>{__('取消')}</Button>
                                    </span>
                                </div>
                                : null
                        }
                    </div>
                </div>
            : null
        )
    }

}