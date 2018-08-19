import { every, last, findIndex, includes, pick, isEmpty, reduce } from 'lodash'
import { list as listDir } from '../apis/efshttp/dir/dir'
import { listDir as listLink, get as getLink, getDetail } from '../apis/efshttp/link/link'
import { get as getDocInfos } from '../apis/eachttp/entrydoc/entrydoc'
import { getPendingApprovals, getDocApprovals } from '../apis/eachttp/audit/audit'
import { docname, isDir } from '../docs/docs'
import { splitName } from '../extension/extension'
import { splitGNS } from '../gns/gns'
import { eventFactory } from '../event/event'
import session from '../../util/session/session'


export enum EventType {

    /** fileSystem 插入文件对象 */
    FS_INSERT,

    /** fileSystem 删除文件对象 */
    FS_DELETE,

    /** fileSystem 更新文件对象 */
    FS_UPDATE
}

export const { subscribe, trigger } = eventFactory(EventType)

/**
 * 更新缓存周期
 */
const TIMEOUT = 30000

/** 一级gns的长度 */
export const GNS_LENGTH = 32

/** 
 * 缓存list 
 */
const Cache = {}, VirtualDocs = {}

/**
 * 外链缓存
 */
let Links = {}

/**
 * 从 session 取 links 数据
 */
try {
    Links = session.get('link') || {}
} catch (e) {

}

/**
 * 本地排序
 * @param docs 
 * @param by 排序依据
 * @param sort asc | desc
 */
function sortDoc(docs, by, sort) {
    switch (by) {
        case 'name':
            return docs.sort((doc1, doc2) => sort === 'asc' ?
                docname(doc1).localeCompare(docname(doc2)) :
                docname(doc2).localeCompare(docname(doc1))
            )
        case 'type':
            return docs.sort((doc1, doc2) => sort === 'asc' ?
                splitName(docname(doc1))[1].localeCompare(splitName(docname(doc2))[1]) :
                splitName(docname(doc2))[1].localeCompare(splitName(docname(doc1))[1])
            )
        default:
            return docs.sort((doc1, doc2) => sort === 'asc' ?
                (typeof doc1[by] === 'number' ? doc1[by] - doc2[by] : String(doc1[by]).localeCompare(String(doc2[by]))) :
                (typeof doc1[by] === 'number' ? doc2[by] - doc1[by] : String(doc2[by]).localeCompare(String(doc1[by])))
            )
    }
}

/**
 * 清空缓存
 */
export function clearCache(cacheIds: null | string | Array<string> = null) {
    if (cacheIds === null) {
        cacheIds = Object.keys(Cache)
    }
    if (typeof cacheIds === 'string') {
        cacheIds = [cacheIds]
    }
    cacheIds.forEach(cacheId => {
        if (typeof cacheId === 'string') {
            delete Cache[cacheId]
            if (cacheId === 'entrydoc') {
                for (let key in VirtualDocs) {
                    delete VirtualDocs[key]
                }
            }
        }
    })
}

/**
 * 获取外链
 * @param link 外链Id
 */
export async function getLinkRoot(link, password = '') {
    if (!Links[link] || password && password !== Links[link].password) {
        Links[link] = { ...(await getLink({ link, password })), link, password }
        /**
         * 外链密码改变时删除外链根目录下的缓存
         */
        for (const cacheId in Cache) {
            if (cacheId.startsWith(Links[link].docid)) {
                delete Cache[cacheId]
            }
        }
        session.set('link', Links)
    }
    return Links[link]
}

/** 列举目录 */
export async function list(
    dir?,
    {
        by = undefined,
        sort = undefined,
        attr = false,
        useCache = true
    } = {}
) {

    /** 
     * 缓存id
     * 文件夹以docid作缓存id
     * 入口文档以 ‘entrydoc’ 作缓存id
     **/
    const cacheId = dir ? dir.docid : 'entrydoc'

    /**
     * 排序方法
     * 传入排序方法 或 缓存的排序方法 或 文件名 递增
     */
    by = by || (Cache[cacheId] ? Cache[cacheId].by : 'name') || 'name'
    sort = sort || (Cache[cacheId] ? Cache[cacheId].sort : 'asc') || 'asc'

    /**
     * 入口文档
     */
    const entrydoc = Cache['entrydoc']

    const entrydocShouldUpdate =
        /** 
         * 不是外链文件且不是共享审核且没缓存过entrydoc 
         **/
        !(dir && (dir.link || dir.docid === 'gns://approval' || dir.applyid || dir.docid === 'gns://docapproval')) && !entrydoc ||

        /** 
         * 根目录或虚拟目录 且 useCache 为 false 或 entrydoc缓存已过期 
         **/
        (!dir || isVirtual(dir)) && (!useCache || entrydoc && (Date.now() - entrydoc.updateTime > TIMEOUT))

    /**
     * 更新entrydoc
     */
    if (entrydocShouldUpdate) {
        clearCache('entrydoc')

        const { docinfos } = await getDocInfos()

        /**
         * 记录更新时间
         */
        const updateTime = Date.now()

        if (docinfos.length) {
            /**
             * 将入口文档解析成目录结构并缓存
             */
            docinfos.forEach(docinfo => {
                const {
                    docname, docid, size, doctype, otag, typename,
                    view_doctype, view_doctypename, view_name, view_type,
                    ...otherInfo
                } = docinfo
                const names = docname.split('\\')
                const gnses = splitGNS(docid)

                /**
                 * 根据目录名构建入口文档、虚拟目录
                 */
                names.reduce((parentDir, name, i) => {

                    const newDoc = {
                        ...otherInfo, name, docid: gnses[i],
                        ...(i === 0 ? { doctype, otag, typename, view_doctype, view_doctypename, view_name, view_type } : {}),
                        ...(i === names.length - 1 ? { size } : { size: -1 })
                    }

                    /**
                     * 虚拟目录
                     */
                    if (names.length > 1 && i < names.length - 1) {
                        if (!VirtualDocs[newDoc.docid]) {
                            VirtualDocs[newDoc.docid] = newDoc
                        } else {
                            const { modified, editor, create_time, creator } = newDoc
                            if (modified > VirtualDocs[newDoc.docid].modified) {
                                VirtualDocs[newDoc.docid] = { ...VirtualDocs[newDoc.docid], modified, editor }
                            }
                            if (create_time < VirtualDocs[newDoc.docid].create_time) {
                                VirtualDocs[newDoc.docid] = { ...VirtualDocs[newDoc.docid], create_time, creator }
                            }
                        }
                    }

                    const listCache = Cache[parentDir['docid']] || { dirs: [], files: [], updateTime }
                    let { dirs, files } = listCache

                    /**
                     * 根据文件类型将文件放入 dirs 或 files
                     */
                    if (newDoc.size === -1) {
                        if (every(dirs, ({ docid }) => docid !== newDoc.docid)) {
                            dirs = [...dirs, newDoc]
                        }
                    } else {
                        if (every(files, ({ docid }) => docid !== newDoc.docid)) {
                            files = [...files, newDoc]
                        }
                    }

                    Cache[parentDir['docid']] = { ...listCache, dirs, files }

                    /**
                     * 返回新 doc 作为子路径的 parentDir
                     */
                    return newDoc

                }, { docid: 'entrydoc' })
            })
        } else {

            /**
             * 关闭个人文档时，docinfos 为空数组，列举报错 
             */
            Cache['entrydoc'] = { dirs: [], files: [], updateTime }
        }
    }

    /**
     * 根目录或虚拟目录
     */
    if (!dir || isVirtual(dir)) {
        let { dirs, files, sort: currentSort, by: currentBy } = Cache[cacheId]
        if (currentBy !== by || currentSort !== sort) {
            dirs = Cache[cacheId].dirs = sortDoc(dirs, by, sort)
            files = Cache[cacheId].files = sortDoc(files, by, sort)
            Cache[cacheId].sort = currentSort
            Cache[cacheId].by = currentBy
        }
        return { dirs, files }
    }

    /**
     * 支持服务端排序
     */
    const canServerSort = dir.docid !== 'gns://approval' && !dir.applyid && dir.docid !== 'gns://docapproval' && (by === 'name' || by === 'size' || by === 'time')

    /**
     * 是否从服务器刷新数据
     */
    const dirCacheShouldUpdate =
        /**
         * 未缓存
         */
        !Cache[cacheId] ||

        /**
         * 不使用缓存
         */
        !useCache ||

        /**
         * 缓存已过期
         */
        (Date.now() - Cache[cacheId].updateTime > TIMEOUT) ||

        /**
         * 使用服务器排序但当前排序方式和缓存不同 或 不使用服务器排序
         */
        canServerSort && (Cache[cacheId].sort !== sort || Cache[cacheId].by !== by) || !canServerSort

    if (dirCacheShouldUpdate) {
        const { link, password, perm, usrdisplayname, usrloginname, docid,
            applyid, apptype, createdate, csflevel, detail, sharername,
            applymsg, auditornames, auditprogress, audittype, creatorname, processname
         } = <any>dir

        /**
         * list请求排序参数参数
         */
        const listBy = canServerSort ? by : 'name'
        const listSort = canServerSort ? sort : 'asc'

        let res

        if (link) {
            res = await listLink({ link, docid, password, attr, by: listBy, sort: listSort })
        } else if (dir.docid === 'gns://approval') {
            const { applyinfos } = await getPendingApprovals()
            let dirs: Array<any> = [], files: Array<any> = []
            applyinfos.forEach(applyinfo => {
                if (applyinfo.isdir) {
                    dirs.push(applyinfo)
                } else {
                    files.push(applyinfo)
                }
            })
            res = { dirs, files }
        } else if (dir.docid === 'gns://docapproval') {
            const { applyinfos } = await getDocApprovals()
            let dirs: Array<any> = [], files: Array<any> = []
            applyinfos.forEach(applyinfo => {
                if (applyinfo.isdir) {
                    dirs.push(applyinfo)
                } else {
                    files.push(applyinfo)
                }
            })
            res = { dirs, files }
        }
        else {
            res = await listDir({ docid, attr, by: listBy, sort: listSort })
        }

        let { dirs, files } = res

        /**
         * 外链文件将外链信息添加到文件对象
         */
        if (link) {
            dirs = dirs.map(doc => ({ link, password, perm, usrdisplayname, usrloginname, ...doc }))
            files = files.map(doc => ({ link, password, perm, usrdisplayname, usrloginname, ...doc }))
        }

        if (dir.applyid) {
            if (dir.docid === 'gns://docapproval' || dir.hasOwnProperty('auditprogress')) { // 申请中的流程审核
                dirs = dirs.map(doc => ({ applyid, applymsg, createdate, csflevel, auditornames, auditprogress, audittype, creatorname, processname, ...doc }))
                files = files.map(doc => ({ applyid, applymsg, createdate, csflevel, auditornames, auditprogress, audittype, creatorname, processname, ...doc }))
            } else { // 申请中的共享审核
                dirs = dirs.map(doc => ({ applyid, apptype, createdate, csflevel, detail, sharername, ...doc }))
                files = files.map(doc => ({ applyid, apptype, createdate, csflevel, detail, sharername, ...doc }))
            }
        }

        /**
         * 缓存list数据，更新时间，排序方式
         */
        Cache[docid] = { dirs, files, updateTime: Date.now(), sort, by }
    }

    let { dirs, files } = Cache[cacheId]

    /**
     * 本地排序
     */
    if (!canServerSort) {
        dirs = sortDoc(dirs, by, sort)
        files = sortDoc(files, by, sort)
    }

    return { dirs, files }
}

/**
 * 判断虚拟目录
 * @param param0 
 */
export function isVirtual({ docid }) {
    return typeof VirtualDocs[docid] !== 'undefined'
}

export function isEntryDoc({ docid }) {
    return /^gns\:\/\/([0-9]|[A-F]){32}$/.test(docid)
}

/**
 * 判断 target 是否为 parent 的子目录
 * @param parent 父目录
 * @param target
 */
export function isChildOf(parent: any = null, target) {
    return isDescentdantOf(parent, target) && target.docid.length === GNS_LENGTH + (parent ? parent.docid.length + 1 : 6)
}

/**
 * 判断 target 是否为 parent 或 parent 的子目录中
 */
export function isDescentdantOf(parent: any = null, target) {
    if (target && target.docid) {
        if (parent === null) {
            return true
        }
        return parent.docid && target.docid.startsWith(parent.docid)
    }
}

/**
 * 根据文件获取doc路径
 * @param doc 
 * @param relativeRoot 
 */
export async function getDocsChainByDocId(docid = '', relativeRoot: any = null) {
    let docs = [relativeRoot],
        currentIndex = 0,
        gnses = splitGNS(docid).slice(relativeRoot ? (relativeRoot.docid.length - 5) / (GNS_LENGTH + 1) : 0)

    try {
        for (let gns of gnses) {
            const { dirs, files } = await list(last(docs))
            const findScope = currentIndex === gnses.length - 1 ? [...dirs, ...files] : dirs
            const findDoc = findScope.find(doc => doc.docid === gns)

            currentIndex += 1

            if (findDoc) {
                docs = [...docs, findDoc]
            } else {
                throw { errmsg: `${gns} not found` }
            }
        }

        return docs

    } catch (e) {
        throw {
            errcode: e.errcode,
            nativeEvent: e,
            upperDocsChain: docs
        }
    }
}

/**
 * 根据docid获取文档
 * @param docid 
 * @param relativeRoot 
 */
export async function getDocByDocId(docid = '', relativeRoot: any = null) {
    return last(await getDocsChainByDocId(docid, relativeRoot))
}

/**
 * 根据doc获取文件链
 * @param doc 
 * @param relativeRoot 
 */
export async function getDocsChain(doc: any = null, relativeRoot: any = null) {
    if (doc && !relativeRoot) {
        if (doc.applyid) {
            const approvalRoot = { docid: 'gns://approval' }
            const { dirs, files } = await list(approvalRoot)
            relativeRoot = [...dirs, ...files].find(dir => dir.applyid === doc.applyid)
            if (relativeRoot && relativeRoot.docid === doc.docid) {
                return [approvalRoot, relativeRoot]
            }

            return [approvalRoot, ...(await getDocsChainByDocId(doc && doc.docid ? doc.docid : '', relativeRoot))]
        }
        if (doc.link) {
            relativeRoot = await getLinkRoot(doc.link, doc.password)
        }
    }
    return getDocsChainByDocId(doc && doc.docid ? doc.docid : '', relativeRoot)
}

/**
 * 获取流程审核待审核文件链
 */
export async function getFlowApvDocsChain(doc: any = null, relativeRoot: any = null) {
    const approvalRoot = { docid: 'gns://docapproval' }
    const { dirs, files } = await list(approvalRoot)
    relativeRoot = [...dirs, ...files].find(dir => dir.applyid === doc.applyid)
    if (relativeRoot && relativeRoot.docid === doc.docid) {
        return [approvalRoot, relativeRoot]
    }

    return [approvalRoot, ...(await getDocsChainByDocId(doc && doc.docid ? doc.docid : '', relativeRoot))]
}

/**
 * 获取父目录
 * @param doc 
 */
export async function getParent(doc) {
    if (doc && doc.docid && doc.docid.length > GNS_LENGTH + 6) {
        let relativeRoot = null
        if (doc && doc.link) {
            relativeRoot = await getLinkRoot(doc.link, doc.password)
        }
        return getDocByDocId(doc.docid.slice(0, -(GNS_LENGTH + 1)), relativeRoot)
    }
    return null
}

/**
 * 把文件转换为路径
 * @param doc 
 */
export async function convertPath(doc, relativeRoot) {
    let docs = await getDocsChain(doc, relativeRoot)
    if (!docs[0]) {
        docs = docs.slice(1)
    }
    return docs.map(docname).join('/')
}

/**
 * 根据文件路径获取文件链
 * @param path 
 * @param relativeRoot 
 */
export async function getDocsChainByNamePath(namepath: string | Array<string> = [], relativeRoot = null) {
    if (typeof namepath === 'string') {
        namepath = namepath.split('/').filter(name => !!name)
    }

    let docs = [relativeRoot], currentIndex = 0

    try {
        for (const name of namepath) {

            const { dirs, files } = await list(last(docs))
            const findScope = currentIndex === namepath.length - 1 ? [...dirs, ...files] : dirs
            const findDoc = findScope.find(doc => docname(doc) === name)

            currentIndex += 1

            if (findDoc) {
                docs = [...docs, findDoc]
            } else {
                throw { errmsg: `${name} not found` }
            }
        }
        return docs
    } catch (e) {
        throw {
            errcode: e.errcode,
            nativeEvent: e,
            upperDocsChain: docs
        }
    }
}

/**
 * 根据路径获取doc
 * @param path 
 */
export async function getDocByNamePath(namepath, relativeRoot) {
    return last(await getDocsChainByNamePath(namepath, relativeRoot))
}

/**
 * 插入新doc
 * @param doc 
 * @param parentDir 
 */
export async function insert(doc) {

    if (doc) {
        const { docid } = doc

        let cacheId = 'entrydoc'

        if (docid.length > GNS_LENGTH + 6) {
            cacheId = docid.slice(0, -(GNS_LENGTH + 1))
        }

        const listCache = Cache[cacheId] || { dirs: [], files: [], updateTime: Date.now() }

        let { dirs, files } = listCache

        if (isDir(doc)) {
            let index = findIndex(dirs, (dir: any) => dir.docid === docid)
            dirs = index === -1 ? [doc, ...dirs] : [...dirs.slice(0, index), doc, ...dirs.slice(index + 1)]
        } else {
            let index = findIndex(files, (file: any) => file.docid === docid)
            files = index === -1 ? [doc, ...files] : [...files.slice(0, index), doc, ...files.slice(index + 1)]
        }

        trigger(EventType.FS_INSERT, null, doc)

        Cache[cacheId] = { ...listCache, dirs, files }
    }

    return doc
}

/**
 * 从缓存中删除文档
 * @param doc 
 */
export function del(doc) {
    if (doc) {
        const { docid } = doc

        /**
         * 父目录id
         */
        let cacheId = 'entrydoc'

        /**
         * 非入口文档，id为docid截去最后一级
         * URL protocol “gns://” length 为 6
         */
        if (docid.length > GNS_LENGTH + 6) {
            cacheId = docid.slice(0, -(GNS_LENGTH + 1))
        }

        const listCache = Cache[cacheId]

        if (listCache) {
            let { dirs, files } = listCache
            if (isDir(doc)) {
                dirs = dirs.filter(doc => doc.docid !== docid)
            } else {
                files = files.filter(doc => doc.docid !== docid)
            }
            trigger(EventType.FS_DELETE, null, doc)
            Cache[cacheId] = { ...listCache, dirs, files }
        }

        /**
         * 删除文件夹时删除所有子文件夹的缓存
         */
        if (isDir(doc)) {
            for (const key in Cache) {
                if (key.startsWith(doc.docid)) {
                    delete Cache[key]
                }
            }
        }
    }

    return doc
}

/**
 * 更新缓存文件信息
 * @param doc 
 * @param metas 
 */
export function update(doc, metas = {}) {
    if (doc) {
        const { docid } = doc
        let cacheId = 'entrydoc'

        if (docid.length > GNS_LENGTH + 6) {
            cacheId = docid.slice(0, -(GNS_LENGTH + 1))
        }

        const listCache = Cache[cacheId]

        if (listCache) {
            let { dirs, files } = listCache

            if (isDir(doc)) {
                const index = findIndex(dirs, (doc: any) => doc.docid === docid)
                if (index !== -1) {
                    doc = { ...dirs[index], ...metas }
                    dirs = [...dirs.slice(0, index), doc, ...dirs.slice(index + 1)]
                }
            } else {
                const index = findIndex(files, (doc: any) => doc.docid === docid)
                if (index !== -1) {
                    doc = { ...files[index], ...metas }
                    files = [...files.slice(0, index), doc, ...files.slice(index + 1)]
                }
            }

            trigger(EventType.FS_UPDATE, null, doc)

            Cache[cacheId] = { ...listCache, dirs, files }
        }

        if (isDir(doc)) {
            /**
             * 需要更新子目录信息白名单
             */
            const WHITE_LIST = ['password']

            /**
             * 子目录需要更新的属性
             */
            const shouldUpdateChildrenCacheMetas = pick(metas, WHITE_LIST)

            if (!isEmpty(shouldUpdateChildrenCacheMetas)) {
                /**
                 * 遍历Cache，根据缓存id判断
                 */
                for (let key in Cache) {
                    if (key.startsWith(doc.docid)) {
                        const { dirs, files, ...otherInfos } = Cache[key]
                        Cache[key] = {
                            dirs: dirs.map(doc => ({ ...doc, ...shouldUpdateChildrenCacheMetas })),
                            files: files.map(doc => ({ ...doc, ...shouldUpdateChildrenCacheMetas })),
                            ...otherInfos
                        }
                    }
                }
            }
        }
    }

    return doc
}

/**
 * 获取文件对应的入口文档
 * @param doc 
 */
export async function getViewDoc(doc) {
    if (doc && typeof doc.docid === 'string' && !doc.link) {
        const { dirs } = await list(null)
        return dirs.find(dir => doc.docid.startsWith(dir.docid))
    }
}

/**
 * 获取文件的 view_type
 * @param doc 
 */
export async function getViewType(doc) {
    const viewDoc = await getViewDoc(doc)
    if (viewDoc) {
        return viewDoc.view_type
    }
}

/**
 * 获取文件的 view_doctype
 * @param doc 
 */
export async function getViewDocType(doc) {
    const viewDoc = await getViewDoc(doc)
    if (viewDoc) {
        return viewDoc.view_doctype
    }
}