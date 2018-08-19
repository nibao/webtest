import * as React from 'react';
import { noop, isArray, assign } from 'lodash';
import { getDiskRootData, getDepartmentUser, getAllUser, getSubDepartments } from '../../../core/thrift/sharemgnt/sharemgnt';
import session from '../../../util/session/session';
import __ from './locale';

export default class DiskUserTreeBase extends React.Component<Console.EnableDisk.DiskUserTree.Props, Console.EnableDisk.DiskUserTree.State> {
    static defaultProps = {
        onSelectionChange: noop
    }

    state = {
        nodes: []
    }

    componentDidMount() {
        // 初始化，获取根数据
        this.getRootData();
    }

    private async getRootData() {
        const nodes = await getDiskRootData([session.get('userid')]);

        this.setState({
            nodes: [
                { id: '-1', name: __('未分配组'), subDepartmentCount: 0, subUserCount: 0 },
                { id: '-2', name: __('所有用户'), subDepartmentCount: 0, subUserCount: 0 },
                ...nodes
            ]
        })
    }

    /**
     * 展开节点
     */
    protected expand(node: any) {
        if (isArray(node.children)) {
            // 如果children存在 则使用缓存
            this.forceUpdate();
        } else {
            this.appendChild(node);
        }
    }

    /**
     * 向指定节点添加子节点并重新渲染组件
     */
    private async appendChild(node: any) {
        let allUser;

        if (node.id === '-2') {
            allUser = await getAllUser([0, -1]);
        } else {
            const [orgUser, depUser] = await Promise.all([
                getDepartmentUser([node.id, 0, -1]),
                getSubDepartments([node.id])
            ]);
            allUser = [...orgUser, ...depUser];
        }

        assign(node, {
            children: (allUser.map(data => ({
                ...data,
                id: data.id,
                name: (data.user && data.user.displayName) || data.name // 如果是用户取用户的displayName属性，如果是部门取name属性
            })))
        });

        this.forceUpdate();
    }
}