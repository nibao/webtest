import { last } from 'lodash'
import { buildSelectionText, SharePermissionOptions, LinkSharePermissionOptions } from '../../../core/permission/permission';
import { CSFSYSID } from '../../../core/csf/csf';
import __ from './locale'

/**
 * 根据消息对象构建文档对象
 * @export
 * @param {Components.Message2.AllMessage} msgs 
 * @returns {Components.Message2.MessageDoc} 
 */
export function buildDocFromMsg(msgs: Components.Message2.AllMessage): Components.Message2.MessageDoc {
    return msgs.reduce((docs, msg) => {
        let path = ['全部文档']

        if (msg.url) {
            path = [...path, ...msg.url.split('/')]
        }

        const parent = msg.gns.length > 38 ?
            {
                docid: msg.gns.slice(0, -33),
                name: path[path.length - 2],
                isdir: true
            } : null

        return {
            ...docs,
            [msg.id]: docs[msg.id] || {
                ...msg,
                docname: last(path),
                docid: msg.gns,
                path: path.slice(0, -1).join('/'),
                parent,
            }
        }
    }, {})
}


/**
 * 渲染权限
 * @export
 * @param {Components.Message2.AllMessage} msg 
 * @returns {string} 
 */
export function permissionInfo(msg: Components.Message2.AllMessage): string {
    if (msg.allowvalue || msg.denyvalue) {
        return buildSelectionText(SharePermissionOptions, { allow: msg.allowvalue, deny: msg.denyvalue });
    } else {
        return buildSelectionText(LinkSharePermissionOptions, { allow: msg.perm });
    }
}


/**
 * 渲染密级
 * @export
 * @param {number} csf 
 * @param {string} csfSysId 
 * @param {Array<string>} csfTextArray 
 * @returns {string}
 */
export function CSFInfo(csf: number, csfSysId: string, csfTextArray: Array<string>) {
    // 对接时代亿信标密系统
    if (csfSysId === CSFSYSID.SDYX) {
        return '---'
    } else {
        if (csf === 0) {
            return '---'
        } else {
            return csfTextArray[csf - 5]
        }
    }
}


/**
 * 审核模式
 */
export enum Audittype {
    // 同级审核
    One = 1,
    // 汇签审核
    All = 2,
    // 逐级审核
    Level = 3,
}

/**
 * 渲染审核模式
 * @param {number} audittype
 * @returns {string}
 * @memberof Message
 */
export function renderAudittype(audittype: number) {
    switch (audittype) {
        case Audittype.One:
            return __('同级审核')
        case Audittype.All:
            return __('汇签审核')
        case Audittype.Level:
            return __('逐级审核')
    }
}


/**
 * 给字符串中高亮关键字设置class,返回新的字符串
 * @param {string} str 原字符串
 * @param {ReadonlyArray<string>} key 替换关键词
 * @param {string} className styles[]对象包裹的className，不能直接使用原来的className，编译后会被改变
 * @returns {string} 替换后的字符串
 * @memberof Message
 * @example formatText(__('您发起的流程，已通过审核'), ['已通过', '已通過', 'approved'], styles['agree'])
 */
export function formatText(str: string, key: ReadonlyArray<string>, className: string) {
    for (let i = 0, len = key.length; i < len; i++) {
        if (str.indexOf(key[i]) !== -1) {
            return str.replace(key[i], `<span class=${className}>${key[i]}</span>`)
        }
    }
    return str;
}