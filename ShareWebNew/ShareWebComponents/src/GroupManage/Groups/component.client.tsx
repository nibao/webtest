import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.client';
import GroupsBase from './component.base';
import GroupView from './component.view';

export default class Groups extends GroupsBase {
    render() {
        return (
            <Dialog
                width={700}
            >
                <GroupView
                    ref="groupView"
                    {...this.props}
                />
            </Dialog>
        )
    }
}