import * as React from 'react';
import WebComponent from '../../../../webcomponent';
import { assign, isArray } from 'lodash';
import { DocType, splitGNS, getTopViews, getTypeNameByDocType as getTypeName, getTopEntriesByType as getTopEntries } from '../../../../../core/entrydoc/entrydoc';
import { load, isDir, docname } from '../../../../../core/docs/docs';
import { getViewDocType, list } from '../../../../../core/filesystem/filesystem';
import __ from './locale';




export default class RangeTreeBase extends WebComponent<Components.FullTextSearch.RangeTree.Props, Components.FullTextSearch.RangeTree.State> {
    static defaultProps = {
        searchRange: { docid: '', root: true }
    }

    state = {
        selectedNode: {},
        nodes: [{
            data: {
                doc_type: 'father',
                name: __('所有目录')
            },
            children: [],
            collapse: false, // 是否展开/收缩
            loading: false,  // 是否已经加载过
            childless: false, // 是否没有子节点
            selected: true, // 节点是否被选中
        }],
        searchRangeTitle: __('所有目录'),
    }

    resetState() {

        this.setState({
            selectedNode: {},
            nodes: [{
                data: {
                    doc_type: 'father',
                    name: __('所有目录')
                },
                children: [],
                collapse: false, // 是否展开/收缩
                loading: false,  // 是否已经加载过
                childless: false, // 是否没有子节点
                selected: true, // 节点是否被选中
            }],
            searchRangeTitle: __('所有目录')
        }, async () => {

            let ViewTypesName = {
                10: __('个人文档'),
                11: __('共享文档'),
                20: __('个人群组文档'),
                21: __('共享群组文档'),
                30: __('文档库'),
                40: __('归档库')
            }

            let views = await getTopViews();

            let entryDocs = await list();

            const viewDocTypes = views.map(({ view_doctype }) => view_doctype)

            const viewDocs = viewDocTypes.reduce(
                (preViewDocs, viewDocType) =>
                    ({ ...preViewDocs, [viewDocType]: entryDocs.dirs.filter(doc => doc.view_doctype === viewDocType) }),
                {}
            )

            let { nodes } = this.state;
            // 构造顶层目录树结构
            nodes[0]['children'] = views.filter(view => viewDocs[view.view_doctype].length !== 0).map(view => ({
                data: assign({ name: ViewTypesName[view.view_doctype] }, view),
                loading: false,
                collapse: true,
                childless: false,
                children: viewDocs[view.view_doctype].map((entrydoc) => {
                    return {
                        data: entrydoc,
                        loading: false,
                        collapse: true,
                        childless: false,
                    }
                })
            }));

            this.setState({
                nodes,
            })
        })
    }

    async componentWillMount() {
        let ViewTypesName = {
            10: __('个人文档'),
            11: __('共享文档'),
            20: __('个人群组文档'),
            21: __('共享群组文档'),
            30: __('文档库'),
            40: __('归档库')
        }

        // 请求加载一级、二级目录范围
        let views = await getTopViews();

        let entryDocs = await list();

        const viewDocTypes = views.map(({ view_doctype }) => view_doctype)

        const viewDocs = viewDocTypes.reduce(
            (preViewDocs, viewDocType) =>
                ({ ...preViewDocs, [viewDocType]: entryDocs.dirs.filter(doc => doc.view_doctype === viewDocType) }),
            {}
        )

        let { nodes } = this.state;
        let { searchRange } = this.props;
        // 构造顶层目录树结构
        nodes[0]['children'] = views.filter(view => viewDocs[view.view_doctype].length !== 0).map(view => ({
            data: assign({ name: ViewTypesName[view.view_doctype] }, view),
            loading: false,
            collapse: true,
            childless: false,
            children: viewDocs[view.view_doctype].map((entrydoc) => {
                return {
                    data: entrydoc,
                    loading: false,
                    collapse: true,
                    childless: false,
                }
            })
        }));

        // 路由中的range路径非所有目录时
        if (!searchRange.root) {
            // 根据传入的路径GNS获取入口文档
            let rootViewDocType = await getViewDocType(searchRange)
            // 分割GNS路径,去掉入口文档路径
            let gns = splitGNS(searchRange.docid)

            // 找到入口文档路径，设定为打开状态
            nodes[0]['children'].map(async (n) => {
                if (rootViewDocType === n.data.view_doctype) {
                    let docinfos = await this.handleGetTreeChildrenNode(n)

                    let children = docinfos.filter((doc) => isDir(doc)).map(data => ({ data, loading: false, collapse: true }));
                    assign(n, {
                        loading: false,
                        children: children,
                        childless: children.length === 0
                    });
                    this.forceUpdate();
                    let childNodes = n.children;
                    for (let i = 0; i < gns.length; i++) {

                        for (let j = 0; j < childNodes.length; j++) {
                            let childnode = childNodes[j];
                            if (childnode.data.docid === gns[i]) {

                                let docinfos = await this.handleGetTreeChildrenNode(childnode)
                                let children = docinfos.dirs.filter((doc) => isDir(doc)).map(data => ({ data, loading: false, collapse: true }));

                                assign(childnode, {
                                    collapse: i === gns.length - 1,
                                    loading: false,
                                    children: children,
                                    childless: children.length === 0
                                });
                                this.handleSelectTreeNode(childnode)
                                this.forceUpdate();
                                childNodes = childnode.children;
                                break;
                            }

                        }


                    }

                }
            })
        }

        this.setState({
            nodes,
        })
    }

    /**
    * 展开二级树节点，获取内部文档
    */
    protected handleGetTreeChildrenNode(node) {
        node['parent'] === '';

        // 记忆展开状态
        node.collapse = false;

        // 加载子节点内容
        if (isArray(node.children)) {
            return node.children.reduce((preList, node) => { return [...preList, node.data] }, [])
        } else if (node.loading === false) {
            node.loading = true;
            let doc = node.data;
            if (doc && doc.doc_type !== undefined && doc.doc_type !== 'father') {
                // 顶级视图,实际中的二级目录，一级目录为：所有目录
                return getTopEntries(DocType[doc.doc_type])
            } else if (isDir(doc)) {
                // 文档目录
                return list(doc)
            }
        }
    }

    /**
     * 展开二级树节点，获取内部文档
     */
    protected handleExpandTreeNode(node) {
        node['parent'] === '';

        // 记忆展开状态
        node.collapse = false;

        // 加载子节点内容
        if (isArray(node.children)) {
            // 如果children存在 则使用缓存
            this.forceUpdate();
        } else if (node.loading === false) {
            node.loading = true;
            let doc = node.data;
            if (doc && doc.doc_type !== undefined && doc.doc_type !== 'father') {
                // 顶级视图,实际中的二级目录，一级目录为：所有目录
                this.appendChild(node, getTopEntries(DocType[doc.doc_type]));
            } else if (isDir(doc)) {
                // 文档目录
                this.appendChild(node, list(doc));
            }
        }
    }

    /**
     * 向指定节点添加子节点并重新渲染组件
     */
    appendChild(node, loader: PromiseLike<any>) {
        let self = this;
        loader.then(docinfos => {
            let children = docinfos.dirs.filter((doc) => isDir(doc)).map(data => ({ data, loading: false, collapse: true }));
            assign(node, {
                loading: false,
                children: children,
                childless: children.length === 0
            });
            self.forceUpdate();
        });
    }

    /**
     * 收缩子节点
     */
    protected handleCollapseTreeNdoe(node) {
        node.collapse = true
    }

    /**
     * 选中节点
     */
    protected handleSelectTreeNode(node) {
        // 向父元素传播range变化
        this.props.onSearchRangeChange(node);
        node.selected = true;
        this.setState({
            selectedNode: node
        }, () => {
            // 暂时不需要，只显示叶节点目录
            // let range = [node];
            // 追溯节点的父节点，直到根节点
            // while (node.parent !== null) {
            //     range.unshift(node.parent);
            //     node = node.parent;
            // }


            // let title = range.reduce((s, n) => {
            //     s = s + ' > ' + docname(n.data);
            //     return s;
            // }, '')

            this.setState({
                searchRangeTitle: docname(node.data)
            })

        })


    }

    timeout = null;
    /**
     * 点击弹出框外时触发
     */
    protected handleCloseMenu(close) {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
            close();
        }, 150)
    }



}