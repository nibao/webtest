/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { has, first, last, pick, noop, uniq, assign } from 'lodash';
import session from '../../util/session/session';
import { open } from '../../util/browser/browser';
import { DocType, getTopEntriesByType, getTopViews, isTopView, getViewName, getViewById, getViewByType } from '../../core/entrydoc/entrydoc';
import { listLinkAsync } from '../../core/sync/sync';
import { mapGNS, mapLinkGNS, map as mapPath, mapLink, relative } from '../../core/path/path';
import { load, isDir, docname } from '../../core/docs/docs';
import { list as listLinkDir } from '../../core/link/link';
import { checkPermItem, checkLinkPerm, LinkSharePermission, SharePermission } from '../../core/permission/permission';
import WebComponent from '../webcomponent';

enum Status {
    OK,

    // 无权限访问
    NO_PERMISSION,

    // 文件不存在
    FILE_NOT_EXIST
}

export default class DocsGridBase extends WebComponent<Components.DocsGrid2.Props, any> {
    static Status = Status;

    static defaultProps = {
        path: '', // 目录路径 

        height: '100%',

        onOpen: noop,

        onLoad: noop,

        getDefaultSelection: noop,

        onSelectionChange: noop,

        onPathChange: noop, // 路径变化时触发,

        onCrumbsChange: noop,

        onLinkExpire: noop //外链失效
    }

    state = {
        path: this.props.path, // 目录路径 

        docs: [], // 当前列举的目录子文档

        crumbs: [],

        error: Status.OK
    }

    timeoutId = 0

    constructor(props, context) {
        super(props, context);
        this.open = this.open.bind(this);
    }


    private componentWillMount() {
        if (this.props.link) {
            mapLink(this.props.link, this.state.path).then(crumbs => {
                this.changePath(crumbs.slice(1).map(crumb => docname(crumb)).join('/'))
                this.changeCrumbs(crumbs);
                this.load(last(crumbs), this.props.link);
            }, this.handleException.bind(this))
        }
    }

    /**
     * 加载文档数据
     */
    private load({ docid }, link?) {
        // 路径为空，加载外链目录或者首页视图
        if (link) {
            listLinkAsync(link, docid).then((docs) => this.updateDocs(docs), err => {
                switch (err.errcode) {
                    case 404008:
                        this.props.onLinkExpire()
                        break;
                    default:
                        break;
                }
            });
        } else {

        }
    }

    /**
     * 加载顶级视图
     */
    private loadTopViews() {
        getTopViews().then(views => this.updateDocs(uniq(views, (n) => n.doc_type)))
    }

    /**
     * 加载数据并触发事件
     * @param docs 文档对象
     */
    private updateDocs(docs) {
        this.setState({ docs });
        this.props.onLoad(docs);
    }

    /**
     * 返回上级目录
     */
    protected back(crumbs) {
        const nextPath = crumbs.slice(1).map(crumb => docname(crumb)).join('/')

        if (this.props.link) {
            mapLink(this.props.link, nextPath).then(list => {
                this.changePath(nextPath);
                this.changeCrumbs(crumbs);
                this.load(last(list), this.props.link);
            }, this.handleException.bind(this))
        }
    }

    /**
     * 打开目录
     * @param doc
     */
    protected open(doc) {
        if (isTopView(doc) || isDir(doc)) {
            const nextPath = relative(this.state.path, isTopView(doc) ? getViewName(doc) : docname(doc));
            this.props.link ?
                mapLink(this.props.link, nextPath).then(list => {
                    this.changePath(nextPath);
                    this.changeCrumbs([...this.state.crumbs, doc]);
                    this.load(last(list), this.props.link);
                }, this.handleException.bind(this)) : null

            this.props.onOpen(doc);
        }
        else {
            (
                this.props.link ?
                    checkLinkPerm(assign(pick(this.props.link, ['link', 'password']), { perm: LinkSharePermission.PREVIEW })) :
                    checkPermItem(doc.docid, SharePermission.PREVIEW, session.get('userid'))
            ).then(hasPerm => {
                if (!hasPerm) {
                    this.setState({
                        status: Status.NO_PERMISSION
                    });
                } else {
                    this.props.onOpen(doc);
                }
            }, this.handleException.bind(this))
        }
    }

    protected buildCrumbs(root, path) {
        const pathList = path ? path.split('/') : [];

        return root.link ? [root.name, ...pathList] : [docname(root), ...pathList]
    }

    private changePath(path) {
        this.setState({ path }, () => this.firePathChangeEvent(path))
    }

    private changeCrumbs(crumbs) {
        this.setState({ crumbs }, () => this.fireCrumbsChangeEvent(this.state.crumbs))
    }

    protected fireSelectionChangeEvent(docs) {
        this.props.onSelectionChange(docs);
    }

    private firePathChangeEvent(path) {
        this.props.onPathChange(path);
    }

    private fireCrumbsChangeEvent(crumbs) {
        this.props.onCrumbsChange(crumbs);
    }

    private handleException({ errcode }) {
        if (errcode) {
            this.setState({ error: errcode })
        }
    }
}