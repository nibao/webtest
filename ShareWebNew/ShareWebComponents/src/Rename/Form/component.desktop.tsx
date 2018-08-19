import * as React from 'react'
import * as classnames from 'classnames'
import { trim } from 'lodash'
import TextBox from '../../../ui/TextBox/ui.desktop'
import InlineButton from '../../../ui/InlineButton/ui.desktop'
import { docname, isDir } from '../../../core/docs/docs'
import MessageDialog from '../../../ui/MessageDialog/ui.desktop'
import { splitName } from '../../../core/extension/extension'
import FormBase, { Type } from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

const validateMessages = {
    [Type.NameInvalid]: (doc) => isDir(doc) ?
        __('文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。')
        :
        __('文件名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。'),
    [Type.NameEndWithDot]: (doc) => isDir(doc) ?
        __('文件夹名称不能以 “.” 结尾。')
        :
        __('文件名称不能以 “.” 结尾。')
}

export default class Form extends FormBase {
    render() {
        const { className, doc } = this.props
        const { value, error } = this.state

        return (
            <div className={classnames(styles['container'], className)}>
                <TextBox
                    value={value}
                    autoFocus={true}
                    selectOnFocus={[0, (isDir(doc) ? docname(doc) : splitName(docname(doc))[0]).length]}
                    onChange={this.updateValue}
                    onKeyDown={this.handleKeyDown}
                />
                <div className={styles['actions']}>
                    <InlineButton disabled={!trim(value)} code={'\uf00a'} className={styles['button']} onClick={this.confirm} />
                    <InlineButton code={'\uf046'} className={styles['button']} onClick={this.cancel} />
                </div>
                {
                    !!error && (
                        <MessageDialog onConfirm={() => error.resolve()}>
                            {
                                validateMessages[error.type](doc)
                            }
                        </MessageDialog>
                    )
                }
            </div>
        )
    }
}