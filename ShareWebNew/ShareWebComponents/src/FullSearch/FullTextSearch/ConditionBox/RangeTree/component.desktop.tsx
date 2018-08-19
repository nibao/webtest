import * as React from 'react';
import RangeTreeBase from './component.base';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import { isDir, docname } from '../../../../../core/docs/docs';
import { isTopView } from '../../../../../core/entrydoc/entrydoc';
import TriggerPopMenu from '../../../../../ui/TriggerPopMenu/ui.desktop';
import Tree from '../../../../../ui/Tree/ui.desktop';
import TreeNode from '../../../../../ui/Tree.Node2/ui.desktop';
import { decorateText } from '../../../../../util/formatters/formatters';
import Thumbnail from '../../../../Thumbnail/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class RangeTree extends RangeTreeBase {

    render() {
        let { nodes, searchRangeTitle } = this.state;
        return (
            <div className={classnames(styles['range-condition-box'])}>
                <span className={styles['attr-title']}>{__('目录范围：')}</span>
                <TriggerPopMenu
                    popMenuClassName={styles['condition-range-menu']}
                    label={searchRangeTitle}
                    numberOfChars={this.props.numberOfChars}
                    onRequestCloseWhenBlur={close => this.handleCloseMenu(close)}
                    timeout={150}

                >
                    {
                        this.renderUnitRangeTree(nodes)
                    }
                </TriggerPopMenu>

            </div>

        )

    }

    /**
     * 显示模板
     */
    nodeFormatter(node) {
        let doc = node.data;
        return (
            <div
                className={classnames(styles['range-name-box'])}
                title={docname(doc)}
            >
                {
                    doc.doc_type === 'father' ?
                        null
                        :
                        <Thumbnail
                            doc={doc}
                            size={32}
                        />
                }
                <span className={classnames(styles['range-name'], { [styles['root-range-name']]: doc.doc_type === 'father' })}>{docname(doc)}</span>
            </div>
        )
    }

    /**
     * 生成节点
     */
    nodesGenerator(nodes, parent) {
        nodes.map(node => {
            node['parent'] = parent;
        })

        return nodes.map(node => (
            <TreeNode
                key={node.data.docid || node.data.view_doctype}
                data={node}
                selected={_.isEqual(node, this.state.selectedNode)}
                isLeaf={(!isTopView(node.data) && !isDir(node.data)) || node.childless}
                formatter={this.nodeFormatter}
                onExpand={() => { this.handleExpandTreeNode(node); }}
                onCollapse={() => { this.handleCollapseTreeNdoe(node); }}
                collapse={node.collapse}
                onSelect={() => { this.handleSelectTreeNode(node) }}
            >
                {
                    node.children ? this.nodesGenerator(node.children, node) : null
                }
            </TreeNode>
        ))
    }

    /**
     * 渲染搜索范围目录树
     * @param unit 目录
     */
    renderUnitRangeTree(unit) {
        let parent = null;
        return (
            <div className={styles['search-range-contianer']}>
                <Tree selectMode={this.props.selectMode}>
                    {
                        this.nodesGenerator(unit, parent)
                    }
                </Tree>
            </div>
        )
    }
}