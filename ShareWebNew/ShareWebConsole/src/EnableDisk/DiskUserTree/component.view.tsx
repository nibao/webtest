import * as React from 'react';
import Tree from '../../../ui/Tree/ui.desktop';
import TreeNode from '../../../ui/Tree.Node/ui.desktop';
import DiskUserTreeBase from './component.base'
import * as styles from './styles.view.css'

export default class DiskUserTree extends DiskUserTreeBase {
    /**
    * 显示模板
    */
    formatter(node: any) {
        return (
            <span
                className={styles['name']}
                title={node.name}
            >
                {node.name}
            </span>
        )
    }

    /**
     * 生成节点
     */
    nodesGenerator(nodes: ReadonlyArray<any>) {
        return nodes.map(node => (
            <TreeNode
                checkbox={true}
                key={node.id}
                data={node}
                isLeaf={node.subDepartmentCount === undefined}
                formatter={this.formatter}
                onExpand={(node) => this.expand(node)}
            >
                {
                    node.children ? this.nodesGenerator(node.children) : null
                }
            </TreeNode>
        ))
    }
    render() {
        return (
            <div className={styles['contianer']}>
                <Tree
                    selectMode={'multi'}
                    onSelectionChange={this.props.onSelectionChange}
                >
                    {
                        this.nodesGenerator(this.state.nodes)
                    }
                </Tree>
            </div>
        )
    }
}