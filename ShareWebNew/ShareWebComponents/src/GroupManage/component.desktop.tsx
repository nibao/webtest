import * as React from 'react';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import MessageConfirmDialog from './MessageConfirmDialog/component.desktop'
import DelConfirmDialog from './DelConfirmDialog/component.desktop';
import Groups from './Groups/component.desktop';
import GroupManageBase from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.desktop';

export default class GroupManage extends GroupManageBase {

    render() {
        const { activeId, warning, data, scroll, errcode } = this.state;
        const creating = activeId === 'create';
        return (
            <div className={styles['container']}>
                {
                    this.state.status !== Status.NoPop ?
                        this.state.status === Status.NoUserDoc ?
                            <MessageDialog onConfirm={() => this.props.onClose()}>
                                <p>{__('您已被关闭个人文档，无法使用此功能。')}</p>
                            </MessageDialog> :
                            <Groups
                                ref="groups"
                                onClose={() => this.props.onClose()}
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
                        null
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
                        <MessageConfirmDialog
                            errcode={this.state.errcode}
                            extraMsg={this.state.extraMsg}
                            onConfirm={() => this.confirmErrorMsg()}
                        />
                        : null
                }
            </div>

        );
    }
}
