import * as React from 'react';
import * as classnames from 'classnames'
import { noop } from 'lodash';
import Dialog from '../Dialog/ui.mobile';
import __ from './locale';
import * as styles from './styles.mobile.css';

export default function ConfirmDialog({ onConfirm = noop, onCancel = noop, children }) {
    return (
        <Dialog>
            <Dialog.Main>
                <div className={styles['main']}>
                    {
                        children
                    }
                </div>
            </Dialog.Main>
            <Dialog.Footer>
                <div className={classnames(styles['button-wrapper'], styles['left-btn'])}>
                    <Dialog.Button
                        onClick={onCancel}
                    >
                        {__('取消')}
                    </Dialog.Button>
                </div>
                <div className={styles['button-wrapper']}>
                    <Dialog.Button
                        onClick={onConfirm}
                    >
                        {__('确定')}
                    </Dialog.Button>
                </div>
            </Dialog.Footer>
        </Dialog>
    )
}