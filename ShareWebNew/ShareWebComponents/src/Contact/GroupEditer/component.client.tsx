import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../../../ui/Dialog2/ui.client';
import NWWindow from '../../../ui/NWWindow/ui.client';
import GroupEditerBase from './component.base';
import GroupEditerView from './component.view';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class GroupEditer extends GroupEditerBase {

    render() {
        let { value, verifyStatus } = this.state;
        return (
            <NWWindow
                modal={true}
                title={__('编辑分组')}
                onClose={() => this.props.onGroupEditCancel()}
            >
                <Dialog
                    width={400}
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
            </NWWindow>
        )
    }
}