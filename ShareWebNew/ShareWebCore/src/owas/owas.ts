import { metaData } from '../apis/efshttp/file/file';
import { getInfo } from '../apis/efshttp/link/link'
import { getLockInfo } from '../apis/eachttp/autolock/autolock'
import { getOEMConfig } from '../config/config';
import { getSiteOfficeOnLineInfo } from '../apis/eachttp/config/config'
import { get } from '../../util/http/http'
import { serializeName, OWASSupported } from '../extension/extension'
import { getOpenAPIConfig } from '../openapi/openapi'
import { docname } from '../docs/docs'
import { getEnvLanguage } from '../language/language'
import { checkPermItem, SharePermission } from '../permission/permission'

type OwaMethod = 'view' | 'edit'

/**
 * 获取OWAS对应aspx应用
 * @param owasurl owa地址
 * @param method view | edit
 * @param ext 文件后缀名
 */
let OwasActions: Array<string> | null = null
async function getOWASApps(owasurl, method: OwaMethod, ext) {
    OwasActions = OwasActions || await get(`${owasurl}/hosting/discovery`).then(xml => xml.response.match(/<action[^>]*/g))
    const [action] = (OwasActions as Array<string>).filter(action => action.match(`name="${method}" ext="${ext.toLowerCase()}"`))
    if (action) {
        const match = action.match(/http.+(?=\&lt\;ui=UI)/)
        if (match) {
            return match[0]
        }
    }
    throw { errcode: ErrorCode.NotSupport }
}

interface OwaOptions {
    method?: OwaMethod;
    canedit?: boolean;
    canprint?: boolean;
    /**
     * 预览的是否是最新版本
     */
    latest?: boolean;
}

export enum ErrorCode {
    NotSupport = -1,
    NoPermission = -2,
    Locked = -3
}

/**
 * 获取OWAS地址
 * @param doc 文档对象
 * @param link 外链
 * @return Promise<string> owa 预览/编辑url
 */
export async function getOWASURL(doc, { method = 'view', canedit = false, canprint = true, latest = true }: OwaOptions = {}) {
    const
        { host, EFSPPort, userid, tokenid } = getOpenAPIConfig(['host', 'EFSPPort', 'userid', 'tokenid']),
        { docid, link, password, rev } = doc

    if (method === 'edit') {

        if (link || !(await checkPermItem(doc.docid, SharePermission.MODIFY, userid))) {
            throw { errcode: ErrorCode.NoPermission }
        }

        if (!(await canOWASEdit(doc))) {
            throw { errcode: ErrorCode.NotSupport }
        }

        const lockInfo = await getLockInfo(doc)

        if (lockInfo.islocked && lockInfo.lockerid !== getOpenAPIConfig('userid')) {
            throw { errcode: ErrorCode.Locked, lockInfo }
        }
    }

    const
        { site } = await (link ? getInfo({ link, password, docid }) : metaData({ docid: doc.docid })),
        { office, wopi, ip } = await getSiteOfficeOnLineInfo({ sitename: site }),
        accessToken = { host, port: EFSPPort, ...(docid ? { doc: { docid, rev: latest ? undefined : rev } } : {}), ...(link ? { link: { link, password } } : { userid, tokenid }), canedit, canprint, remotehost: ip }
    const owasApp = await getOWASApps(office, method, serializeName(docname(doc)).slice(1))
    return `${owasApp}ui=${getEnvLanguage()}&WOPISrc=${encodeURIComponent(`${wopi}/wopi/files/${doc && doc.docid ? doc.docid.split('/').pop() : link.link}`)}&access_token=${encodeURIComponent(JSON.stringify(accessToken))}`
}

/**
 * 判断是否支持owa预览
 * @param doc 文档对象
 * @return Promise<boolean>
 */
export async function canOWASPreview(doc) {
    const { owasurl, wopiurl } = await getOEMConfig()
    return !!(owasurl && wopiurl && OWASSupported(docname(doc)))
}

/**
 * 判断是否支持owa编辑
 * @param doc 
 */
export async function canOWASEdit(doc) {
    const { owasurl, wopiurl } = await getOEMConfig()
    return !!(owasurl && wopiurl && OWASSupported(docname(doc), { editable: true }))
}