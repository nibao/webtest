import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import GroupAdderBase from './component.base';
import GroupAdderView from './component.view';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class GroupAdder extends GroupAdderBase {

    render() {
        let { value, verifyStatus } = this.state;
        return (
            <Dialog
                title={__('新建分组')}
                width={400}
                onClose={() => this.props.onGroupAddCancel()}
            >
                <GroupAdderView
                    value={value}
                    verifyStatus={verifyStatus}
                    onGroupAddConfirm={this.onGroupAddConfirm.bind(this)}
                    onGroupAddChange={this.onGroupAddChange.bind(this)}
                    onGroupAddCancel={() => this.props.onGroupAddCancel()}
                />
            </Dialog>
        )
    }
}