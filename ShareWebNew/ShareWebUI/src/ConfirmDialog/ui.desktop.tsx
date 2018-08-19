import * as React from 'react';
import { noop } from 'lodash';
import UIIcon from '../UIIcon/ui.desktop'
import Panel from '../Panel/ui.desktop'
import Dialog from '../Dialog2/ui.desktop';
import __ from './locale';
import * as styles from './styles.client'

const ConfirmDialog: React.StatelessComponent<UI.ConfirmDialog.Props> = function ConfirmDialog({
    onConfirm = noop,
    onCancel = noop,
    children,
    title
}) {
    return (
        <Dialog
            width={400}
            title={title ? title : __('提示')}
            onClose={onCancel}
        >
            <Panel>
                <Panel.Main>
                    <div className={styles['main']}>
                        <div className={styles['icon']}>
                            <UIIcon
                                code={'\uf077'}
                                color={'#f5a415'}
                                size={40}
                            />
                        </div>
                        <div className={styles['message']}>
                            {
                                children
                            }
                        </div>
                    </div>
                </Panel.Main>
                <Panel.Footer>
                    <Panel.Button
                        type="submit"
                        onClick={onConfirm}
                    >
                        {__('确定')}
                    </Panel.Button>
                    <Panel.Button
                        onClick={onCancel}
                    >
                        {__('取消')}
                    </Panel.Button>
                </Panel.Footer>
            </Panel>
        </Dialog>
    )
}

export default ConfirmDialog