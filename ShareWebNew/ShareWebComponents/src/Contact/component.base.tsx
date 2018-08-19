import * as React from 'react';
import WebComponent from '../webcomponent';
import { Action } from './helper';
import { addGroup, addPersons, editGroup, deleteGroup } from '../../core/apis/eachttp/contact/contact';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import __ from './locale';

export default class ContactBase extends WebComponent<Components.Contact.Props, Components.Contact.State> {

    state = {
        action: Action.NOOP,
        groupSelection: []
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    /**
     * 按钮点击事件
     */
    protected handleClickActionBtn(action) {
        this.setState({
            action
        })
    }

    /**
     * 关闭窗口事件
     */
    protected handleClickCloseAction() {
        this.setState({
            action: Action.NOOP
        })
    }

    /**
     * 批量添加联系人
     */
    protected handleBatchAddContacts(candidates) {

        this.setState({
            action: Action.NOOP
        }, async () => {
            await addPersons({
                groupid: this.state.groupSelection[0].id,
                userids: candidates.map((user) => { return user.userid })
            });
            // 刷新页面
            this.refs.contactManager.loadContactsData(this.state.groupSelection[0].id)
        })
    }

    /**
     * 创建联系人分组
     */
    protected handleCreateGroup(groupName) {
        this.setState({
            action: Action.NOOP
        }, async () => {
            try {
                let { groupid } = await addGroup({ groupname: groupName });
                // 刷新页面
                this.refs.contactManager.loadContactsData(groupid)
            } catch (error) {
                error.errcode === ErrorCode.TokenExpired ?
                    null
                    :
                    error.errcode === ErrorCode.ContactGroupDuplicated ?
                        this.context.toast(__('联系人分组已存在'))
                        :
                        this.context.toast(error.errmsg)
            }

        });
    }

    /**
     * 编辑联系人分组
     */
    protected handleModifyGroup(groupName) {

        this.setState({
            action: Action.NOOP
        }, async () => {
            try {
                await editGroup({ groupid: this.state.groupSelection[0].id, newname: groupName });
                // 刷新页面
                this.refs.contactManager.loadContactsData(this.state.groupSelection[0].id)
            } catch (error) {
                error.errcode === ErrorCode.TokenExpired ?
                    null
                    :
                    error.errcode === ErrorCode.ContactGroupDuplicated ?
                        this.context.toast(__('联系人分组已存在'))
                        :
                        this.context.toast(error.errmsg)
            }

        });
    }

    /**
     * 删除联系人分组
     */
    protected handleDeleteGroup() {

        this.setState({
            action: Action.NOOP
        }, async () => {
            try {
                await deleteGroup({ groupid: this.state.groupSelection[0].id })
                // 刷新页面
                this.refs.contactManager.loadContactsData()
            } catch (error) {
                error.errcode === ErrorCode.TokenExpired ?
                    null
                    :
                    this.context.toast(error.errmsg)
            }

        });
    }

    /**
     * 分组选中项变动
     */
    protected handleGroupSelectionChange(groupSelection) {
        this.setState({
            groupSelection
        })
    }
}