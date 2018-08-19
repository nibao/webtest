import { queryString } from '../../util/http/http';
import { useHTTPS } from '../../util/browser/browser';
import { getOpenAPIConfig } from '../openapi/openapi';
import { playInfo as linkPlayInfo } from '../apis/efshttp/link/link';
import { playInfo as filePlayInfo } from '../apis/efshttp/file/file';

/**
 * 获取播放信息
 * @returns {Promise}
 */
export function getPlayInfo({ link, password, docid, rev, definition, }) {
    if (link) {
        return linkPlayInfo({ link, password, docid, rev, definition });
    } else {
        return filePlayInfo({ docid, rev, definition });
    }
}

/**
 * 构建当前播放器请求视频或音频的src地址
 * @param docid 获取文件转码状态的返回的docid
 */
export function buildUrl(type, { docid }): string {
    const host = getOpenAPIConfig('host');
    const [, reqhost] = host.match(/^https?:\/\/(.+)$/);
    const port = getOpenAPIConfig('EFSPPort');
    const userid = getOpenAPIConfig('userid');
    const tokenid = getOpenAPIConfig('tokenid');

    let query = queryString({
        docid,
        reqhost,
        usehttps: useHTTPS()
    });

    return type === 'link' ?
        `${host}:${port}/v1/link?method=play&${query}`
        : `${host}:${port}/v1/file?method=play&${query}&userid=${userid}&tokenid=${tokenid}`
};