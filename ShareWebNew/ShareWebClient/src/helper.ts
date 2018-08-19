import { merge } from 'lodash'
import { hashHistory } from 'react-router'
import session from '../util/session/session'
import { setup as setupOpenAPI } from '../core/openapi/openapi'
import { getDocByDocId } from '../core/filesystem/filesystem'
import { getConfig } from '../core/config/config'
import __ from './locale'

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
 * 更新用户信息
 * @param login 
 */
export const updateLogin = (login) => {
    const { userid, tokenid } = login

    session.set('login', login)
    setupOpenAPI({
        userid: userid,
        tokenid: tokenid
    })
}

/**
 * 清除用户会话信息
 */
export const clearLogin = () => {
    session.remove('login')

    setupOpenAPI({
        userid: null,
        tokenid: null,
    })

}


let HomeNav
/**
 * todo 从服务器获取Home导航
 */
export async function getHomeNav() {
    if (!HomeNav) {
        const msgStatus = await getConfig('enable_message_notify');
        const routeStatus = {
            '/home/documents': true,
            '/home/search': true,
            '/home/approvals': true,
            '/home/message': msgStatus === undefined ? true : msgStatus,
            '/home/user': true
        }
        HomeNav = [
            {
                path: '/home/documents',
                label: __('文档'),
                childNav: [
                    {
                        label: __('全部文档'),
                        icon: '\uf086',
                        path: '/home/documents/all'
                    },
                    // {
                    //     label:__('最近访问'),
                    //     icon: '\uf022',
                    //     path: '/home/documents/recent'
                    // },
                    {
                        label: __('我的收藏'),
                        icon: '\uf094',
                        path: '/home/documents/favorites'
                    },
                    {
                        label: __('我的共享'),
                        icon: '\uf05d',
                        path: '/home/documents/share'
                    },
                    {
                        label: __('回收站'),
                        icon: '\uf000',
                        path: '/home/documents/recycle'
                    }
                ]
            },
            {
                path: '/home/search',
                label: __('搜索')
            },
            {
                path: '/home/approvals',
                label: __('审核'),
                childNav: [
                    {
                        label: __('共享审核'),
                        icon: '\uf0a8',
                        path: '/home/approvals/share-review'
                    },
                    {
                        label: __('共享申请'),
                        icon: '\uf090',
                        path: '/home/approvals/share-application'
                    },
                    // {
                    //     label: __('流程审核'),
                    //     icon: '\uf0a9',
                    //     path: '/home/approvals/flow-review'
                    // },
                    // {
                    //     label: __('流程申请'),
                    //     icon: '\uf092',
                    //     path: '/home/approvals/flow-application'
                    // },
                ]
            },
            {
                path: '/home/message',
                label: __('消息'),
                childNav: [
                    {
                        label: __('共享消息'),
                        icon: '\uf0a5',
                        path: '/home/message/share'
                    },
                    {
                        label: __('审核消息'),
                        icon: '\uf08d',
                        path: '/home/message/review'
                    },
                    {
                        label: __('安全消息'),
                        icon: '\uf0a7',
                        path: '/home/message/security'
                    }
                ]
            },
            {
                path: '/home/user',
                label: __('我的'),
                childNav: [
                    {
                        label: __('我的资料'),
                        icon: '\uf056',
                        path: '/home/user/info'
                    },
                    {
                        label: __('联系人'),
                        icon: '\uf08c',
                        path: '/home/user/contact'
                    },
                    {
                        label: __('我的设备'),
                        icon: '\uf03c',
                        path: '/home/user/device'
                    }
                ]
            }
        ].filter(route => routeStatus[route.path])
    }
    return HomeNav
}

/**
 * 在打开文件路径
 * @param latest 预览文件，是否是最新版本
 */
export function openDoc(doc, { newTab = false, latest = true } = {}) {
    let path = '/home/documents/all'

    if (doc) {
        const { docid, link, rev } = doc || { docid: '', link: undefined, rev: undefined }

        if (link) {
            path = hashHistory.createPath({ pathname: `/link/${link}`, query: docid ? { gns: docid.slice(6) } : '' })
            if (!newTab) {
                clearRouteCache('/link', `/link/${link}`)
            }
        } else {
            path = hashHistory.createPath({ pathname: path, query: { gns: docid.slice(6), rev: latest ? undefined : rev } })
        }
    }

    if (newTab) {
        window.open(`/#${path}`)
    } else {
        clearRouteCache('/home/documents', '/home/documents/all')
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

// 打开文件/目录异常
export enum Exception {
    FILE_MISSING, // 文件不存在

    PERMISSION_REJECT, // 权限不足

    LACK_OF_CSF, // 密级不足
}

/**
 * 跳转至权限申请界面
 */
export function handleApprovalCheck() {
    const nextPath = hashHistory.createPath({ pathname: 'home/approvals/share-application' })
    clearRouteCache('/home/documents', '/home/documents/all')
    hashHistory.push(nextPath)
}