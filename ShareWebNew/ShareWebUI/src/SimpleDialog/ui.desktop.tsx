import * as React from 'react';
import { noop } from 'lodash';
import Panel from '../Panel/ui.desktop'
import Dialog from '../Dialog2/ui.desktop';
import __ from './locale';
import * as styles from './styles.client'

const SimpleDialog: React.StatelessComponent<UI.SimpleDialog.Props> = function SimpleDialog({
    onConfirm = noop,
    onClose,
    children
}) {
    return (
        <Dialog
            width={400}
            title={__('提示')}
            onClose={onClose || onConfirm}
            >
            <Panel>
                <Panel.Main>
                    <div className={styles['main']}>
                        {
                            children
                        }
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

export default SimpleDialog