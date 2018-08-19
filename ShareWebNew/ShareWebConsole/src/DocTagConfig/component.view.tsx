import * as React from 'react';
import * as classnames from 'classnames';
import UIIcon from '../../ui/UIIcon/ui.desktop'
import TextBox from '../../ui/TextBox/ui.desktop';
import DocTagConfigBase from './component.base';
import * as styles from './styles.view.css'
import __ from './locale'


export default class DocTagConfig extends DocTagConfigBase {

    render() {
        const { showModify, showSaveAndCancel, errorMessage, value } = this.state;
        return (
            <div className={ styles['container'] }>
                <div className={ styles['header'] }>
                    <UIIcon size={ '18px' } code={ '\uf016' } color="#555" />
                    <span className={ styles['header-label'] }>{ __('文件标签策略') }</span>
                </div>
                <div className={ styles['main'] }>
                    <div className={ styles['text'] }>{ __('允许用户为文件最多可添加') }</div>
                    {
                        showModify
                            ? <div className={ styles['tag-number'] }>{ value }</div>
                            : <TextBox width={ 50 } className={ styles['text-box'] } value={ value } onChange={ (value) => this.updateMaxTags(value) } validator={ (value) => this.validator(value) } />
                    }
                    <div className={ classnames(styles['text'], styles['end-text']) }>{ __('个标签') }</div>
                    {
                        showModify
                            ? <a className={ styles['a-link'] } href="javascript:void(0)" onClick={ this.toggleModifyToSaveAndCancel.bind(this, true) }>{ __('[修改]') }</a>
                            : null
                    }
                    {
                        showSaveAndCancel
                            ? <a className={ styles['a-link'] } href="javascript:void(0)" onClick={ this.saveMaxTags.bind(this) }>{ __('[保存]') }</a>
                            : null
                    }
                    {
                        showSaveAndCancel
                            ? <a className={ styles['a-link'] } href="javascript:void(0)" onClick={ this.cancel.bind(this) }>{ __('[取消]') }</a>
                            : null
                    }
                    {
                        errorMessage
                            ? <div className={ styles['error-message'] }>{ errorMessage }</div>
                            : null
                    }
                </div>
            </div>
        )
    }

    /**
    * 限制文本框只能输入1~100的数字
    */
    validator(value: string): boolean {
        if (/[^0-9]/.test(value)) {
            return false
        }
        return true;
    }
}
