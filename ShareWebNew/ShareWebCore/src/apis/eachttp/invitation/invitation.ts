import { eachttp } from '../../../openapi/openapi';

/**
 * 打开邀请链接
 */
export const open: Core.APIs.EACHTTP.Invitation.Open = function ({ docid }, options?) {
    return eachttp('invitation', 'open', { docid }, options)
}

/**
 * 设置共享邀请基本信息
 */
export const setBaseInfo: Core.APIs.EACHTTP.Invitation.SetBaseInfo = function ({ docid, invitationendtime, perm, permendtime }, options?) {
    return eachttp('invitation', 'setbaseinfo', { docid, invitationendtime, perm, permendtime }, options)
}

/**
 * 设置共享邀请备注信息
 */
export const setNoteInfo: Core.APIs.EACHTTP.Invitation.SetNoteInfo = function ({ docid, image, description }, options?) {
    return eachttp('invitation', 'setnoteinfo', { docid, image, description }, options)
}

/**
 * 根据文档id获取共享邀请基本信息
 */
export const getBaseInfoByDocId: Core.APIs.EACHTTP.Invitation.GetBaseInfoByDocId = function ({ docid }, options?) {
    return eachttp('invitation', 'getbaseinfobydocid', { docid }, options)
}

/**
 * 根据文档id获取图片备注信息
 */
export const getNoteInfoByDocId: Core.APIs.EACHTTP.Invitation.GetNoteInfoByDocId = function ({ docid }, options?) {
    return eachttp('invitation', 'getnoteinfobydocid', { docid }, options);
}

/**
 * 关闭共享邀请
 */
export const close: Core.APIs.EACHTTP.Invitation.Close = function ({ docid }, options?) {
    return eachttp('invitation', 'close', { docid }, options);
}

/**
 * 根据InvitationId 根据文档id获取共享邀请所有信息
 */
export const get: Core.APIs.EACHTTP.Invitation.Get = function ({ invitationid }, options?) {
    return eachttp('invitation', 'get', { invitationid }, { userid: null, tokenid: null })
}

/**
 * 加入群组
 */
export const join: Core.APIs.EACHTTP.Invitation.Join = function ({ invitationid }, options?) {
    return eachttp('invitation', 'join', { invitationid }, options)
}