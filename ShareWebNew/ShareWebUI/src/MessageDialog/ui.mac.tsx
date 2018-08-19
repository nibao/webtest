import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../Dialog/ui.desktop';
import __ from './locale';

export default function MessageDialog({ onConfirm = noop, children }: UI.MessageDialog.Props) {
    return (
        <Dialog>
            <Dialog.Main>
                {
                    children
                }
            </Dialog.Main>
            <Dialog.Footer>
                <Dialog.Button type="submit" onClick={onConfirm}>{__('确定')}</Dialog.Button>
            </Dialog.Footer>
        </Dialog>
    )
}