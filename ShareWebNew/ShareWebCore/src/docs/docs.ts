/// <reference path="../apis/efshttp/dir/dir.d.ts" />
/// <reference path="./docs.d.ts" />

import { values, merge, first, last, indexBy } from 'lodash';
import { open, useHTTPS, isBrowser, Browser } from '../../util/browser/browser';
import { getOpenAPIConfig } from '../openapi/openapi';
import { serializePath, splitGNS, cacheDB, DATABASE, updateCache, omitSubs } from '../gns/gns';
import { list } from '../apis/efshttp/dir/dir';
import { OSDownload, batchDownload } from '../apis/efshttp/file/file';
import { findType, OWASSupported } from '../extension/extension';
import { isVirtual } from '../entrydoc/entrydoc';
import { getOEMConfig } from '../config/config';

/**
 * 文件打开方式
 */
export enum OpenMethod {
    LIST,
    PREVIEW,
    PLAY,
    THUMBNAIL,
    ABOUT
}


/**
 * 判断是否为目录
 */
export function isDir(doc: Core.Docs.Doc): boolean {
    return !!doc.isDir || (doc.size === undefined && doc.isdir === undefined) || doc.size === -1 || doc.isdir === true;
}


/**
 * 获取文档名称，包括入口文档和普通文档
 */
export function docname(doc): string {
    return doc ? doc.name || doc.docname || doc.basename + doc.ext || '' : '';
}


/**
 * 选择打开方式
 * @param doc 文档对象
 * @return 返回打开方式
 */
export function getOpenMethod(doc: Core.Docs.Doc): OpenMethod {
    if (isDir(doc)) {
        return OpenMethod.LIST;
    } else {
        switch (findType(docname(doc))) {
            case 'PDF':
            case 'WORD':
            case 'EXCEL':
            case 'PPT':
            case 'PDF':
            case 'TXT':
            case 'CAD':
                return OpenMethod.PREVIEW;

            case 'IMG':
                return OpenMethod.THUMBNAIL;

            case 'VIDEO':
            case 'AUDIO':
                return OpenMethod.PLAY;

            default:
                return OpenMethod.ABOUT;
        }
    }
}


/**
 * 对文档排序
 * @desc 文件夹优先，然后按文件名使用localeCompare进行本地化排序
 * @params docs 文档列表
 * @return 返回排序后的文档
 */
export function sort(raw: Core.Docs.Docs): Core.Docs.Docs {
    return raw.sort(function (a, b) {
        if (a.size === -1 && b.size !== -1) {
            return -1;
        } else if (a.size !== -1 && b.size === -1) {
            return 1;
        } else {
            return docname(a).localeCompare(docname(b));
        }
    });
}


/**
 * 列举目录
 */
export function listDir({ docid }): PromiseLike<Array<APIs.EFSHTTP.Doc>> {
    return list({ docid }).then(({ dirs, files }) => combineDocs({ dirs, files }));
}


/**
 * 列举文档并缓存
 */
export const listDirDB = cacheDB(listDir);


/**
 * 读取docid下所有文档，包括入口文档和list出的文档
 */
export function load(docid: string) {
    return isVirtual(docid).then(isVirtual => {
        if (isVirtual) {
            return findSubs({ docid });
        } else {
            omitSubs({ docid });
            return listDirDB({ docid }).then((docs) => findSubs({ docid }));
        }
    })
}


/**
 * 合并dirs和files
 * @param docs 服务端列举出的dirs／files数据结构
 */
export function combineDocs({ dirs, files }: APIs.EFSHTTP.Docs): Array<Core.Docs.Doc> {
    return dirs.concat(files);
}


/**
 * 获取下载地址
 */
export function getDownloadURL({ docid, rev, userid, tokenid, savename }: Core.Docs.Download): PromiseLike<string> {
    const [fullhost, reqhost] = getOpenAPIConfig('host').match(/^https?:\/\/(.+)$/);

    return OSDownload({ docid, rev, authtype: 'QUERY_STRING', reqhost, usehttps: useHTTPS(), savename }, { userid, tokenid })
        .then(({ authrequest: [method, url] }) => url);
}

/**
 * 批量下载
 */
export function getBatchDownloadURL({ name, files, dirs }) {
    const [fullhost, reqhost] = getOpenAPIConfig('host').match(/^https?:\/\/(.+)$/);
    return batchDownload({ name, reqhost, usehttps: useHTTPS(), files, dirs }).then(({ method, url }) => url)
}


/**
 * 下载文件
 */
export function download({ docid, rev, userid, tokenid }: Core.Docs.Download): PromiseLike<void> {
    return getDownloadURL({ docid, rev, userid, tokenid }).then((url) => {
        location.assign(url)
    });
}


/**
 * 是否可以使用OWAS预览
 */
export function canOWASPreview(doc): PromiseLike<boolean> {
    return getOEMConfig().then(({ owasurl, wopiurl }) => {
        return !!(owasurl && wopiurl && OWASSupported(docname(doc)));
    })
}

/**
 * 是否可以使用OWA编辑
 */
export function canOWASEdit(doc): PromiseLike<boolean> {
    return getOEMConfig().then(({ owasurl, wopiurl }) => !!(owasurl && wopiurl && OWASSupported(docname(doc), { editable: true })))
}

/**
 * 是否支持cad预览
 */
export function canCADPreview(): PromiseLike<boolean> {
    return getOEMConfig('cadpreview').then(cadpreview => cadpreview)
}


/**
 * 通过名字查找缓存的文档对象，可能返回多个匹配的名字
 */
export function listByName(name: string): Array<Core.Docs.Doc | Core.Docs.VirtualDoc> {
    return values(DATABASE).filter(doc => docname(doc) === name);
}


/**
 * 查找目录下子文档
 * @param parent 要查找的目录
 * @param predicate 对子文档进行进一步过滤的函数
 * @return 返回所有子文档或符合filter函数的子文档
 */
export function findSubs(parent, predicate: (doc: Core.Docs.Doc | Core.Docs.VirtualDoc) => boolean = () => true): Array<Core.Docs.Doc | Core.Docs.VirtualDoc> {
    const REG_SUB_DOC = new RegExp(`${parent.docid}/\\w+$`);

    return values(DATABASE).filter(doc => REG_SUB_DOC.test(doc.docid) && predicate(doc));
}


/**
 * 从数据中中查找docid对应的文档
 * @param docid 文档docid
 * @return 匹配的文档对象
 */
export function findById(docid) {
    return DATABASE[docid] || null;
}