import * as React from 'react';
import { noop } from 'lodash';
import UIIcon from '../UIIcon/ui.desktop'
import Panel from '../Panel/ui.desktop'
import Dialog from '../Dialog2/ui.client';
import ErrorDialogTitle from '../ErrorDialog.Title/ui.desktop'
import ErrorDialogDetail from '../ErrorDialog.Detail/ui.desktop'
import __ from './locale';
import * as styles from './styles.client'

const ErrorDialog: React.StatelessComponent<UI.ErrorDialog.Props> = function ErrorDialog({
    children,
    onConfirm = noop,
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
                                code={'\uf075'}
                                color={'#be0000'}
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

ErrorDialog.Title = ErrorDialogTitle;
ErrorDialog.Detail = ErrorDialogDetail;

export default ErrorDialog