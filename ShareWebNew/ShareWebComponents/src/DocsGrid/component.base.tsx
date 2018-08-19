/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { has, first, last, pick, noop, uniq, assign } from 'lodash';
import session from '../../util/session/session';
import { open } from '../../util/browser/browser';
import { DocType, getTopEntriesByType, getTopViews, isTopView, getViewName, getViewById, getViewByType } from '../../core/entrydoc/entrydoc';
import { getOEMConfByOptions } from '../../core/oem/oem';
import { mapGNS, mapLinkGNS } from '../../core/path/path';
import { load, isDir, docname } from '../../core/docs/docs';
import { list as listLinkDir } from '../../core/link/link';
import { checkPermItem, SharePermission } from '../../core/permission/permission';
import WebComponent from '../webcomponent';

enum Status {
    OK,

    // 无权限访问
    NO_PERMISSION,

    // 文件不存在
    FILE_NOT_EXIST
}

export default class DocsGridBase extends WebComponent<Components.DocsGrid.Props, any> {
    static Status = Status;

    static defaultProps = {
        watcher: noop,

        onOpen: noop,

        onNavigate: noop,

        onLoad: noop
    }

    state = {
        /**
         * 当前列举的目录子文档
         */
        docs: [],

        /**
         * 当前列举的目录路径
         */
        path: []
    }

    timeoutId = 0

    constructor(props, context) {
        super(props, context);
        this.open = this.open.bind(this);
    }


    private componentWillMount() {
        this.watch();

        if (this.props.link) {
            this.load(this.props.doc);
        } else {
            if (this.props.doc && this.props.doc.docid) {
                this.load(this.props.doc);
            }
            else if (this.props.doctype) {
                this.loadType(this.props.doctype);
            }
            else {
                this.loadTopViews();
            }
        }
    }

    private componentWillReceiveProps(nextProps) {
        if (nextProps.docid && nextProps.docid !== this.props.doc) {
            this.load(this.props.doc);
        }
    }

    /**
     * 列举指定类型的入口文档
     * @param doctype 
     */
    private loadType(doctype: DocType) {
        Promise.all([
            getOEMConfByOptions(['product']),
            getViewByType(doctype),
            getTopEntriesByType(doctype)
        ]).then(([{product}, view, docs]) => {
            this.updatePath([{ name: product }, view])
            this.updateDocs(docs);
        });
    }


    /**
     * 加载顶级视图
     */
    private loadTopViews() {
        if (this.props.link) {
            this.load();
        } else {
            Promise.all([
                getOEMConfByOptions(['product']),
                getTopViews()
            ]).then(([{product}, views]) => {
                this.updateDocs(uniq(views, (n) => n.doc_type))
                this.updatePath([{ name: product }]);
            });
        }
    }


    /**
     * 初始化监控函数
     */
    private watch() {
        this.props.watcher(this.load.bind(this));
    }


    /**
     * 列举文档或外链目录
     * @param doc
     */
    private load({docid} = {} as Core.Docs.Doc) {
        if (this.props.link) {
            this.loadLinkDir(this.props.link, docid);
        } else {
            this.loadDir(docid);
        }
    }

    /**
     * 更新列举目录
     * @param docid
     */
    private loadDir(docid: string) {
        return Promise.all([
            getViewById(docid),
            mapGNS(docid),
            load(docid)
        ]).then(([view, path, docs]) => {
            this.updatePath([first(this.state.path), view, ...path]); // 第一级为AnyShare顶级路径，第二级view为文档类型视图，需要保留
            this.updateDocs(docs);
        })
    }

    /**
     * 更新外链目录
     * @param link 外链对象
     */
    private loadLinkDir(link, docid) {
        return Promise.all([
            mapLinkGNS(link, docid),
            listLinkDir(assign({}, link, { docid }))
        ]).then(([path, docs]) => {
            this.updatePath(path);
            this.updateDocs(docs);
        })
    }

    private updatePath(path) {
        this.setState({ path });
        this.props.onNavigate(path);
    }

    private updateDocs(docs) {
        this.setState({ docs });
        this.props.onLoad(docs);
    }

    /**
     * 打开目录
     * @param doc
     */
    protected open(doc) {
        if (this.props.link) {
            if (isDir(doc)) {
                this.load(doc);
            } else {
                this.props.onOpen(doc);
            }
        } else {
            if (isTopView(doc)) {
                this.loadType(DocType[doc.doc_type]);
            } else if (isDir(doc)) {
                this.load(doc);
            } else {
                checkPermItem(doc.docid, SharePermission.PREVIEW, session.get('userid')).then(hasPerm => {
                    if (!hasPerm) {
                        this.setState({
                            status: Status.NO_PERMISSION
                        }, () => this.resetError(3000));
                    } else {
                        this.props.onOpen(doc);
                    }
                }, ({errcode}) => {
                    switch (errcode) {
                        case 404006:
                            this.setState({
                                status: Status.FILE_NOT_EXIST,
                                docs: this.state.docs.filter(item => item !== doc)
                            }, () => this.resetError(3000))
                        default:
                            return
                    }
                })
            }
        }
    }

    /**
     * 重置异常
     */
    protected resetError(timeout) {
        if (typeof timeout === 'number') {
            this.timeoutId = setTimeout(() => {
                clearTimeout(this.timeoutId)
                this.setState({
                    status: Status.OK
                })
            }, timeout)
        } else {
            clearTimeout(this.timeoutId)
            this.setState({
                status: Status.OK
            })
        }
    }

    /**
     * 返回上一级目录
     * @param 
     */
    protected back(path) {
        if (path.length === 1) {
            this.loadTopViews()
        } else {
            this.open(last(path))
        }
    }
}