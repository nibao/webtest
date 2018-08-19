import * as React from 'react';
import {  EACP, EVFS } from '../../core/thrift/thrift';
import Tree from '../../ui/Tree/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import ArchiveDocTreeBase, { NodeType } from './component.base';
import * as doclibicon from './assets/doclib.png';
import * as foldericon from './assets/folder.png';
import __ from './locale';
import * as styles from './styles.view.css';

export default class ArchiveDocTree extends ArchiveDocTreeBase {
    /**
     * 格式化节点数据
     * @param node 节点数据
     */
    private formatter(node: any): string {
        return (
            <span className={styles['node']} title={ node.name }>
                <span className={styles['icon']}>
                    {
                        this.getNodeType(node) === NodeType.DOCLIBRARY ?
                            <Icon url={ doclibicon } size ={ 24 } /> 
                            : <Icon url={ foldericon } size ={ 16 } />
                    }
                </span>
                <span className={styles['name']}>{ node.name }</span>
            </span>
        );
    }
    

    /**
     * 根据节点数组递归生成JSX树节点
     * @param nodes 节点数组
     */
    protected generateNodes(nodes: Array<any> = []): Array<React.ReactNode> {
        return nodes.map(node => (
            <Tree.Node
                isLeaf={this.isLeaf(node, this.props.selectType)}
                data={node}
                key={node.docId}
                formatter={this.formatter.bind(this)}
                loader={this.loadSubs.bind(this)}
                >
                {
                    node.children ? this.generateNodes(node.children) : null
                }
            </Tree.Node>
        ))
    }

    render() {
        return (
            <div className={styles['tree-wrapper']}>
                {
                    this.props.isSearch ? 
                    <div className={styles['search-wrapper']}>
                        <SearchBox 
                            className={styles['searchbox']}
                            width={'100%'}
                            placeholder={__('请输入库名称')}
                            value={this.state.values}
                            onChange={(value) => {this.setState({values: value})}}
                            loader = {this.loadRoots.bind(this)}
                            onLoad = {this.lodeLibsNodes.bind(this)}
                        />
                    </div>
                     : null
                }
                <div className={styles['tree']}>
                    <div className={styles['tree-main']}>
                        <Tree
                            selectMode={'single'}
                            onSelectionChange={this.fireSelectionChangeEvent.bind(this)}
                        >
                            {
                                this.generateNodes.bind(this)(this.state.nodes)
                            }
                        </Tree> 
                    </div>
                </div>                
            </div>
        )
    }
}