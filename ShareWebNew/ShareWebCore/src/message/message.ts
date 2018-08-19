import { get, read2 } from '../apis/eachttp/message/message';
import { map, assign } from 'lodash';
/**
 * 消息类型
 */
export enum Type {
    // 开启共享
    OpenShare = 1,

    // 关闭共享
    CloseShare = 2,

    // 设置所有者
    SetOwner = 3,

    // 取消所有者
    CancelOwner = 4,

    // 开启共享申请
    OpenShareApply = 5,

    // 关闭共享申请
    CloseShareApply = 6,

    // 设置所有者申请
    SetOwnerApply = 7,

    // 取消所有者申请
    CancelOwnerApply = 8,

    // 开启外链申请
    OpenLinkApply = 9,

    // 开启共享审核结果
    OpenShareAuditResult = 10,

    // 关闭共享审核结果
    CloseShareAuditResult = 11,

    // 开启所有者审核结果
    OpenOwnerAuditResult = 12,

    // 关闭所有者审核结果
    CloseOwnerAuditResult = 13,

    // 开启外链审核结果
    OpenLinkAuditResult = 14,

    // 待审流程消息
    PendingProcessMessage = 15,

    // 流程进度消息
    ProcessProgressMessage = 16,

    // 流程结果消息
    ProcessResultMessage = 17,

    // 鲁格普通消息
    SimpleMessage = 18,

    // 提交密级申请消息
    PendingEditCsfApply = 19,

    // 密级申请审核结果
    EditCsfAuditResult = 20,

    // 非法文件隔离消息
    IllegalFileIsolated = 21,

    // 非法文件还原消息
    IllegalFileRestored = 22,

    // 杀毒推送消息
    AntivirusMessage = 23
}

/**
 * 杀毒消息操作类型
 */
export enum AntiVirusOperation {
    // 隔离
    Isolated = 1,

    // 修复
    Repaired = 2

}


let Messages = []; // 消息列表
let Handlers = []; // 订阅回调列表

/**
 * 消息类型
 * @export
 * @enum {number}
 */
export enum MessageType {
    All,
    Share,
    Check,
    Security,
}
/**
 * 消息筛选
 */
export enum MsgStatus {
    // 全部消息
    All = 1,
    // 未读消息
    Unread = 2,
    // 已读消息
    Read = 3
}
/**
 * 请求所有消息
 * @export
 */
export async function fetchMessages() {
    const { msgs } = await get({ stamp: 0 });
    Messages = [...msgs].reverse();
    Handlers.forEach(handler => {
        handler.call(null, Messages)
    })
}



/**
 * 根据传入的消息类型和状态返回消息列表，默认返回所有消息
 * @export 
 * @param {number} [type=MessageType.All] 消息类型  
 * @param {boolean} [isread] 消息是否已读 true-已读 false-未读 （可选，不传返回该消息类型所有消息）
 * @returns 
 */
export function getMessages(type = MessageType.All, isread?: boolean) {
    switch (type) {
        case MessageType.All:
            return Messages.filter(item => isread === undefined ? true : (item.isread === isread))
        case MessageType.Share:
            return Messages.filter(item => item.type < 5 && (isread === undefined ? true : (item.isread === isread)))
        case MessageType.Check:
            return Messages.filter(item => (item.type > 4 && item.type < 21 && item.type !== 18) && (isread === undefined ? true : (item.isread === isread)))
        case MessageType.Security:
            return Messages.filter(item => (item.type > 20 || item.type === 18) && (isread === undefined ? true : (item.isread === isread)))
        default:
            return Messages.filter(item => isread === undefined ? true : (item.isread === isread))
    }
}

/**
 * 订阅消息，返回取消订阅方法
 * @export
 * @param {any} callback 订阅回调函数
 * @returns 
 */
export function subscribe(callback) {
    Handlers = [...Handlers, callback]
    return function unsubscribe() {
        Handlers = Handlers.filter(handler => handler !== callback)
    }
}


/**
 * 设置已读，更新消息列表
 * @export
 * @param {any} msgs 
 */
export async function setRead(msgs) {
    const msgIdlist = msgs.length === undefined ? [msgs.id] : msgs.map(msg => msg.id);
    await read2({ 'msgids': msgIdlist });
    Messages = Messages.map((msg) => msgIdlist.indexOf(msg.id) === -1 ? msg : { ...msg, isread: true });
    Handlers.forEach(handler => {
        handler.call(null, Messages)
    })
}

