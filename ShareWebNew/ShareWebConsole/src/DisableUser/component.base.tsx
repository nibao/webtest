import * as React from 'react'
import { noop } from 'lodash';
import { getDepartmentOfUsers } from '../../core/thrift/user/user';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { setUserStatus } from '../../core/thrift/sharemgnt/sharemgnt';
import WebComponent from '../webcomponent';
import { listUsersSince, Range, getSeletedUsers } from '../helper';
import { Status } from './helper';
import __ from './locale';

interface Props {
    users?: Array<any>; // 选择的用户 * any 后续补充

    dep: any; // 选择的部门 * any 后续补充

    userid: string; // 当前登录的用户

    onComplete: () => any; // 移除结束的事件

    onSuccess: () => {}; // 移除成功
}

interface State {
    selected: Range; // 选择禁用的对象

    status: Status; // 禁用的状态
}

export default class DisableUserBase extends WebComponent<Props, any> {
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
     * 检查是否存在不能被禁用的用户
     */
    checkUser(users: Array<any>): boolean {
        return !users.some((value, index) => {
            return value.id === this.props.userid
        })
    }

    /**
     * 禁用用户
     */
    async disableUsers(users: Array<any>) {
        for (let user of users) {
            try {
                await setUserStatus(user.id, false)
                await this.logDisable(user);
            }
            catch (ex) {
                if (ex.error.errID !== 20110) {
                    this.setState({
                        status: ex.error.errID
                    })
                    throw (ex);
                }
            };
        }
    }

    /**
     * 确定事件
     */
    async confirmDisableUsers() {
        this.setState({
            status: Status.LOADING
        })
        try {
            const users = await getSeletedUsers(this.state.selected, this.props.dep, this.props.users);
            if (this.checkUser(users)) {
                await this.disableUsers(users);
                this.props.onSuccess();
            } else {
                this.setState({
                    status: Status.CURRENT_USER_INCLUDED
                })
            }

        } catch (ex) {
            this.setState({
                status: ex.error.errID
            })
        }
    }

    logDisable(user) {
        return manageLog(ManagementOps.SET,
            __('禁用用户 “${displayName}(${loginName})” 成功', {
                'displayName': user.user.displayName,
                'loginName': user.user.loginName
            }),
            null,
            Level.WARN
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