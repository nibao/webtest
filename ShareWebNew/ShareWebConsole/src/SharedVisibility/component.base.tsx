import * as React from 'react'
import { trim, uniq } from 'lodash'
import { ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import __ from './locale'


/**
 * 搜索范围
 */
export enum SearchField {
    UserName = 1,
    ShowName,   
    AllUsers,
}
/**
 * 搜索结果展示
 */
export enum ShowField {
    ShowName = 1,   
    AllUsers,
}

export default class SharedVisibilityBase extends WebComponent<any, any> {
    state: Console.SharedVisibility.State = {
        hideUserStatus: false,

        hideOrgStatus: false,

        value: '',

        departments: [],

        showOrganizationPicker: false,

        exactSearch: false,

        searchRange: SearchField.AllUsers,

        searchResults: ShowField.AllUsers,

        changed: false,
    }

    async componentWillMount() {
        // 获取屏蔽组织架构状态、 屏蔽组织结构用户成员信息
        this.setState({
            hideOrgStatus: await ShareMgnt('HideOum_GetStatus'),
            hideUserStatus: await ShareMgnt('GetHideUserInfoStatus'),
            departments: await ShareMgnt('HideOum_Get')
        })

        // 获取搜索显示配置信息
        this.getSearchUserConfig();
    }

    /**
     * 记录日志
     */
    log(): Promise<void> {
        return manageLog(
            ManagementOps.SET,
            __('开启 屏蔽组织结构信息 成功'),
            '',
            Level.INFO
        );
    }

    /**
     * 设置屏蔽用户信息状态
     */
    async setHideUserStatus(status: boolean) {
        await ShareMgnt('SetHideUserInfoStatus', [status])

        // 记录日志
        manageLog(
            ManagementOps.SET,
            status ? __('开启 屏蔽用户成员信息 成功') : __('取消 屏蔽用户成员信息 成功'),
            '',
            Level.INFO
        )


        this.setState({
            hideUserStatus: status
        })


    }

    /**
     * 设置屏蔽组织架构状态
     */
    async setHideOrgStatus(status: boolean) {
        await ShareMgnt('HideOum_SetStatus', [status])

        // 记录日志
        manageLog(
            ManagementOps.SET,
            status ? __('开启 屏蔽组织结构信息 成功') : __('取消 屏蔽组织结构信息 成功'),
            '',
            Level.INFO
        )


        this.setState({
            hideOrgStatus: status
        })
    }

    /**
     * 搜索框的值发生变化
     */
    protected handleValueChange(value: string) {
        this.setState({
            value
        })
    }

    /**
     * 搜索value
     */
    protected loader(value: string): Promise<ReadonlyArray<Console.SharedVisibility.Department>> {
        if (trim(value)) {
            return ShareMgnt('HideOum_Search', [value])
        } else {
            return ShareMgnt('HideOum_Get')
        }
    }

    /**
     * 搜索完成触发
     */
    protected handleLoad(departments: ReadonlyArray<Console.SharedVisibility.Department>) {
        this.setState({
            departments
        })
    }

    /**
     * 添加部门
     */
    protected async addDepartment(departments: ReadonlyArray<any>) {

        this.setState({
            showOrganizationPicker: false
        })

        // 从departments中去掉已经添加过的部门
        const addDepartments = departments.filter(department => !this.state.departments.some(({departmentId}) => departmentId === department.departmentId))

        if (addDepartments.length) {
            const departmentIds = addDepartments.map(department => department.departmentId)

            await ShareMgnt('HideOum_Add', [departmentIds])

            const names = addDepartments.map(({departmentName}) => departmentName)

            // 记录日志
            manageLog(
                ManagementOps.CREATE,
                __('对“${names}”部门的用户屏蔽组织结构', { names: names.join(' ') }),
                '',
                Level.INFO
            )

            const newDepartments = [...addDepartments.reverse(), ...this.state.departments]

            this.setState({
                departments: newDepartments
            })
        }
    }

    /**
     * 删除部门
     */
    protected async deleteDepartment({departmentId, departmentName}: { departmentId: string, departmentName: string }) {
        await ShareMgnt('HideOum_Delete', [departmentId])

        // 记录日志
        manageLog(
            ManagementOps.DELETE,
            __('删除“${departmentName}”部门的用户屏蔽组织结构', { departmentName }),
            '',
            Level.INFO
        )

        this.setState({
            departments: this.state.departments.filter(deparment => deparment.departmentId !== departmentId)
        })
    }

    /**
     * 获取搜索显示配置信息
     */
    private async getSearchUserConfig() {
        let { exactSearch, searchRange, searchResults } = await ShareMgnt('GetSearchUserConfig');
        this.setState({ 
            exactSearch,
            searchRange,
            searchResults,
        });
    }

    /**
     * 改变搜索方式
     * @param exactSearch 搜索方式
     */
    protected handleChangeMethod(exactSearch: boolean) {
        this.setState({
            exactSearch,
            changed: true,
        })
    }

    /**
     * 改变搜索范围
     * @param searchRange 
     */
    protected handleChangeSearch(searchRange: number) {
        this.setState({
            searchRange,
            changed: true,
        })
    }

    /**
     * 改变显示范围
     * @param searchResults
     */
    protected handleChangeShowField(searchResults: number) {
        this.setState({
            searchResults,
            changed: true,
        })
    }


    /**
     * 保存搜索显示设置
     */
    protected async handleSave() {
        try {
            await ShareMgnt(
                'SetSearchUserConfig', 
                [{
                    ncTSearchUserConfig: {
                        exactSearch: this.state.exactSearch,
                        searchRange: this.state.searchRange,
                        searchResults: this.state.searchResults
                    }
                }]
            );
            manageLog(
                ManagementOps.SET, 
                __('允许 ${exactSearch} 搜索 ${searchRange} 信息 ，搜索结果展示 ${searchResults} 成功', 
                {
                    exactSearch: this.state.exactSearch === false ? __('模糊') : __('精确'),
                    searchRange: this.state.searchRange === 1 ?  __('用户名') : this.state.searchRange === 2 ? __('显示名') : __('用户名/显示名'),
                    searchResults: this.state.searchResults === 1 ?  __('显示名') :  __('用户名/显示名'),
                }), 
                '',
                Level.INFO
            );
        }finally {
            this.setState({
                changed: false,
            })
        }     
    }

    /**
     * 取消搜索显示设置
     */
    protected handleCancel() {
        this.getSearchUserConfig();
        this.setState({
            changed: false,
        })
    }
}