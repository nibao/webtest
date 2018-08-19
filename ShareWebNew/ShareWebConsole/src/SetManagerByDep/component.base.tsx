import * as React from 'react';
import { noop } from 'lodash';
import { usrmGetDepartResponsiblePerson, usrmAddResponsiblePerson, usrmEditLimitSpace, usrmDeleteResponsiblePerson } from '../../core/thrift/sharemgnt/sharemgnt';
import { getUserInfo } from '../../core/thrift/user/user';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class SetManagerByDepBase extends WebComponent<Console.SetManagerByDep.Props, Console.SetManagerByDep.State> {
    static defaultProps = {
        departmentId: '',
        departmentName: '',
        userid: '',
        onSetSuccess: noop,
        onCancel: noop
    }

    state = {
        isConfigManager: true,
        isAddingManager: false,
        managers: [],
        currentUser: null,
        isLimitUserSpace: false,
        limitUserSpace: '',
        limitUserSpaceEmpty: false,
        isLimitDocSpace: false,
        limitDocSpace: '',
        limitDocSpaceEmpty: false,
        errorStatus: null,
        isSetting: false
    }

    /**
     * 增加的用户
     */
    addedManagers = [];

    /**
     * 删除的组织管理员
     */
    deleteManagers = [];

    /**
     * 原始数据
     */
    originManagers = null;

    async componentWillMount() {
        let managers = await usrmGetDepartResponsiblePerson([this.props.departmentId]);
        this.originManagers = managers;
        this.setState({
            managers
        })
    }
    /**
     * 获取部门名
     * @param dep 部门
     * @return 返回部门名
     */
    protected userDataFormatter = (person: Core.ShareMgnt.ncTUsrmGetUserInfo): string => {
        return person.user.displayName
    }

    /**
     * 删除组织管理员
     */
    protected deleteManager = (data: Array<Core.ShareMgnt.ncTUsrmGetUserInfo>) => {
        for (let manager of this.state.managers) {
            if (!data.find(value => { return manager.id === value.id })) {
                this.addedManagers = this.addedManagers.filter(addManager => addManager.id !== manager.id)
                if (this.originManagers.find(originManager => originManager.id === manager.id)) {
                    this.deleteManagers = [...this.deleteManagers, manager]
                }
            }
        }
        this.setState({
            managers: data
        })

    }

    /**
     * 打开添加窗口
     */
    protected openAddManager = () => {
        this.setState({
            isAddingManager: true,
            isLimitUserSpace: false,
            limitUserSpace: '',
            isLimitDocSpace: false,
            limitDocSpace: '',
            currentUser: null,
            limitUserSpaceEmpty: false,
            limitDocSpaceEmpty: false
        })
    }

    /**
     * 选择用户
     */
    protected selectUser = async (user) => {
        const userInfo = await getUserInfo(user.id)
        this.setState({
            currentUser: userInfo
        })
        if (userInfo.user.limitSpaceInfo) {
            this.setState({
                isLimitUserSpace: userInfo.user.limitSpaceInfo.limitUserSpace === -1 ? false : true,
                limitUserSpace: userInfo.user.limitSpaceInfo.limitUserSpace === -1 ? '' : (userInfo.user.limitSpaceInfo.limitUserSpace / Math.pow(1024, 3)).toFixed(2),
                isLimitDocSpace: userInfo.user.limitSpaceInfo.limitDocSpace === -1 ? false : true,
                limitDocSpace: userInfo.user.limitSpaceInfo.limitDocSpace === -1 ? '' : (userInfo.user.limitSpaceInfo.limitDocSpace / Math.pow(1024, 3)).toFixed(2)
            })
        } else {
            this.setState({
                isLimitUserSpace: false,
                limitUserSpace: '',
                isLimitDocSpace: false,
                limitDocSpace: ''
            })
        }
    }

    /**
     * 更改用户限额空间状态
     */
    protected changeUserSpaceStatus = (checked) => {
        if (!checked) {
            this.setState({
                limitUserSpace: '',
                limitUserSpaceEmpty: false
            })
        }
        this.setState({
            isLimitUserSpace: checked
        })
    }

    /**
     * 更改用户限额空间
     */
    protected changeUserSpace = (space) => {
        if (space === '' || Number(space) <= 1000000) {
            this.setState({
                limitUserSpace: space,
                limitUserSpaceEmpty: false
            })
        } else {
            this.setState({
                limitUserSpace: this.state.limitUserSpace,
                limitUserSpaceEmpty: false
            })
        }

    }

    /**
     * 更改文档限额空间状态
     */
    protected changeDocSpaceStatus = (checked) => {
        if (!checked) {
            this.setState({
                limitDocSpace: '',
                limitDocSpaceEmpty: false
            })
        }
        this.setState({
            isLimitDocSpace: checked
        })
    }

    /**
     * 更改文档限额空间
     */
    protected changeDocSpace = (space) => {
        if (space === '' || Number(space) <= 1000000) {
            this.setState({
                limitDocSpace: space,
                limitDocSpaceEmpty: false
            })
        } else {
            this.setState({
                limitDocSpace: this.state.limitDocSpace,
                limitDocSpaceEmpty: false
            })
        }

    }

    /**
     * 取消编辑
     */
    protected cancelAddManager = () => {
        this.setState({
            isAddingManager: false,
            currentUser: null
        })
    }

    /**
     * 确定增加管理员
     */
    protected onConfirmAddManager = () => {
        const checkDocResult = this.checkDocSpace();
        const checkUserResult = this.checkUserSpace()
        if (!checkDocResult || !checkUserResult) {
            return
        }
        const limitSpaceInfo = {
            limitUserSpace: this.state.isLimitUserSpace ? Number(this.state.limitUserSpace) * Math.pow(1024, 3) : -1,
            limitDocSpace: this.state.isLimitDocSpace ? Number(this.state.limitDocSpace) * Math.pow(1024, 3) : -1
        }
        this.setState({
            managers: [...this.state.managers.filter((value) => {
                return value.id !== this.state.currentUser.id
            }), { ...this.state.currentUser, user: { ...this.state.currentUser.user, limitSpaceInfo: limitSpaceInfo } }],
            isAddingManager: false
        })
        this.addedManagers = [...this.addedManagers, { ...this.state.currentUser, user: { ...this.state.currentUser.user, limitSpaceInfo: limitSpaceInfo } }];
    }

    /**
     * 确定保存组织管理员
     */
    protected onConfirmManager = async () => {
        this.setState({
            isConfigManager: false,
            isSetting: true
        })
        try {
            await this.deletingManager()
            await this.addManagers()
            this.setState({
                isSetting: false
            })
            this.props.onSetSuccess()
        } catch (ex) {
            this.setState({
                errorStatus: ex,
                isSetting: false
            })
        }
    }

    /**
     * 增加的组织管理员
     */
    private async addManagers() {
        for (let manager of this.addedManagers) {
            try {
                await usrmAddResponsiblePerson([manager.id, this.props.departmentId])
                await usrmEditLimitSpace([manager.id, manager.user.limitSpaceInfo.limitUserSpace, manager.user.limitSpaceInfo.limitDocSpace])
                manageLog(ManagementOps.SET,
                    __('将 “${userName}” 设置为 “${departmentName}”的组织管理员', { userName: manager.user.displayName, departmentName: this.props.departmentName }),
                    this.getSpaceMessage(manager),
                    Level.INFO
                )
            } catch (ex) {
                throw ex
            }
        }
    }

    /**
     * 删除的组织管理员
     */
    private async deletingManager() {
        for (let manager of this.deleteManagers) {
            try {
                await usrmDeleteResponsiblePerson([manager.id, this.props.departmentId])
                manageLog(ManagementOps.SET,
                    __('取消 “${name}” 为 “${departmentName}”的组织管理员', { name: manager.user.displayName, departmentName: this.props.departmentName }),
                    null,
                    Level.INFO
                )
            } catch (ex) {
                throw ex
            }
        }
    }

    /**
     * 关闭错误弹窗
     */
    protected closeError = () => {
        this.setState({
            errorStatus: null
        })
        this.props.onCancel()
    }

    /**
     * 检查用户输入框的合法性
     */
    private checkUserSpace() {
        if (this.state.limitUserSpace === '' && this.state.isLimitUserSpace) {
            this.setState({
                limitUserSpaceEmpty: true
            })
            return false;
        }
        return true;
    }

    /**
     * 检查文档输入框的合法性
     */
    private checkDocSpace() {
        if (this.state.limitDocSpace === '' && this.state.isLimitDocSpace) {
            this.setState({
                limitDocSpaceEmpty: true
            })
            return false;
        }
        return true;
    }

    /**
     * 获取日志的附加信息
     */
    private getSpaceMessage(manager) {
        let limitUserMessage, limitDocMessage
        if (manager.user.limitSpaceInfo.limitUserSpace === -1) {
            limitUserMessage = __('不限制其用户管理最大可分配空间，')
        } else {
            limitUserMessage = __('限制其用户管理最大可分配空间为${quota}GB，', {
                quota: manager.user.limitSpaceInfo.limitUserSpace / Math.pow(1024, 3)
            })
        }
        if (manager.user.limitSpaceInfo.limitDocSpace === -1) {
            limitDocMessage = __('不限制其文档管理最大可分配空间')
        } else {
            limitDocMessage = __('限制其文档管理最大可分配空间为${quota}GB', {
                quota: manager.user.limitSpaceInfo.limitDocSpace / Math.pow(1024, 3)
            })
        }
        return `${limitUserMessage},${limitDocMessage}。`
    }
}