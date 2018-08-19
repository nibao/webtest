import { pick } from 'lodash'
import { Browser } from '../../util/browser/browser'
import { checkWatermark as checkDirWatermark } from '../apis/efshttp/dir/dir'
import { checkWatermark as checkLinkWatermark } from '../apis/efshttp/link/link'
import { getDocWatermarkConfig } from '../apis/eachttp/config/config'
import { get as getUser } from '../apis/eachttp/user/user';
import { getHostInfo } from '../apis/eachttp/redirect/redirect';
import { getConfig } from '../config/config';

/**
 * 预览类型
 */
export enum PreviewType {
    /**
     * 等待
     */
    Loading,

    /**
     * 小图预览
     */
    SmallFilePreview,

    /**
     * 大图预览
     */
    LargeFilePreview,

    /**
     * 超过80MB的文件无法预览
     */
    TooLarge
}

/**
 * firefox
 */
const mountFlashFirefox = ({
    swfurl,
    flashVars
}: { swfurl: string, flashVars: string }) => ({
        __html:
            `<embed
        src="${swfurl}"
        id="WebCAD"
        width="100%"
        height="100%"
        name="krpanoSWFObject"
        bgcolor="#ffffff"
        allowscriptaccess="always"
        allowfullscreen="true"
        quality="high"
        wmode="transparent"
        type="application/x-shockwave-flash"
        style="outline:none;"
        FlashVars="${flashVars}"
        >
    </embed>`
    })

/**
 * chrome
 */
const mountFlashChrome = ({
    swfurl,
    flashVars
}: { swfurl: string, flashVars: string }) => ({
        __html:
            `<object type="application/x-shockwave-flash" id="WebCAD" data="${swfurl}" width="100%" height="100%">
        <param name="movie" value="${swfurl}" />
        <param name="quality" value="high" />
        <param name="bgcolor" value="#ffffff" />
        <param name="allowFullScreen" value="true" />
        <param name="play" value="true" />
        <param name="loop" value="true" />
        <param name="wmode" value="transparent" />
        <param name="scale" value="showall" />
        <param name="menu" value="true" />
        <param name="devicefont" value="false" />
        <param name="salign" value="" />
        <param name="allowScriptAccess" value="always" />
        <param name="FlashVars" value="${flashVars}" />
    </object>`
    })

/**
 * 根据浏览器类型构建对应的html
 * @param browserType 浏览器类型
 * @param swfurl
 * @param flashVars
 */
export function getFlashHtml(browserType: number | undefined, swfurl: string, flashVars: string) {
    switch (browserType) {
        case Browser.Safari:
        case Browser.MSIE:
        case Browser.Firefox:
        case Browser.Chrome: {
            return mountFlashChrome({ swfurl, flashVars })
        }

        default: {
            return mountFlashFirefox({ swfurl, flashVars })
        }
    }
}

/**
 * 构造cad预览水印url
 */
export async function buildCADHref(link: APIs.EFSHTTP.Link.Get, width: number, height: number, id: string, doc: Core.Doc.Doc): Promise<string> {
    // 获取waterinfos
    const [{ name, account }, { watermarktype, watermarkconfig }] = await Promise.all([
        link && link.link ? Promise.resolve({ name: link.usrdisplayname, account: link.usrloginname }) : getUser(),
        link && link.link ? checkLinkWatermark(doc) : checkDirWatermark(doc)
    ])

    const { user = {}, image = {}, text = {} } = JSON.parse(watermarkconfig)

    /**
     * 是否启用预览水印
     */
    const previewWatermarkEnabled = (watermarktype & 1) === 1 && (user.enabled || text.enabled)

    if (!previewWatermarkEnabled) {
        return ''
    }

    let textWidth = 0

    if (user.enabled) {
        const nameWidth = getTextWidth(name, user.fontSize)
        const accountWidth = getTextWidth(account, user.fontSize)
        textWidth = Math.max(nameWidth, accountWidth)
    }
    if (text.enabled) {
        const contentWidth = getTextWidth(text.content, text.fontSize)
        textWidth = Math.max(textWidth, contentWidth)
    }

    const [https, { host, port, https_port }] = await Promise.all([getConfig('https'), getHostInfo(null)])

    return `${https ? 'https' : 'http'}://${host}:${https ? https_port : port}/api/cadpreview?width=${width}&height=${height}&name=${encodeURIComponent(id)}&username=${encodeURIComponent(name)}&useraccount=${encodeURIComponent(account)}&textwidth=${textWidth}&type=png`
}

/**
 * 计算字体大小为fontSize的text的宽度
 */
function getTextWidth(text: string, fontSize: number): number {
    const span = document.createElement('span')

    Object.assign(span.style, {
        fontSize: `${fontSize}px`,
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        color: 'transparent',
        fontFamily: 'SourceHanSansCN-Normal'
    })

    let result = {}
    result.width = span.offsetWidth
    result.height = span.offsetWidth

    document.body.appendChild(span)
    if (typeof span.textContent !== 'undefined')
        span.textContent = text
    else {
        span.innerText = text
    }

    const width = span.offsetWidth - result.width
    document.body.removeChild(span)
    return width
}
