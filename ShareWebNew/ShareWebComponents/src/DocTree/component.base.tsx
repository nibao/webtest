import * as React from 'react';
import WebComponent from '../webcomponent';
import { noop, uniq, assign, isArray, difference, includes } from 'lodash';
import { load, isDir } from '../../core/docs/docs';
import * as fs from '../../core/filesystem/filesystem'
import { getOemConfigBySection } from '../../core/apis/eachttp/config/config'
import { DocType, isTopView, getTopViews, getTypeNameByDocType as getTypeName, ViewDocType } from '../../core/entrydoc/entrydoc';

export enum SelectType {
    DIR,
    FILE
}

export default class DocTreeBase extends WebComponent<Components.DocTree.Props, Components.DocTree.State> {
    static defaultProps = {
        /**
         * 选中事件
         */
        onSelectionChange: noop,

        /**
         * 文件和文件夹的选择控制
         */
        selectType: [SelectType.DIR, SelectType.FILE],

        /**
         * 个人文档，个人群组文档，共享群组文档，共享文档，文档库，归档库的选择控制 视图按传参顺序排序
         */
        selectRange: [ViewDocType.UserDoc, ViewDocType.GroupDoc, ViewDocType.ShareGroup, ViewDocType.ShareDoc, ViewDocType.CustomDoc, ViewDocType.ArchiveDoc],

        /**
         * 选择模式: 'single'--单选, 'multi'--多选, 'cascade'--级联
         */
        selectMode: 'single',

        /**
         * 默认是否展开顶级视图: Boolean
         */
        expandTopView: false,

        /**
         * 默认按文件名升序排序
         */
        sort: {
            by: 'name',

            sort: 'asc',
        }
    }

    state = {
        nodes: []
    }

    /**
     * 初始化 加载顶级视图列表
     */
    componentWillMount() {
        this.getRoot()
    }

    private async getRoot() {
        // 获取顶级视图
        const viewsinfo = await getTopViews()
        const { dirs } = await fs.list()

        const viewDocTypes = viewsinfo.map(({ view_doctype }) => view_doctype)
        const viewDocs = viewDocTypes.reduce(
            (preViewDocs, viewDocType) =>
                ({ ...preViewDocs, [viewDocType]: dirs.filter(doc => doc.view_doctype === viewDocType) }),
            {}
        )

        // 获取需要过滤的webclientTabs(控制台OEM设置)
        let OEMlist
        try {
            const { webclientTabs } = await getOemConfigBySection({ section: 'anyshare' })
            OEMlist = webclientTabs ? JSON.parse(webclientTabs) : []
        }
        catch (err) {
            OEMlist = []
        }

        // 可选的范围
        let selectRangeFilter
        if (OEMlist.some(item => item.name === 'docaccess')) {
            selectRangeFilter = []
        } else {
            const types = OEMlist.reduce((prev, list) => {
                switch (list.name) {
                    case 'userdoc':
                        return [...prev, ViewDocType.UserDoc]

                    case 'sharedoc':
                        return [...prev, ViewDocType.ShareDoc]

                    case 'groupdoc':
                        return [...prev, ViewDocType.GroupDoc, ViewDocType.ShareGroup]

                    case 'customdoc':
                        return [...prev, ViewDocType.CustomDoc, ViewDocType.CustomDoc]

                    case 'archivedoc':
                        return [...prev, ViewDocType.ArchiveDoc]

                    default:
                        return prev
                }
            }, [])

            // 根据OEM配置项和this.props.selectRange得到需要显示的顶级视图
            selectRangeFilter = difference(this.props.selectRange, types)
        }

        const newViewsinfo = viewsinfo.filter(info => includes(selectRangeFilter, info.view_doctype))

        const nodes = newViewsinfo.map(info => {
            return {
                data: info,
                children: viewDocs[info.view_doctype].map(item => ({
                    data: item,
                    loading: false
                })),
                loading: true,
                expanded: this.props.expandTopView
            }
        })

        // 顶级视图，如果children为空数组，则不显示
        this.setState({
            nodes: nodes.filter(node => node.children.length)
        })
    }

    /**
     * 展开节点
     */
    protected expand(node, doc) {
        if (isArray(node.children)) {
            // 如果children存在 则使用缓存
            this.forceUpdate();
        } else if (node.loading === false) {
            node.loading = true;
            if (isDir(doc)) {
                // 文档目录
                this.appendChild(node, fs.list(doc, {
                    by: this.props.sort.by,
                    sort: this.props.sort.sort
                }));
            }
        }
    }

    /**
     * 向指定节点添加子节点并重新渲染组件
     */
    private async appendChild(node, loader: PromiseLike<any>) {
        const { dirs, files } = await loader

        const docinfos = [...dirs, ...files]

        assign(node, {
            children: this.props.selectType.find(o => o === SelectType.FILE) ?
                docinfos.map(data => ({ data, loading: false }))
                :
                docinfos.filter((doc) => isDir(doc)).map(data => ({ data, loading: false }))
        })

        this.forceUpdate();
    }

    /**
     * 多选框是否显示
     * （1）单选模式不显示
     * （2）topView，不显示
     *  (3) selectType包括dir，显示
     *  (4) selectType不包括dir，文件夹不显示，文件显示
     */
    protected checkBoxVisible(node) {
        if (this.props.selectMode === 'single') {
            return false
        }

        if (isTopView(node.data)) {
            return false
        }

        if (includes(this.props.selectType, SelectType.DIR)) {
            return true
        }

        return !isDir(node.data)
    }
}