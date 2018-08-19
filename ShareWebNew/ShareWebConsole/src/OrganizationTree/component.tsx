import * as React from 'react';
import { noop, includes } from 'lodash';
import Tree from '../../ui/Tree/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import { ShareMgnt } from '../../core/thrift/thrift';
import { NodeType, getNodeType, getNodeName, getIcon, isLeaf } from './helper';
import * as styles from './styles.css';

export { NodeType } from './helper';

interface Props {
    userid: string // 管理员id;

    selectType: Array<NodeType>; // 可选范围

    onSelectionChange?: (node) => any; // 选中节点时触发

    getNodeStatus?: () => any; // 禁用节点时触发
}

interface State {
    nodes: Array<any> // 节点
}

export default class OrganizationTree extends React.Component<Props, any> {
    constructor(props, context) {
        super(props, context);
        this.formatter = this.formatter.bind(this);
        this.loadSubs = this.loadSubs.bind(this);
    }

    static defaultProps = {
        selectType: [NodeType.ORGANIZATION, NodeType.DEPARTMENT],

        onSelectionChange: noop,

        getNodeStatus: () => ({ disabled: false })
    }

    props: Props;

    state: State = {
        nodes: []
    }

    componentWillMount() {
        ShareMgnt('Usrm_GetSupervisoryRootOrg', [this.props.userid]).then(roots => {
            this.setState({ nodes: roots })
        })
    }

    /**
     * 格式化节点数据
     * @param node 节点数据
     */
    private formatter(node: any): string {
        return (
            <span className={styles['node']} title={getNodeName(node)}>
                <span className={styles['icon']}>
                    <UIIcon {...getIcon(node)} size={16} />
                </span>
                <span className={styles['name']}>
                    {
                        getNodeName(node)
                    }
                </span>
            </span>
        );
    }

    /**
     * 加载子节点
     * @param node 节点
     */
    private loadSubs(node: any): Promise<any> {
        return Promise.all([
            ShareMgnt('Usrm_GetSubDepartments', [node.id]),
            includes(this.props.selectType, NodeType.USER) ?
                ShareMgnt('Usrm_GetDepartmentOfUsers', [node.id, 0, -1]) : []
        ]).then(([deps, users]) => {
            node.children = [...users, ...deps];
            this.forceUpdate();
        });
    }

    /**
     * 根据节点数组递归生成JSX树节点
     * @param nodes 节点数组
     */
    generateNodes(nodes: Array<any> = []): Array<React.ReactNode> {
        return nodes.map(node => (
            <Tree.Node
                isLeaf={isLeaf(node, this.props.selectType)}
                data={node}
                key={node.id}
                formatter={this.formatter}
                loader={this.loadSubs}
                getStatus={this.props.getNodeStatus}
            >
                {
                    node.children ? this.generateNodes(node.children) : null
                }
            </Tree.Node>
        ))
    }

    /**
     * 触发选中事件
     * @param selection 选中的节点数据
     */
    fireSelectionChangeEvent(node: any): void {
        if (includes(this.props.selectType, getNodeType(node))) {
            this.props.onSelectionChange(node);
        }
    }

    render() {
        return (
            <Tree onSelectionChange={this.fireSelectionChangeEvent.bind(this)}>
                {
                    this.generateNodes(this.state.nodes)
                }
            </Tree>
        )
    }
}