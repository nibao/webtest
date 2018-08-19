import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../Dialog/ui.mobile';
import LinkButton from '../LinkButton/ui.mobile';
import __ from './locale';
import * as styles from './styles.mobile.css';

export default function MessageDialog({ children, onConfirm = noop }: UI.MessageDialog.Props) {
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
                <Dialog.Button
                    onClick={onConfirm}
                >
                    {__('确定')}
                </Dialog.Button>
            </Dialog.Footer>
        </Dialog>
    )
}