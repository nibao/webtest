import * as React from 'react';
import { noop, uniq, assign } from 'lodash';
import { NodeType, getNodeType } from '../OrganizationTree/helper';
import __ from './locale';

interface Props {
    // 点击确定事件
    onConfirm: (data: Array<Object>) => any;
    // 点击取消事件
    onCancel: () => any;
    // 当前管理员id
    userid: string;
    // 是否加载用户
    selectType?: Array<NodeType>;

    // dialog 头信息
    title: string;

    // 初始值
    data?: Array<any>;

    // 数据转换内部数据结构
    converterIn?: (x) => Node;

    // 数据转换外部数据结构
    convererOut: (Node) => any;
}

interface State {
    // 新加的部门
    data: Array<Node>
}

// 部门信息
interface Node {
    // 名称
    name: string,

    // id
    id: string,

    // 类型
    type: NodeType,

    // 原始数据
    origin?: any
}

export default class OrganizationPickBase extends React.Component<Props, State> {

    static defaultProps = {
        onConfirm: noop,
        onCancel: noop,
        userid: '',
        selectType: [NodeType.ORGANIZATION, NodeType.DEPARTMENT],
        title: __('添加部门'),
        data: [],
        converterIn: (x) => x
    }

    state = {
        data: this.props.data.map(this.props.converterIn)
    }

    /**
     * 选择共享者
     * @param value 共享者
     */
    selectDep(value) {
        this.setState({
            data: uniq(this.state.data.concat({
                id: value.id || value.departmentId,
                name: value.name || value.displayName || value.departmentName || (value.user && value.user.displayName),
                type: getNodeType(value),
                original: value
            }), 'id')
        })
    }

    /**
     * 删除已选部门
     * @param dep 部门
     */
    deleteSelectDep(sharer: Node) {
        this.setState({
            data: this.state.data.filter(value => value.id !== sharer.id)
        })
    }

    /**
     * 清空已选择部门
     */
    clearSelectDep() {
        this.setState({
            data: []
        })
    }

    /**
     * 取消本次操作
     */
    cancelAddDep() {
        this.clearSelectDep();
        this.props.onCancel();
    }

    /**
     * 确定本次操作
     */
    confirmAddDep() {
        this.props.onConfirm(this.state.data.map(this.props.convererOut))
    }
}