import { useHTTPS } from '../../util/browser/browser';
import { queryString } from '../../util/http/http';
import { getOpenAPIConfig } from '../openapi/openapi';

/**
 * 构建文档图片src
 */
export function buildImageSrc({ docid }) {
    return buildSrc({ docid, width: 1920, height: 1080, quality: 75 });
}

/**
 * 构建外链图片src
 */
export function buildLinkImageSrc({ link, password, docid }) {
    return buildSrcByLink({ link, docid, password, width: 1920, height: 1080, quality: 75 });
}


/**
 * 构造缩略图URL
 * @param docid
 * @param [width]
 * @param [height]
 * @param [quality]
 * @returns {string}
 */
export function buildSrc({ docid, width = 26, height = 26, quality = 50 }) {
    const host = getOpenAPIConfig('host');
    const [fullhost, reqhost] = host.match(/^https?:\/\/(.+)$/);
    const port = getOpenAPIConfig('EFSPPort');
    const userid = getOpenAPIConfig('userid');
    const tokenid = getOpenAPIConfig('tokenid');
    const query = queryString({
        docid,
        reqhost,
        width,
        height,
        quality,
        usehttps: useHTTPS(),
        noCache: Math.random()
    });

    return `${host}:${port}/v1/file?method=thumbnail&${query}&userid=${userid}&tokenid=${tokenid}`;
};

/**
 * 生成外链图片src
 * @param link
 * @param docid
 * @param password
 * @param [width]
 * @param [height]
 * @param [quality]
 * @returns {string}
 */
export function buildSrcByLink({ link, password, docid, width = 26, height = 26, quality = 50 }) {
    const host = getOpenAPIConfig('host');
    const port = getOpenAPIConfig('EFSPPort');
    const query = queryString({
        link,
        docid,
        password,
        width,
        height,
        quality,
        noCache: Math.random()
    });

    return `${host}:${port}/v1/link?method=thumbnail&${query}`;
};