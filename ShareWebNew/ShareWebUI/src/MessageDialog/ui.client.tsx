import * as React from 'react';
import { noop } from 'lodash';
import UIIcon from '../UIIcon/ui.desktop'
import Panel from '../Panel/ui.desktop'
import Dialog from '../Dialog2/ui.client';
import __ from './locale';
import * as styles from './styles.client'

const MessageDialog: React.StatelessComponent<UI.MessageDialog.Props> = function MessageDialog({
    onConfirm = noop,
    children
}) {
    return (
        <Dialog
            width={400}
            >
            <Panel>
                <Panel.Main>
                    <div className={styles['main']}>
                        <div className={styles['icon']}>
                            <UIIcon
                                code={'\uf076'}
                                color={'#5a8cb4'}
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
                </Panel.Footer>
            </Panel>
        </Dialog>
    )
}

export default MessageDialog