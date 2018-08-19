import { isDir, docname } from '../docs/docs'
import { splitName } from '../extension/extension'
import { OSDownload, batchDownload } from '../apis/efshttp/file/file'
import { OSDownload as OSDownloadLink, batchDownload as batchDownloadLink } from '../apis/efshttp/link/link'
import { getOpenAPIConfig } from '../openapi/openapi';
import { useHTTPS, isBrowser, Browser, OSType } from '../../util/browser/browser';
import { eventFactory } from '../event/event'
import { post } from '../../util/http/http'
import { checkPermItem, SharePermission, LinkSharePermission, checkLinkPerm } from '../permission/permission'
import * as fs from '../filesystem/filesystem'

export enum EventType {
    /**
     * 下载成功
     */
    DOWNLOAD_SUCCESS,

    /**
     * 下载失败
     */
    DOWNLOAD_ERROR
}

export const { subscribe, trigger } = eventFactory(EventType)

export enum ErrorCode {

    /** iOS不允许下载 */
    FAIL_IOS,

    /** 微信不支持下载 */
    FAIL_WECHAT,

    /** 无复制权限 */
    No_COPY_PERMISSION,

    /** 密级不足 */
    SECURITY_INSUFICIENT = 403065,

    /** 文件不存在 */
    FILE_NOT_EXISTED = 404006,

    /** 无下载权限 */
    FILE_NO_PERMISSION = 403002,

    /** 无法传输大文件 */
    FILE_SIZE_LIMITED = 403070,

    /** 外链不存在 */
    LINK_NOT_EXISTED = 404008,

    /** 下载次数达到上线 */
    DOWNLOADS_LIMIT = 403153,

    /** 添加水印失败 */
    WATERMARKING_FAILED = 403170,

    /** 等待制作水印 */
    WAITING_WATERMARK = 503006,

    /** 正在制作水印  */
    MAKING_WATERMARK = 503005,

    /** 站点被移除 */
    SITE_REMOVED = 404017,

    /** 水印文档禁止批量下载 */
    WATERMARK_BATCH_DENIED = 403183,

    /** 不支持水印 */
    WATERMARK_NOT_SUPPORT = 403178,

    /** 外链密码不正确 */
    LINK_AUTH_FAILED = 401002
}

/**
 * 截取文件名，下载地址url长度限制
 * @param name 文件名
 * @param saveExt 后缀名
 * @param length 长度限制
 */
export function subName(doc, saveExt = '', length) {

    let name

    if (doc === null) {
        /**
         * 根目录压缩包名为 files.zip
         */
        name = 'files'
    } else {
        name = docname(doc)
    }

    let [base, ext] = (doc === null || isDir(doc)) ? [name, ''] : splitName(name)

    ext = saveExt || ext || ''

    if (ext && !ext.startsWith('.')) {
        ext = '.' + ext
    }

    let result = base + ext,
        encoded = encodeURIComponent(encodeURIComponent(result)),
        top = result.length,
        bottom = 0

    if (encoded.length <= length) {
        return result
    }

    while (bottom <= top) {

        let mid = Math.floor(bottom + (top - bottom) / 2)

        result = base.slice(0, mid) + ext
        /** 
         * 下载地址对文件名进行两次 encodeURI
         **/
        encoded = encodeURIComponent(encodeURIComponent(result))

        if (encoded.length < length) {
            if (encodeURIComponent(encodeURIComponent(base.slice(0, mid + 1) + ext)).length > length) {
                break
            }
            bottom = mid + 1
        } else if (encoded.length > length) {
            if (encodeURIComponent(encodeURIComponent(base.slice(0, mid - 1) + ext)).length < length) {
                break
            }
            top = mid - 1
        } else {
            break
        }
    }

    return result
}

/**
 * 获取保存文件名
 * @param doc 
 */
async function getSaveName(doc) {
    if (Array.isArray(doc)) {
        if (doc.length === 1) {
            return subName(doc[0], 'zip', 750)
        }
        return subName(await fs.getParent(doc[0]), 'zip', 750)
    }
    return subName(doc, '', 750)
}

/**
 * 获取下载地址
 * @param doc 
 * @param savename 
 */
export async function download(
    doc: any,
    { IOSDisabled = true, WeChatDisabled = true, checkPermission = true } = {},
    savename: string | ((doc?: any) => string | Promise<string>) = getSaveName
) {

    /**
     * 微信不支持下载
     */
    if (WeChatDisabled && isBrowser({ app: Browser.WeChat })) {
        trigger(
            EventType.DOWNLOAD_ERROR,
            null,
            { errcode: ErrorCode.FAIL_WECHAT }
        )
        return
    }

    /**
     * IOS 不支持下载
     */
    if (IOSDisabled && isBrowser({ os: OSType.IOS })) {
        trigger(
            EventType.DOWNLOAD_ERROR,
            null,
            { errcode: ErrorCode.FAIL_IOS }
        )
        return
    }

    try {
        doc = await (typeof doc === 'function' ? doc() : doc)
    } catch (e) {
        return
    }

    if (!doc || Array.isArray(doc) && doc.length === 0) {
        return
    }

    if (Array.isArray(doc) && doc.length === 1 && !isDir(doc[0])) {
        doc = doc[0]
    } else if (!Array.isArray(doc) && isDir(doc)) {
        doc = [doc]
    }

    const { host, userid } = getOpenAPIConfig()

    /**
     * 检查下载权限
     */
    if (checkPermission && !Array.isArray(doc)) {
        try {
            const canDownload = doc.link ?
                (await checkLinkPerm({ link: doc.link, password: doc.password, perm: LinkSharePermission.DOWNLOAD })) :
                (await checkPermItem(doc.docid, SharePermission.COPY, userid))
            if (!canDownload) {
                throw { errcode: doc.link ? ErrorCode.FILE_NO_PERMISSION : ErrorCode.No_COPY_PERMISSION }
            }
        } catch (e) {
            trigger(
                EventType.DOWNLOAD_ERROR,
                null,
                {
                    errcode: e.errcode,
                    nativeEvent: e,
                    target: doc
                }
            )
            return
        }
    }

    try {
        savename = await (typeof savename === 'function' ? savename(doc) : savename)
    } catch (e) {
        return
    }

    const [, reqhost] = host.match(/^https?:\/\/(.+)$/)

    try {
        if (Array.isArray(doc)) {
            /**
             * 批量下载
             */
            const { dirs, files } = doc.reduce(({ dirs, files }, doc) => {
                if (isDir(doc)) {
                    dirs = [...dirs, doc.docid]
                } else {
                    files = [...files, doc.docid]
                }
                return { dirs, files }
            }, { dirs: [], files: [] })

            const { link, password } = doc[0]

            const { url } = link ?
                await batchDownloadLink({ name: savename, reqhost, usehttps: useHTTPS(), files, dirs, link, password }) :
                await batchDownload({ name: savename, reqhost, usehttps: useHTTPS(), files, dirs })

            trigger(EventType.DOWNLOAD_SUCCESS, null, url)
        } else {
            /**
             * 单文件下载
             */
            const { link, password, docid, rev } = doc

            let { authrequest: [, url], need_watermark } = link ?
                await OSDownloadLink({ link, password, docid, reqhost, usehttps: useHTTPS(), savename }) :
                await OSDownload({ docid, rev, authtype: 'QUERY_STRING', reqhost, usehttps: useHTTPS(), savename })

            /**
             * 下载水印
             */
            if (need_watermark) {
                /**
                 * 水印服务器请求 url 过长，在部分浏览器中下载失败，将 watermark= 作为 body,
                 * 其它部分作为 url post到水印服务器，获取水印文件下载地址
                 */
                const urlChunks = url.split('&')
                const watermarkQuery = urlChunks.filter(str => str.startsWith('watermark='))[0]
                const watermarkUrl = urlChunks.filter(str => str !== watermarkQuery).join('&')
                let [, body] = watermarkQuery.split('=')
                body = JSON.parse(decodeURIComponent(body))
                body.usehttps = useHTTPS()
                body.reqhost = reqhost

                /**
                 * @todo: 当组件调用不是在as页面时，port 不一定是 location.port
                 */
                body.reqport = location.port
                const { response, status } = await post(watermarkUrl, JSON.stringify(body), { sendAs: 'text', readAs: 'json' })

                /**
                * 抛错
                */
                if (status > 400) {
                    throw response
                }

                url = response.authrequest[1]
            }
            trigger(EventType.DOWNLOAD_SUCCESS, null, url)
        }
    } catch (e) {
        if (e) {
            const { errcode } = e
            trigger(
                EventType.DOWNLOAD_ERROR,
                null,
                {
                    errcode,
                    nativeEvent: e,
                    target: doc
                }
            )
        }
    }
}