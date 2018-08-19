import * as React from 'react'
import { noop } from 'lodash'
import { docname } from '../../../core/docs/docs'
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop'
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop'
import __ from './locale'
import * as styles from './styles.desktop.css'

export default function DirLockedWarning({
    doc,
    docs,
    onCancel = noop,
    onConfirm = noop,
    onChange = noop
}: Components.Move.DirLockedWarning.Props) {
    return (
        <ConfirmDialog
            onCancel={onCancel}
            onConfirm={onConfirm}
            >
            {__('您确定要移动文件夹“${name}”吗？该文件夹下的某些子文件已被锁定，这些文件无法被移动，所在路径将保留。', { name: docname(doc) })}
            {
                (docs.length > 1) ?
                    <div className={styles['footer']}>
                        <CheckBoxOption
                            onChange={onChange}
                            checked={false}
                            >
                            {__('为之后所有相同的冲突执行此操作')}
                        </CheckBoxOption>
                    </div>
                    :
                    null
            }
        </ConfirmDialog>
    )
}