import { EACP } from '../thrift';


export const editDocLibrarySiteId: Core.EACP.EditDocLibrarySiteId = function ([docId, siteId]) {
    return EACP('EACP_EditDocLibrarySiteId', [docId, siteId]);
}

/**
 * 设置消息开关状态
 * @param msgNotifyStatus 
 */
export const setMessageNotifyStatus: Core.EACP.SetMessageNotifyStatus = function (msgNotifyStatus) {
    return EACP('EACP_SetMessageNotifyStatus', [msgNotifyStatus]);
}

/**
 * 获取消息开关
 */
export const getMessageNotifyStatus: Core.EACP.GetMessageNotifyStatus = function () {
    return EACP('EACP_GetMessageNotifyStatus');
}