import { eachttp } from '../../../openapi/openapi';

/**
 * 外链发送邮件
 */
export const sendMail: Core.APIs.EACHTTP.Message.SendMail = function ({ mailto, subject, content }, options?) {
    return eachttp('message', 'sendmail', { mailto, subject, content }, options);
}

/**
 * 获取消息通知
 */
export const get: Core.APIs.EACHTTP.Message.GetMessage = function ({ stamp }, options?) {
    return eachttp('message', 'get', { stamp }, options);
}

/**
 * 确认消息已读
 */
export const read2: Core.APIs.EACHTTP.Message.Read2 = function ({ msgids }, options?) {
    return eachttp('message', 'read2', { msgids }, options);
}