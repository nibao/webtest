/// <reference path="./index.d.ts" />

import * as React from 'react';
import { noop, last } from 'lodash';
import { post } from '../../util/http/http';
import { openUrlByChrome } from '../../core/apis/client/tmp/tmp';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { openDir, previewFile, requestDownload } from '../../core/client/client';
import { buildWebClientURI } from '../../core/config/config';
import { Module } from './helper';

export default class SideBarBase extends React.Component<Components.SideBar.Props, Components.SideBar.State> {
    static defaultProps = {
        directory: null,

        sync: {},

        docs: [],

        id: '',

        favorited: false,

        onFavoriteChange: noop,
    }

    selectItem(doc) {
        previewFile(doc);
    }

    toGlobalSearch(key, range) {
        post(`http://127.0.0.1:10080/fullsearch`, { searchKeys: key, searchRange: range ? { docid: range } : { docid: '', root: true } }, { sendAs: 'json', readAs: 'json' })
    }

    /**
    * pc侧边栏标签跳转
    */
    doJumpSearch(tag) {
        post(`http://127.0.0.1:10080/fullsearch`, { searchTags: tag }, { sendAs: 'json', readAs: 'json' })
    }


    onClickDir(doc) {
        openDir(doc);
    }

    triggerComponent(module: Module, params: any = {}) {
        switch (module) {
            case Module.InnerLink:
                return post(`http://127.0.0.1:10080/share/${encodeURIComponent(last(params.doc.docid.split('/')))}`, params, { sendAs: 'json', readAs: 'json' })

            case Module.ShareLink:
                return post(`http://127.0.0.1:10080/linkshare/${encodeURIComponent(last(params.doc.docid.split('/')))}`, params, { sendAs: 'json', readAs: 'json' })

            case Module.Message:
                // 5.0暂时使用打开浏览器跳转，6.0之后再替换成组件
                // return post(`http://127.0.0.1:10080/messages`, params, { sendAs: 'json', readAs: 'json' })

                (async () => {
                    const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

                    openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/message', lang: locale, platform: 'pc' } }) });
                })()

                break;

            case Module.Recycle:
                return post(`http://127.0.0.1:10080/recycle`, params, { sendAs: 'json', readAs: 'json' })


            case Module.AuditManage:
                // 5.0暂时使用打开浏览器跳转，6.0之后再替换成组件
                // return post(`http://127.0.0.1:10080/recycle?width=800&height=480?title=${__('审核管理')}`, params, { sendAs: 'json', readAs: 'json' })
                params.isPending ?
                    this.jumpPending()
                    :
                    this.jumpReview()

                break;

            case Module.GroupManage:
                return post(`http://127.0.0.1:10080/groupmanage`, params, { sendAs: 'json', readAs: 'json' })

            case Module.ViewSize:
                return post(`http://127.0.0.1:10080/viewsize/${params.docs.length === 1 ? encodeURIComponent(last(params.docs[0].docid.split('/'))) : ''}`, params, { sendAs: 'json', readAs: 'json' })

            case Module.EditTag:
                return post(`http://127.0.0.1:10080/edittag/${encodeURIComponent(last(params.doc.docid.split('/')))}`, params, { sendAs: 'json', readAs: 'json' })

            case Module.AddTag:
                return post(`http://127.0.0.1:10080/addtag`, params, { sendAs: 'json', readAs: 'json' })

            case Module.ViewRevision:
                return post(`http://127.0.0.1:10080/viewrev`, params, { sendAs: 'json', readAs: 'json' })

            case Module.RestoreRevision:
                return post(`http://127.0.0.1:10080/restorerev/${encodeURIComponent(params.revision.rev)}`, params, { sendAs: 'json', readAs: 'json' })

            case Module.EditCSF:
                return post(`http://127.0.0.1:10080/editcsf/${params.docs.length === 1 ? encodeURIComponent(last(params.docs[0].docid.split('/'))) : ''}`, params, { sendAs: 'json', readAs: 'json' })

            case Module.Cache:
                const { directory, docs } = params;

                if (!docs || !docs.length) {
                    return post(`http://127.0.0.1:10080/cachedirectory`, params, { sendAs: 'json', readAs: 'json' })
                } else {
                    requestDownload({ docs })
                }

                break;

            case Module.CleanCache:
                return post(`http://127.0.0.1:10080/cleancache`, params, { sendAs: 'json', readAs: 'json' })

            case Module.MyFavorites:
                return post(`http://127.0.0.1:10080/myfavorites`, params, { sendAs: 'json', readAs: 'json' })

            case Module.MyShare:
                (async () => {
                    const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

                    openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/documents/share', lang: locale, platform: 'pc' } }) });
                })()

                break;
        }
    }

    /**
     * 当前目录为云盘首页或是顶级目录，未选中才显示状态提示界面
     */
    showStatusHints(docs, directory) {
        if (directory === null || (!directory.docid && directory.name === '') || (!directory.docid && directory.viewType !== 0)) {
            if (docs.length === 0) {
                return true
            }
        }
        return false
    }

    /**
     * 权限配置，跳转到“权限申请”页面
     */
    async jumpApv() {
        const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale'])

        await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/approvals', lang: locale, platform: 'pc' } })

    }

    /**
     * 审核管理，跳转至共享申请
     */
    async jumpPending() {
        const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale'])
        await openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/approvals/share-review', lang: locale, platform: 'pc' } }) });
    }

    /**
     * 审核管理，跳转至共享申请
     */
    async jumpReview() {
        const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale'])
        await openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/approvals/share-application', lang: locale, platform: 'pc' } }) });
    }
}