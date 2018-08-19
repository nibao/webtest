import * as React from 'react';
import * as classnames from 'classnames'
import { noop } from 'lodash';
import { ClassName } from '../helper';
import Dialog from '../Dialog/ui.mobile';
import __ from './locale';
import * as styles from './styles.mobile.css'

export default function ErrorDialog({ children, onConfirm = noop }: UI.ErrorDialog.Props) {
    return (
        <Dialog>
            <Dialog.Header>
                {__('提示')}
            </Dialog.Header>
            <Dialog.Main>
                <div className={styles['main']}>
                    {
                        children
                    }
                </div>
            </Dialog.Main>
            <Dialog.Footer>
                <Dialog.Button
                    className={ClassName.BackgroundColor}
                    onClick={onConfirm}
                >
                    {__('确定')}
                </Dialog.Button>
            </Dialog.Footer>
        </Dialog>
    )
}