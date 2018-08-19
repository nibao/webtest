import * as React from 'react';
import Dialog from '../Dialog2/ui.client';
import ProgressDialogBase from './ui.base';
import ProgressDialogView from './ui.view';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ProgressDialog extends ProgressDialogBase {
    render() {
        const { progress, item } = this.state;
        return (
            <Dialog width={440}>
                <ProgressDialogView
                    detailTemplate={this.props.detailTemplate}
                    item={item}
                    progress={progress}
                    prohandleCancel={this.handleCancel.bind(this)}
                />
            </Dialog>
        )
    }
}