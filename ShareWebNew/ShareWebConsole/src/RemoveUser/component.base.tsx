import * as React from 'react'
import { noop } from 'lodash';
import { getDepartmentOfUsers } from '../../core/thrift/user/user';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { removeUserFromDepartment } from '../../core/thrift/sharemgnt/sharemgnt';
import WebComponent from '../webcomponent';
import { listUsersSince, Range, getSeletedUsers } from '../helper';
import __ from './locale';

export enum Status {
    NORMAL,

    CURRENT_USER_INCLUDED, // 当前用户

    LOADING // 加载中
}


interface Props {
    users?: Array<any>; // 选择的用户 * any 后续补充

    dep: any; // 选择的部门 * any 后续补充

    userid: string; // 当前登录的用户

    onComplete: () => any; // 移除结束的事件

    onSuccess: () => {}; // 移除成功
}

interface State {
    selected: Range; // 选择移除的对象

    status: Status; // 移除的状态
}

export default class RemoveUserBase extends WebComponent<Props, any> {
    static defaultProps = {
        users: [],
        dep: null,
        userid: '',
        onComplete: noop,
        onSuccess: noop
    }


    state = {
        selected: this.props.users.length ? Range.USERS : Range.DEPARTMENT,
        status: Status.NORMAL
    }


    componentsWillMount() {
        this.setState({
            selected: this.props.users.length ? Range.USERS : Range.DEPARTMENT
        })
    }

    /**
     * 检查是否存在不能被移除的用户
     */
    checkUser(users: Array<any>): boolean {
        return !users.some((value, index) => {
            if (value.id === this.props.userid) {
                this.setState({
                    status: Status.CURRENT_USER_INCLUDED
                })
                return true
            }
        })
    }

    /**
     * 移除用户
     */
    async removeUsers(users: Array<any>) {
        for (let user of users) {
            try {
                let result = await removeUserFromDepartment([user.id], this.state.selected === Range.DEPARTMENT_DEEP ? user.directDeptInfo.departmentId : this.props.dep.id)
                if (result &&  result.length === 0) {
                    await this.logRemoved(user);
                }
            }
            catch (ex) {
                if (ex.error.errID !== 20110) {
                    this.setState({
                        status: ex.error.errID
                    })
                    throw (ex);
                }
            }
        }
    }

    /**
     * 确定事件
     */
    async confirmRemoveUsers() {
        this.setState({
            status: Status.LOADING
        })
        const users = await getSeletedUsers(this.state.selected, this.props.dep, this.props.users);
        if (this.checkUser(users)) {
            await this.removeUsers(users);
            this.props.onSuccess();
        }

    }

    logRemoved(user) {
        return manageLog(ManagementOps.REMOVE,
            __('移除用户 “${displayName}(${loginName})” 成功', {
                'displayName': user.user.displayName,
                'loginName': user.user.loginName
            }),
            null,
            Level.INFO
        )
    }

    /**
     * 选择要删除的对象
     * @param value 部门、部门及其子部门、所选中的
     */
    onSelectedType(value) {
        this.setState({
            selected: value
        })
    }
}