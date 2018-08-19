/// <reference path="./link.d.ts" />

import { assign } from 'lodash';
import { open, useHTTPS, isBrowser } from '../../util/browser/browser';
import { combineDocs } from '../docs/docs';
import { OSDownload, OSBeginUpload, OSEndUpload, listDir, batchDownload } from '../apis/efshttp/link/link';
import { getOpenAPIConfig } from '../openapi/openapi';

/**
 * 外链权限
 */
export enum Permission {
    PREVIEW = 1,

    DOWNLOAD = 2,

    UPLOAD = 4,
}

/**
 * 获取下载地址
 */
export function getDownloadURL({ link, password, docid, savename }: Core.Link.Download): PromiseLike<string> {
    const [, reqhost] = getOpenAPIConfig('host').match(/^https?:\/\/(.+)$/);
    return OSDownload({ link, password, docid, reqhost, usehttps: useHTTPS(), savename })
        .then(({ authrequest: [, url] }) => url);
}

/**
 * 获取批量下载地址
 */
export function getBatchDownloadURL({ name, files, dirs, link, password }) {
    const [, reqhost] = getOpenAPIConfig('host').match(/^https?:\/\/(.+)$/);
    return batchDownload({ name, reqhost, usehttps: useHTTPS(), files, dirs, link, password }).then(({ url }) => url)
}

/**
 * 下载外链
 */
export function download({ link, password, docid, savename }: Core.Link.Download): PromiseLike<void> {
    return getDownloadURL({ link, password, docid, savename }).then((url) => {
        location.assign(url)
    });
}

/**
 * 列举外链目录
 */
export function list({ docid, link, password }): PromiseLike<Array<Core.Docs.Doc>> {
    return listDir({ docid, link, password }).then(combineDocs);
}

