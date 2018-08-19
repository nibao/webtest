import * as React from 'react'
import { noop } from 'lodash';
import { getDepartmentOfUsers } from '../../core/thrift/user/user';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { getLocalSiteInfo } from '../../core/thrift/sharesite/sharesite';
import { SiteType } from '../../core/thrift/sharesite/helper';
import { moveUserToDepartment, editUserSite } from '../../core/thrift/sharemgnt/sharemgnt';
import WebComponent from '../webcomponent';
import { listUsersSince, Range, getSeletedUsers } from '../helper';
import __ from './locale';

export enum Status {
    NORMAL,

    CURRENT_USER_INCLUDED, // 当前用户

    CHANGE_SITE, // 切换站点

    LOADING, // 加载中

    DESTDEPARTMENT_NOT_EXIST = 20211 // 目标部门不存在
}
interface TreeNodeStatus {
    disabled: boolean
}
interface Props {
    users?: Array<any>; // 选择的用户 * any 后续补充

    dep: any; // 选择的部门 * any 后续补充

    userid: string; // 当前登录的用户

    onComplete: () => any; // 移动结束的事件

    onSuccess: () => {}; // 移动成功
}

interface State {
    selected: Range; // 选择移动的对象

    status: Status; // 移动的状态

    selectedDep: any; // 选中的部门
}
export default class MoveUserBase extends WebComponent<Props, any> {
    static defaultProps = {
        users: [],

        dep: null,

        userid: '',

        onComplete: noop,

        onSuccess: noop
    }

    state = {
        selected: Range.USERS,

        status: Status.NORMAL,

        selectedDep: null
    }

    users = []

    componentWillMount() {
        this.setState({
            selected: this.props.users.length ? Range.USERS : Range.DEPARTMENT
        })
    }

    /**
     * 检查是否存在不能被删除的用户
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
     * 选择目标部门
     * @param value  目标部门 
     */
    protected selectDep(value) {
        this.setState({
            selectedDep: value
        })
    }

    /**
     * 移动用户
     * @param changeSite 是否要改变站点 
     */
    private async moverUser(changeSite, users) {
        this.setState({
            status: Status.LOADING
        })

        for (let user of users) {
            try {
                if (changeSite) {
                    let result = await moveUserToDepartment(
                        [user.id],
                        this.state.selected === Range.DEPARTMENT_DEEP || (user && user.directDeptInfo) ?
                            user.directDeptInfo.departmentId :
                            this.props.dep.id,
                        this.state.selectedDep.id
                    )
                    if (result && result.length === 0) {
                        await this.logUserMove(user)
                    }
                    await editUserSite(user.id, this.state.selectedDep.siteInfo.id)
                    await this.logSiteEdit(user);

                } else {
                    let result = await moveUserToDepartment(
                        [user.id],
                        this.state.selected === Range.DEPARTMENT_DEEP || (user && user.directDeptInfo) ?
                            user.directDeptInfo.departmentId :
                            this.props.dep.id,
                        this.state.selectedDep.id
                    )
                    if (result && result.length === 0) {
                        await this.logUserMove(user)
                    }

                }
            } catch (ex) {
                if (ex.error.errID !== 20110) {
                    this.setState({
                        status: ex.error.errID
                    })
                    throw ex
                }
            }
        }

    }
    /**
     * 点击确定
     */
    protected async confirmMoveUsers() {
        let { type } = await getLocalSiteInfo();
        this.users = await getSeletedUsers(this.state.selected, this.props.dep, this.props.users);
        if (this.checkUser(this.users)) {
            if (type === SiteType.NCT_SITE_TYPE_NORMAL || type === SiteType.NCT_SITE_TYPE_SLAVE) {
                await this.moverUser(false, this.users);
                this.props.onSuccess()
            } else {
                this.setState({
                    status: Status.CHANGE_SITE
                })
            }
        }

    }

    /**
     * 确定改变站点
     */
    protected async confirmChangeSite() {
        await this.moverUser(true, this.users)
        this.props.onSuccess()
    }

    /**
     * 取消改变站点
     */
    protected async cancelChangeSite() {
        await this.moverUser(false, this.users)
        this.props.onSuccess()
    }

    /**
     * 禁用当前部门
     * @param node 当前部门 
     */
    getDepartmentStatus(node): TreeNodeStatus {
        if (this.props.dep.data.id === node.id) {
            return {
                disabled: true
            }
        } else {
            return {
                disabled: false
            }
        }
    }

    /**
     * 记录移动用户日志
     * @param user  当前移动的日志
     */
    logUserMove(user) {
        return manageLog(ManagementOps.MOVE,
            __('移动用户“${username}(${loginName})”至部门“${orgname}”成功', {
                username: user.user.displayName,
                loginName: user.user.loginName,
                orgname: this.state.selectedDep.name
            }),
            null,
            Level.INFO
        )
    }


    logSiteEdit(user) {
        return manageLog(
            ManagementOps.SET,
            __('编辑用户 "${displayName}(${loginName})" 成功', { displayName: user.user.displayName, loginName: user.user.loginName }),
            __('归属站点 “${siteName}”', { siteName: this.state.selectedDep.siteInfo.name }),
            Level.INFO)
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