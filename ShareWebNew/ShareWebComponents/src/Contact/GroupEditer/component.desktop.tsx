import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import GroupEditerBase from './component.base';
import GroupEditerView from './component.view';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class GroupEditer extends GroupEditerBase {

    render() {
        let { value, verifyStatus } = this.state;
        return (
            <Dialog
                title={__('编辑分组')}
                width={400}
                onClose={() => this.props.onGroupEditCancel()}
            >
                <GroupEditerView
                    value={value}
                    verifyStatus={verifyStatus}
                    oldName={this.props.oldName}
                    onGroupEditConfirm={this.onGroupEditConfirm.bind(this)}
                    onGroupEditChange={this.onGroupEditChange.bind(this)}
                    onGroupEditCancel={() => this.props.onGroupEditCancel()}

                />
            </Dialog>
        )
    }
}