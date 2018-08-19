import * as React from 'react'
import { ConfirmDialog, MessageDialog } from '../../../ui/ui.mobile'
import TextBox from '../../../ui/TextBox/ui.mobile'
import DialogBase, { ErrorCode } from './component.base'
import * as styles from './styles.mobile.css'
import * as commonStyles from '../../styles.desktop.css'
import __ from './locale'

export default class Dialog extends DialogBase {
    /**
     * 根据错误码获取错误信息
     * @param param0 
     */
    private getErrorMessage(errCode: number): string {
        switch (errCode) {
            // 文件名称不合法
            case ErrorCode.NameInvalid:
                return __('文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符')

            // 文件夹名称不能以 “.” 结尾。
            case ErrorCode.NameEndWithDot:
                return __('文件夹名称不能以 “.” 结尾')

            // 名称不能为空。
            case ErrorCode.EmptyName:
                return __('名称不能为空')

            default:
                return ''
        }
    }

    render() {
        const { value, events: [event], errCode } = this.state

        if (event) {
            return (
                <ConfirmDialog
                    onConfirm={this.confirm}
                    onCancel={this.cancel}
                >
                    <div className={styles['create-folder']}>
                        {__('新建文件夹')}
                    </div>
                    <TextBox
                        className={styles['text-box']}
                        width={245}
                        value={value}
                        autoFocus={true}
                        onChange={this.updateValue}
                    />
                </ConfirmDialog>

            )
        }

        if (errCode) {
            return (
                <MessageDialog onConfirm={this.clearErrcode.bind(this)}>
                    <div className={commonStyles['warningHeader']}>{__('无法执行新建操作')}</div>
                    <div className={commonStyles['warningContent']}>
                        {this.getErrorMessage(errCode)}
                    </div>
                </MessageDialog>
            )
        }

        return null
    }
}