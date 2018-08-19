import * as React from 'react';
import * as classnames from 'classnames';
import Tree from '../../ui/Tree/ui.desktop';
import TreeNode from '../../ui/Tree.Node/ui.desktop';
import { isDir } from '../../core/docs/docs';
import { isTopView, getViewTypesName } from '../../core/entrydoc/entrydoc';
import Thumbnail from '../Thumbnail/component.desktop'
import DocTreeBase from './component.base';
import * as styles from './styles.desktop.css';

export default class DocTree extends DocTreeBase {
    /**
     * 显示模板
     */
    formatter(data) {
        const isTop = isTopView(data)
        const name = isTop ? getViewTypesName(data.view_doctype) : data.name

        return (
            <div
                className={classnames(styles['name-box'], { [styles['name-view-box']]: isTop })}
                title={name}
            >
                <Thumbnail
                    doc={data}
                    size={isTop ? 32 : 24}
                />
                <span className={styles['name']}>
                    {name}
                </span>
            </div>
        )
    }

    /**
     * 生成节点
     * @param isTop 是否是顶级视图
     */
    nodesGenerator(nodes, isTop: boolean = false) {
        const { selectRange } = this.props

        // 顶级视图，按照this.props.selectRange排序
        if (isTop) {
            return nodes
                .sort((a, b) => selectRange.indexOf(a.data.view_doctype) - selectRange.indexOf(b.data.view_doctype))
                .map(node => (
                    <TreeNode
                        checkbox={this.checkBoxVisible(node)}
                        expanded={node.expanded}
                        key={node.data.docid || node.data.view_doctype}
                        data={node.data}
                        isLeaf={!isTopView(node.data) && !isDir(node.data)}
                        formatter={this.formatter}
                        onExpand={doc => this.expand(node, doc)}
                    >
                        {
                            !!node.children && this.nodesGenerator(node.children)
                        }
                    </TreeNode>
                ))
        }

        // 非顶级视图，按照this.props.sort排序
        return nodes
            .map(node => (
                <TreeNode
                    checkbox={this.checkBoxVisible(node)}
                    expanded={node.expanded}
                    key={node.data.docid || node.data.view_doctype}
                    data={node.data}
                    isLeaf={!isTopView(node.data) && !isDir(node.data)}
                    formatter={this.formatter}
                    onExpand={doc => this.expand(node, doc)}
                >
                    {
                        !!node.children && this.nodesGenerator(node.children)
                    }
                </TreeNode>
            ))
    }

    render() {
        return (
            <div className={styles['contianer']}>
                <Tree
                    selectMode={this.props.selectMode}
                    onSelectionChange={this.props.onSelectionChange}
                >
                    {
                        this.nodesGenerator(this.state.nodes, true)
                    }
                </Tree>
            </div>
        )
    }
}