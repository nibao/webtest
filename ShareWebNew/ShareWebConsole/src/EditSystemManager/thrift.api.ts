import { SMTPGetAdminMailList, SMTPReceiverTest, login, editAdminAccount, setAdminMailList } from '../../core/thrift/sharemgnt/sharemgnt';
import { ECMSManagerClient, ShareMgntClient, createShareMgntClient } from '../../core/thrift2/thrift2';
import '../../gen-js/ShareMgnt_types';
import { post, head } from '../../util/http/http';
import { SystemType } from '../helper'


/**
 * 获取管理员邮箱
 */
export const SMTPGetAdminMails = (systemType: SystemType, adminId: string, appIp: string) => {
    if (systemType === SystemType.Console) {
        return SMTPGetAdminMailList([adminId])
    }
    else if (systemType === SystemType.Cluster) {
        return createShareMgntClient({ ip: appIp }).SMTP_GetAdminMailList(adminId)
    }
}

/**
 * 测试系统邮箱
 */
export const SMTPReceiverTests = (systemType: SystemType, mails: Array<string>, appIp: string) => {
    if (systemType === SystemType.Console) {
        return SMTPReceiverTest([mails])
    }
    else if (systemType === SystemType.Cluster) {
        return createShareMgntClient({ ip: appIp }).SMTP_ReceiverTest(mails)
    }

}

/**
 * 登录认证
 */
export const auth = async (systemType: SystemType, userName: string, password: string, appIp: string, loginOption: any, authType?) => {

    if (systemType === SystemType.Console) {
        return login([userName, password, 1, loginOption])
    }
    else if (systemType === SystemType.Cluster) {
        const clientIp = (await head('/meta')).getResponseHeader('x-client-addr');
        return createShareMgntClient({ ip: appIp }).Usrm_Login(userName, password, authType || 1, new ncTUserLoginOption({ loginIp: clientIp }))
    }
}

/**
 * 编辑内置管理员账号
 */
export const editAccount = (systemType: SystemType, adminId: string, Account: string, appIp: string) => {
    if (systemType === SystemType.Console) {
        return editAdminAccount([adminId, Account])
    }
    else if (systemType === SystemType.Cluster) {
        return createShareMgntClient({ ip: appIp }).Usrm_EditAdminAccount(adminId, Account)
    }
}

/**
 * 设置管理员邮箱
 */
export const setAdminMailsList = (systemType: SystemType, adminId: string, mails: Array<string>, appIp: string) => {
    if (systemType === SystemType.Console) {
        return setAdminMailList([adminId, mails])
    }
    else if (systemType === SystemType.Cluster) {
        return createShareMgntClient({ ip: appIp }).SMTP_SetAdminMailList(adminId, mails)
    }
}


