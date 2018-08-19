import * as React from 'react';
import { noop, includes } from 'lodash';
import { EACP, EVFS } from '../../core/thrift/thrift';
import WebComponent from '../webcomponent';

/**
 * 节点类型
 */
export enum NodeType {
    /**
     * 归档库类型
     */
    DOCLIBRARY,
    /**
     * 文件夹类型
     */
    FOLDER,
}

export default class ArchiveDocTreeBase extends WebComponent<Console.ArchiveDocTree.Props, Console.ArchiveDocTree.State> {
    static defaultProps = {
        selectType: [NodeType.DOCLIBRARY, NodeType.FOLDER],

        onSelectionChange: noop,

        isSearch: false,
    }

    state = {
        nodes: [],
        values: '',
    }

    async componentWillMount() {
        this.lodeLibsNodes(await this.getRoots())
    }

    /**
     * 获取节点类型
     * @param node 节点
     * @return 返回节点类型
     */
    protected getNodeType(node: any): NodeType {
        if (node.hasOwnProperty('createrId')) {
            return NodeType.DOCLIBRARY;
        } else {
            return NodeType.FOLDER;
        }
    }

    /**
     * 获取根节点
     */
    private getRoots(key = ''): Promise<any> {
        let params = {
            ncTGetPageDocParam: {
                userId: this.props.userid,
                sortKey: 0,
                sortType: 1,
                docNames: [key],
                docTypes: [],
                docOwners: [],
                docCreaters: [],
                start: 0,
                limit: -1
            }
        }
        return EACP('EACP_SearchArchiveDocInfos', [params]);
    }

    /**
     * 搜索获取根节点
     */
    protected loadRoots(key): Promise<any> {
        this.setState({ nodes: [] });
        return this.getRoots(key);
    }

    /**
     * 归档库加载完成
     */
    protected lodeLibsNodes(nodes: any): void {
        this.setState({ nodes })
    }

    /**
     * 加载子节点
     * @param node 节点
     */
    protected async loadSubs(node: any): Promise<any> {
        let params = node.gns ? node.gns : node.docId;
        const { gnsObjects } = await EVFS('ListDirWithoutPermCheck', [params]);
        node.children = gnsObjects;
        this.forceUpdate();
    }

    /**
     * 判断节点是否是叶子节点
     * @param node 节点
     * @param selectType 可选用户范围
     * @return 返回是否是叶子节点
     */
    protected isLeaf(node: DocLibNode & FolderNode, selectType: Array<NodeType>): boolean {
        switch (this.getNodeType(node)) {
            case NodeType.DOCLIBRARY:
                return !node.subDocCount && !includes(selectType, NodeType.FOLDER);

            case NodeType.FOLDER:
                return !node.subFolderCount && !includes(selectType, NodeType.FOLDER);
        }
    }

    /**
     * 触发选中事件
     * @param selection 选中的节点数据
     */
    protected fireSelectionChangeEvent(node: any): void {
        if (includes(this.props.selectType, this.getNodeType(node))) {
            this.props.onSelectionChange(node);
        }
    }
}
