import * as React from 'react';
import NWWindow from '../../ui/NWWindow/ui.client';
import MessageDialog from '../../ui/MessageDialog/ui.client';
import Icon from '../../ui/Icon/ui.desktop';
import { ClientComponentContext } from '../helper'
import Mounting from '../Mounting/component.client'
import MessageConfirmDialog from './MessageConfirmDialog/component.client'
import DelConfirmDialog from './DelConfirmDialog/component.client';
import Groups from './Groups/component.client';
import GroupManageBase from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.desktop';

export default class GroupManage extends GroupManageBase {

    render() {
        const { onOpenGroupManagedDialog, onClose, fields, id } = this.props
        const { activeId, warning, data } = this.state;
        const creating = activeId === 'create';

        return (
            <NWWindow
                id={id}
                title={__('群组管理')}
                onOpen={onOpenGroupManagedDialog}
                onClose={onClose}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div className={styles['container']}>
                        {
                            this.state.status !== Status.NoPop ?
                                this.state.status === Status.NoUserDoc ?
                                    <MessageDialog
                                        onConfirm={this.props.onClose}>
                                        <p>{__('您已被关闭个人文档，无法使用此功能。')}</p>
                                    </MessageDialog>
                                    :
                                    <Groups
                                        ref="groups"
                                        data={data}
                                        onCreate={this.handleCreate}
                                        creating={creating}
                                        warning={warning}
                                        activeId={activeId}
                                        computeMaxSize={this.computeMaxSize}
                                        onEdit={this.handleEdit}
                                        onConfirmCreate={this.handleConfirmCreate}
                                        onSave={this.handleSave}
                                        onDel={this.handleDel}
                                        onCancle={this.handleCancle}
                                        onError={this.handleError}
                                    />
                                :
                                <Mounting />
                        }
                        {
                            this.state.delModel ?
                                <DelConfirmDialog
                                    docid={this.delId}
                                    onConfirm={this.handleConfirmDel.bind(this)}
                                    onCancel={this.handleCancleDel.bind(this)}
                                /> : null
                        }
                        {
                            this.state.errcode ?
                                <NWWindow
                                    title={__('提示')}
                                    onOpen={nwWindow => this.MessageConfirmDialog = nwWindow}
                                    onClose={() => this.confirmErrorMsg()}
                                    modal={true}
                                >
                                    <MessageConfirmDialog
                                        errcode={this.state.errcode}
                                        extraMsg={this.state.extraMsg}
                                        onConfirm={() => this.confirmErrorMsg()}
                                    />
                                </NWWindow>
                                : null
                        }
                    </div>
                </ClientComponentContext.Consumer>
            </NWWindow>
        );
    }
}
