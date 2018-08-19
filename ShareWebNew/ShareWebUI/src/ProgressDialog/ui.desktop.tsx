import * as React from 'react';
import ProgressBar from '../ProgressBar/ui.desktop';
import Dialog from '../Dialog2/ui.desktop';
import Panel from '../Panel/ui.desktop';
import Text from '../Text/ui.desktop';
import ProgressDialogBase from './ui.base';
import ProgressDialogView from './ui.view';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ProgressDialog extends ProgressDialogBase {
    render() {
        const { progress, item } = this.state;
        return (
            <Dialog
                title={this.props.title}
                width={440}
                onClose={this.handleCancel.bind(this)}
            >
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