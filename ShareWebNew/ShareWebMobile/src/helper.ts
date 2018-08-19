import { merge } from 'lodash'
import { hashHistory } from 'react-router'
import session from '../util/session/session'
import { setup as setupOpenApi } from '../core/openapi/openapi'
import { getDocByDocId } from '../core/filesystem/filesystem'

/**
 * 路由缓存
 */
const RouteCache = {}

/**
 * 获取路由缓存
 * @param route 
 */
export function getRouteCache(route) {
    return RouteCache[route]
}

/**
 * 设置路由缓存
 */
export function setRouteCache(route, location) {
    RouteCache[route] = location
}

/**
 * 清空路由缓存
 */
export function clearRouteCache(...routes) {
    if (routes.length === 0) {
        routes = Object.keys(RouteCache)
    }
    routes.forEach(route => {
        delete RouteCache[route]
    })
}

/**
 * 在打开文件路径
 */
export function openDoc(doc, { newTab = false } = {}) {
    let path = '/home/documents'

    if (doc) {
        const { docid, link } = doc || { docid: '', link: undefined }
        if (link) {
            path = hashHistory.createPath({ pathname: `/link/${link}`, query: docid ? { gns: docid.slice(6) } : '' })
            if (!newTab) {
                clearRouteCache('/link', `/link/${link}`)
            }
        } else {
            path = hashHistory.createPath({ pathname: path, query: { gns: docid.slice(6) } })
        }
    }

    if (newTab) {
        window.open(`/#${path}`)
    } else {
        clearRouteCache('/home/documents')
        hashHistory.push(path)
    }
}

/** 从 location 中获取doc对象 */
export async function getDocFromQuery({ gns }) {
    const docid = gns ? `gns://${gns}` : undefined
    return await getDocByDocId(docid)
}

/** 从 location 中获取link对象 */
export function getLinkFromQuery(location) {
    const { pathname, query } = location
    const { gns } = query
    const arr = pathname.split('/')
    const link = (arr && arr.length > 2) ? (arr[1] === 'link' ? arr[2].slice(0, 32) : undefined) : undefined

    const docid = gns ? `gns://${gns}` : undefined
    return merge({ docid, link })
}

export function scrollTop() {
    const body = document.querySelector('body')
    if (body) {
        body.scrollTop = 0
    }
}