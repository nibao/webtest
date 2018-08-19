import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.client';
import NWWindow from '../../../ui/NWWindow/ui.client';
import GroupAdderBase from './component.base';
import GroupAdderView from './component.view';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class GroupAdder extends GroupAdderBase {

    render() {
        let { value, verifyStatus } = this.state;
        return (
            <NWWindow
                modal={true}
                title={__('新建分组')}
                onClose={() => this.props.onGroupAddCancel()}
            >
                <Dialog
                    width={400}
                >
                    <GroupAdderView
                        value={value}
                        verifyStatus={verifyStatus}
                        onGroupAddConfirm={this.onGroupAddConfirm.bind(this)}
                        onGroupAddChange={this.onGroupAddChange.bind(this)}
                        onGroupAddCancel={() => this.props.onGroupAddCancel()}
                    />
                </Dialog>
            </NWWindow>
        )
    }
}