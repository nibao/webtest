import * as React from 'react';
import UIView from '../../UI/view';
import Dialog from '../../../../ui/Dialog/ui.desktop';

export default function DialogView() {
    return (
        <UIView
            name={ '<Dialog />' }
            description={ '搜索组件' }
            api={
                [
                ]
            }>
            <Dialog>
                <Dialog.Header onClose={ () => alert('close') } closable={ true }>Header</Dialog.Header>
                <Dialog.Main>Main</Dialog.Main>
                <Dialog.Footer>
                    <Dialog.Button>关闭</Dialog.Button>
                </Dialog.Footer>
            </Dialog>
        </UIView>
    )
}