import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import GroupsBase from './component.base';
import GroupView from './component.view';
import __ from './locale';

export default class Groups extends GroupsBase {
    render() {
        const { onClose, ...otherProps } = this.props;
        return (
            <Dialog
                width={700}
                title={__('群组管理')}
                onClose={onClose}
            >
                <GroupView
                    ref="groupView"
                    {...otherProps}
                />
            </Dialog>
        )
    }
}