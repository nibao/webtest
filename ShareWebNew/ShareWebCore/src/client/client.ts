import { zipWith, assign, noop, uniqueId, throttle, filter, trimLeft } from 'lodash';
import { get, post, put, del } from '../../util/http/http';
import { getOpenAPIConfig } from '../openapi/openapi';
import { timer } from '../../util/timer/timer';
import { requestDownloadDir, requestDownloadFile, requestLocalCleanDir, requestLocalCleanFile, hasSyncTask, getSyncTaskNum, getSyncDetailByInterval } from '../apis/client/sync/sync';
import { getInfoByPath, getUnsyncLog, getUnsyncLogNum } from '../apis/client/cache/cache';
import { getSyncLogByIdAndType } from '../apis/client/log/log';
import { getSelectItemsById } from '../apis/client/sidebar/sidebar';
import { getLocalUserById } from '../apis/client/config/config';
import { defaultExecute } from '../apis/client/tmp/tmp';
import { convertPath } from '../apis/efshttp/file/file';
import { get as getUnread } from '../apis/eachttp/message/message';
import { getPendingApprovals, getApplys } from '../apis/eachttp/audit/audit';
import { getDownloadURL } from '../docs/docs';
import { checkCsfIsNull } from '../csf/csf';
import { isDir } from '../docs/docs';
import { getConfig } from '../config/config';


/**
 * 同步状态
 */
export enum SyncMode {
    /**
     * 同步中
     */
    Syncing,

    /**
     * 同步完成
     */
    Synced,

    /**
     * 未同步
     */
    UnSynced
}

/**
 * postMessage 消息类型
 */
export enum Message {
    EditCSF,  // 文件定密

    SkipNoAuditorError,  // 设置密级跳过审核员密级不足的错误

    UpdateTag,       // 单个文件编辑标签后需要更新侧边栏的标签

    ExceptionStrategy,  // ExceptionStrategy异常提示

    AddTags,        // TagAdder添加标签，点击确定按钮将添加的标签传给TabBox
}

/**
 * 新建窗口
 * @param url 跳转链接
 * @param id 窗口id
 */
export function createWindow(url: string, { id, title }: { id?: string, title?: string } = {}) {
    return nw.Window.open(url, { width: 800, height: 600, title, show: true, always_on_top: true, resizable: true, id })
}


/**
 * 更新窗口大小
 * @param id 窗口id
 * @param size 窗口尺寸
 */
export function resizeWindow(id: string, { width, height }) {
    return put(`http://127.0.0.1:10080/window/${id}`, { width, height }, { sendAs: 'json', readAs: 'json' })
}


/**
 * 立即下载选中项
 * @param directory 当前所在目录
 * @param docs 选中的文件
 */
export function requestDownload({ directory = null, docs = [] }) {
    if (docs && docs.length) {
        docs.forEach((doc) => isDir(doc) ?
            requestDownloadDir({ relPath: doc.relPath }) :
            requestDownloadFile({ relPath: doc.relPath }))
    } else if (directory && directory.docid) {
        requestDownloadDir({ relPath: directory.relPath })
    }
}

/**
 * 是否显示下载提示框
 * @param id 
 * @param callback 
 */
export function showDownload(id: string, callback = noop) {
    requestDownload(id).then(callback)
}

/**
 * 获取所在目录的选中项，如果没有选中则返回所在目录
 * @param param0 
 */
export function getExplorerSelection({ directory = null, docs = [] }) {
    if (docs && docs.length) {
        return docs;
    } else if (directory) {
        return [directory]
    } else {
        return null;
    }
}

/**
 * 获取选中项对象
 * @param id 窗口id
 */
export async function getSelection(id: string) {
    return Promise.all([
        getLocalUserById({ userId: getOpenAPIConfig('userid') }),
        getSelectItemsById({ id })
    ]).then(([{ localUserConfig: { cachePath } }, { items, path }]) => {
        let relPath;

        if (items.length) {
            relPath = items.map(item => item.slice(cachePath.length + 1))
        } else {
            const currentPath = path.slice(cachePath.length + 1, -1);
            relPath = currentPath ? [currentPath] : [];
        }

        if (relPath && relPath.length) {
            return getInfoByPath({ relPath }).then(({ cacheInfo }) => {
                return zipWith(items, cacheInfo, (item, cache) => {
                    return assign({}, {
                        absPath: item,
                        relPath: item.slice(cachePath.length + 1) // cachePath不包含结尾 /，因此需要长度＋1
                    }, cache)
                })
            })
        } else {
            return []
        }
    })
}

/**
 * 获取父路径对象
 * @param id 窗口id
 */
export function getParent(id: string) {
    return Promise.all([
        getLocalUserById({ userId: getOpenAPIConfig('userid') }),
        getSelectItemsById({ id })
    ]).then(([{ localUserConfig: { cachePath } }, { items, path }]) => {
        return getInfoByPath({ relPath: [path.slice(cachePath.length + 1, -1)] }).then(({ cacheInfo }) => {
            return assign({}, {
                absPath: path,
                relPath: path.slice(cachePath.length + 1) // cachePath不包含结尾 /，因此需要长度＋1
            }, cacheInfo[0])

        })
    })
}

/**
 * 判断是否是root界面
 * @param id 窗口id
 */
export function isRoot(id: string) {
    return Promise.all([
        getLocalUserById({ userId: getOpenAPIConfig('userid') }),
        getSelectItemsById({ id })
    ]).then(([{ localUserConfig: { cachePath } }, { items, path }]) => {
        return Promise.resolve(cachePath.length + 1 === path.length ? 0 : path.substring(cachePath.length + 1).split('/').length - 1)
    })
}



/**
 * 轮询选中项
 * @param id 窗口id
 */
export function pullSelection(id: string, callback = noop) {
    return timer(() => Promise.all([getSelection(id), getParent(id)]).then(callback))
}

/**
 * 轮询同步详情
 */
export function pullSyncDetails(callback = noop) {
    return timer(() => Promise.all([
        getSyncDetailByInterval({ begin: 0, end: 50 }),
        getSyncLogByIdAndType({ logType: 0, logId: 0 }),
        getSyncLogByIdAndType({ logType: 1, logId: 0 }),
        getUnsyncLog({ absPath: '', countLimit: 200 }),
        getUnsyncLogNum({ absPath: '' })
    ]).then(callback))
}

/**
 * 轮询消息
 * @param id 窗口id
 */
export function getUnreadMessageCount(callback = noop) {
    return timer(throttleGetMessage(callback), 30000)
}

const throttleGetMessage = callback => throttle(() => Promise.all([
    getUnreadMsgNum(),
    getAuditMsgNum()
]).then(callback), 30000, {
        'trailing': false
    });

/**
 * 获取消息中心未读消息条数
 * @param unReadMsgNum 未读消息总数
 * @param isShare 首条未读消息是共享消息还是审核消息
 */
export function getUnreadMsgNum(): Promise<{ unReadMsgNum: number, isShare: boolean }> {
    return getUnread({ stamp: 0 }).then(res => {
        const unReadMsgs = filter(res.msgs, msg => !msg.isread)
        const isShare = (unReadMsgs && unReadMsgs[0]) ? unReadMsgs[0].type < 5 : true
        return { unReadMsgNum: unReadMsgs.length, isShare }
    })
}

/**
 * 判断首条未读消息是共享消息还是审核消息
 * @param callback 
 */
export function isShare(callback = noop) {
    getIsShare().then(callback)
}

export function getIsShare() {
    return getUnread({ stamp: 0 }).then(res => {
        const unReadMsgs = filter(res.msgs, msg => !msg.isread)
        return (unReadMsgs && unReadMsgs[0]) ? unReadMsgs[0].type < 5 : true
    })
}

/**
 * 获取审核管理待审核消息条数
 * @param unReadAuditNum 未读审核消息
 * @param isPending 首条未读消息是权限审核还是流程审核
 */
export function getAuditMsgNum(): Promise<{ unReadAuditNum: number, isPending: boolean }> {
    return Promise.all([getPendingApprovals({}), getApplys({})]).then(([{ applyinfos: pendingApprovals }, { applyinfos: docsApprovals }]) => {
        let isPending = (pendingApprovals.length && docsApprovals.length) ? pendingApprovals[0].createdate >= docsApprovals[0].createdate :
            !pendingApprovals.length && docsApprovals.length ? false : true
        return { unReadAuditNum: pendingApprovals.length + docsApprovals.length, isPending }
    })
}

/**
 * 判断首条未读消息是权限审核还是流程审核
 * @param callback 
 */
export function isPending(callback = noop) {
    getIsPending().then(callback)
}

export function getIsPending() {
    return Promise.all([getPendingApprovals({}), getDocApprovals({})]).then(([{ applyinfos: pendingApprovals }, { applyinfos: docsApprovals }]) => {
        return (pendingApprovals.length && docsApprovals.length) ? pendingApprovals[0].createdate > docsApprovals[0].createdate :
            !pendingApprovals.length && docsApprovals.length ? false : true
    })
}

/**
 * 打开文件所在位置
 * @param id 窗口id
 */
export async function openDir(doc) {
    const { namepath } = await convertPath({ docid: doc.docid });
    let parentPath = namepath.split('/').slice(0, namepath.split('/').length - 1).join('/');

    return defaultExecute({ url: await getConfig('internal_link_prefix') + parentPath });
}

/**
 * 预览搜索文件
 * @param path 内链路径+文件名
 */
export async function previewFile(doc) {
    const [
        { namepath },
        prefix
    ] = await Promise.all([
        convertPath({ docid: doc.docid }),
        getConfig('internal_link_prefix')
    ]);

    return defaultExecute({ url: prefix + namepath })
}

/**
 * 广播事件
 */
export function broadcastMessage(messageType, content?) {
    postMessage({ type: messageType, content })
}

export function reciveMessage(messageType, handler) {
    window.addEventListener('message', (e) => {
        if (messageType === e.data.message.type) {
            handler(e.data.message.content)
        }
    })
}

/**
 * 窗口通信
 */
export function postMessage(message: any) {
    return post(`/message`, { message, id: sessionStorage.getItem('id') }, { sendAs: 'json', readAs: 'json' })
}

/**
 * 下載版本
 * @param doc 文檔對象
 * @param doc.docid 文檔對象id
 * @param revision 版本對象
 * @param revision.rev 版本對象版本號
 * @param revision.name 版本對象文件名
 */
export async function downloadRevision({ docid }, { rev, name }) {
    location.assign(await getDownloadURL({ docid, rev, savename: name }))
}

/**
 * 将同步任务日志转化成doc对象
 * @param info 
 */
export function convertDocByInfo(info: Core.APIs.Client.Detail) {
    return {
        ...info,
        docname: info.relPath ? getDocNameByPath(info.relPath) : getDocNameByPath(info.absPath)
    }
}

/**
 * 根据path截取文件名
 * @param path 
 */
export function getDocNameByPath(path: string) {
    return path.slice(path.lastIndexOf('\\') + 1)
}