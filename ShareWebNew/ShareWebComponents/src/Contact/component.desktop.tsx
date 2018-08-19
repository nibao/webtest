import * as React from 'react';
import ContactManager from './ContactManager/component.desktop';
import ContactAdder from './ContactAdder/component.desktop';
import GroupAdder from './GroupAdder/component.desktop';
import GroupEditer from './GroupEditer/component.desktop';
import GroupDeleter from './GroupDeleter/component.desktop';
import ContactBase from './component.base';
import { Action } from './helper';

export default class Contact extends ContactBase {

    render() {
        let { action, groupSelection } = this.state;
        return (
            <div>
                <ContactManager
                    onBatchAddContacts={() => { this.handleClickActionBtn(Action.BATCHADD) }}
                    onCreateGroup={() => { this.handleClickActionBtn(Action.CREATE) }}
                    onModifyGroup={() => { this.handleClickActionBtn(Action.EDIT) }}
                    onDeleteGroup={() => { this.handleClickActionBtn(Action.DELETE) }}
                    onGroupSelectionChange={this.handleGroupSelectionChange.bind(this)}
                    ref="contactManager"
                />
                {
                    this.renderContactDialog(action, groupSelection)
                }
            </div>
        )
    }

    renderContactDialog(action, groupSelection) {
        switch (action) {
            case Action.NOOP:
                return;
            case Action.BATCHADD:
                return (
                    <ContactAdder
                        onAddContactConfirm={this.handleBatchAddContacts.bind(this)}
                        onAddContactCancel={this.handleClickCloseAction.bind(this)}
                    />
                )
            case Action.CREATE:
                return (
                    <GroupAdder
                        onGroupAddConfirm={this.handleCreateGroup.bind(this)}
                        onGroupAddCancel={this.handleClickCloseAction.bind(this)}
                    />
                )
            case Action.EDIT:
                return (
                    <GroupEditer
                        oldName={groupSelection[0].groupname}
                        onGroupEditConfirm={this.handleModifyGroup.bind(this)}
                        onGroupEditCancel={this.handleClickCloseAction.bind(this)}
                    />
                )
            case Action.DELETE:
                return (
                    <GroupDeleter
                        onConfirmDelete={this.handleDeleteGroup.bind(this)}
                        onCancelDelete={this.handleClickCloseAction.bind(this)}
                    />
                )
            default:
                return;
        }
    }

}