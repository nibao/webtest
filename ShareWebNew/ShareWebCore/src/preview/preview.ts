/// <reference path="./preview.d.ts" />

import { useHTTPS } from '../../util/browser/browser';
import { getOpenAPIConfig } from '../openapi/openapi';
import { previewOSS as previewLinkOSS } from '../apis/efshttp/link/link';
import { previewOSS as previewFileOSS } from '../apis/efshttp/file/file';
import { preview as previewQuarantineFile } from '../apis/efshttp/quarantine/quarantine';

/**
 * 文档预览，支持外链／权限
 */
export function previewOSS({ link, password, docid, rev, illegalContentQuarantine, usehttps = useHTTPS() }: Core.Preview.PreviewOSS): PromiseLike<APIs.EFSHTTP.File.PreviewOSSInfo | APIs.EFSHTTP.Link.PreviewOSSInfo> {
    const [, reqhost] = getOpenAPIConfig('host').match(/^https?:\/\/(.+)$/);

    if (link) {
        return previewLinkOSS({ link, docid, password, usehttps, reqhost });
    } else if (illegalContentQuarantine) {
        return previewQuarantineFile({ docid, rev, usehttps, reqhost });
    } else {
        return previewFileOSS({ docid, rev, usehttps, reqhost });
    }

}


/**
 * 初始化PDFJS
 */
export function init({ cMapUrl, cMapPacked, workerSrc }) {
    PDFJS.cMapUrl = cMapUrl;
    PDFJS.cMapPacked = cMapPacked;
    PDFJS.workerSrc = workerSrc;
}
