import * as React from 'react';
import DocTreeBase from './component.base';
import Tree from '../../ui/Tree/ui.mobile';
import TreeNode from '../../ui/Tree.Node/ui.mobile';
import Thumbnail from '../Thumbnail/component.mobile'
import { isDir } from '../../core/docs/docs';
import { isTopView, getViewTypesName } from '../../core/entrydoc/entrydoc';
import * as classnames from 'classnames';
import * as styles from './styles.mobile.css';

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
                    size={isTop ? 40 : 36}
                />
                <span className={styles['name']}>
                    {name}
                </span>
            </div>
        )
    }

    /**
     * 生成节点
     */
    nodesGenerator(nodes, isTop: boolean = false) {
        const { selectRange } = this.props

        if (isTop) {
            return nodes
                .sort((a, b) => selectRange.indexOf(a.data.view_doctype) - selectRange.indexOf(b.data.view_doctype))
                .map(node => (
                    <TreeNode
                        checkbox={this.checkBoxVisible(node)}
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

        return nodes
            .map(node => (
                <TreeNode
                    checkbox={this.checkBoxVisible(node)}
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