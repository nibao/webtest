import * as React from 'react';
import { noop, uniq } from 'lodash';
import { getAllUser, setUserStatus } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { Range, getSeletedUsers } from '../helper';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class EnableDiskBase extends WebComponent<Console.EnableDisk.Props, Console.EnableDisk.State> {
    static defaultProps = {
        onCancel: noop,

        onConfirm: noop
    }
    state = {
        nodes: [],
        selection: []
    }

    /**
     *  确认事件
     */
    protected async onConfirm() {
        const { selection } = this.state
        let allusers: ReadonlyArray<any> = []

        if (selection.some(item => item.id === '-2')) {
            // 选择节点包含所有用户时调该接口
            allusers = await getAllUser([0, -1]);
        } else {
            allusers = uniq([...(await this.getUsers(selection))], 'id')
        }

        try {
            await Promise.all([
                allusers.map(async (item) => {
                    await setUserStatus(item.id, true);
                    return this.logEnabled(item);
                })
            ])

            this.props.onConfirm();
        } catch (e) {
            this.props.onConfirm();
        }
    }

    /**
     * 获取选中节点下的所有用户
     * @param selection：选中的树节点
     * @return users：节点下包含的所有用户
     */
    private async getUsers(selection: ReadonlyArray<any>): Promise<ReadonlyArray<any> | undefined> {
        let users: Array<any> = [];

        try {
            const userValues: Array<any> = await Promise.all(selection.map(async (item) => {
                if (item.user) {
                    users = [...users, item]
                } else {
                    return await getSeletedUsers(Range.DEPARTMENT_DEEP, item)
                }
            }))

            let subUsers: Array<any> = [];

            userValues.map(item => {
                if (item !== undefined) {
                    subUsers = [...subUsers, ...item]
                }
            })

            return [...users, ...subUsers];
        } catch (err) {
            this.props.onConfirm();
        }
    }

    /**
     * 启用用户日志
     * @param user 用户
     */
    private logEnabled({ user }: { user: { displayName: string, loginName: string } }) {
        return manageLog(ManagementOps.SET,
            __('启用 用户 “${displayName}(${loginName})” 成功', {
                'displayName': user.displayName,
                'loginName': user.loginName
            }),
            '',
            Level.INFO
        )
    }
}