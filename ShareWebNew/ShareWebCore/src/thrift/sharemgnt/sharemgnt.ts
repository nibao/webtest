import { ShareMgnt } from '../thrift';

/**
 * 移动用户到部门
 * @param userIds 
 * @param srcDepartId 
 * @param destDepartId 
 */
export function moveUserToDepartment(userIds: Array<string>, srcDepartId: string, destDepartId: string): Promise<Array<string>> {
    return ShareMgnt('Usrm_MoveUserToDepartment', [userIds, srcDepartId, destDepartId]);
}

/**
 * 编辑用户站点
 * @param userId 
 * @param siteId 
 */
export function editUserSite(userId: string, siteId: string): Promise<void> {
    return ShareMgnt('Usrm_EditUserSite', [userId, siteId]);
}

/**
 *  移除用户
 * @param userIds 
 * @param departmentId 
 */
export function removeUserFromDepartment(userIds: Array<string>, departmentId: string): Promise<Array<string>> {
    return ShareMgnt('Usrm_RomoveUserFromDepartment', [userIds, departmentId]);
}

/**
 * 设置改密状态
 * @param status 
 */
export function setCsfLevelAuditStatus(status: boolean): Promise<void> {
    return ShareMgnt('SetCsfLevelAuditStatus', [status]);
}

/**
 * 获取改密状态
 */
export function getCsfLevelAuditStatus(): Promise<boolean> {
    return ShareMgnt('GetCsfLevelAuditStatus');
}

/**
 * 启用/者禁用用户
 * @param userId 用户id
 * @param status  true ： 启用， false：禁用
 */
export function setUserStatus(userId: string, status: boolean): Promise<void> {
    return ShareMgnt('Usrm_SetUserStatus', [userId, status])
}

/**
 * 用户自注册
 * @param registerId 注册号
 * @param certId 身份证号
 * @param realName 真实姓名
 * @param password 密码
 */
export function selfRegistration(registerId: string, certId: string, realName: string, password: string): Promise<string | object> {
    return ShareMgnt('Usrm_SelfRegistration', [registerId, certId, realName, password]);
}

/**
 * 获取部门的父部门
 * @param depart_id 当前部门id
 */
export function getDepartmentById(depart_id: string): Promise<Core.ShareMgnt.ncTUsrmDepartmentInfo> {
    return ShareMgnt('Usrm_GetDepartmentById', [depart_id])
}

/**
 * 设置用户冻结状态
 * @param userid 用户id
 * @param freezeStatus true: 冻结 false: 解冻 
 */
export function setUserFreezeStatus(userid: string, freezeStatus: boolean): Promise<void> {
    return ShareMgnt('Usrm_SetUserFreezeStatus', [userid, freezeStatus])
}

/**
 * 获取登录验证码配置信息
 */
export const getVcodeConfig: Core.ShareMgnt.GetVcodeConfig = function () {
    return ShareMgnt('Usrm_GetVcodeConfig')
}

/**
 * 设置登录验证码配置
 */
export const setVcodeConfig: Core.ShareMgnt.SetVcodeConfig = function ([vcodeconfig]) {
    return ShareMgnt('Usrm_SetVcodeConfig', [vcodeconfig])
}

/**
 * 验证码生成函数接口
 */
export const createVcodeInfo: Core.ShareMgnt.CreateVcodeInfo = function ([uuid]: [string]) {
    return ShareMgnt('Usrm_CreateVcodeInfo', [uuid])
}

/**
 * 获取日志导出加密开关状态
 */
export const getExportWithPassWordStatus: Core.ShareMgnt.GetExportWithPassWordStatus = function () {
    return ShareMgnt('GetExportWithPassWordStatus')
}

/**
 * 添加导出活跃日志文件任务
 * @param name 压缩包名称(log.zip)
 * @param pwd 压缩包密码
 * @param logCount EACPLog.GetLogCount 返回值中的 logCount
 */
export const exportActiveLog: Core.ShareMgnt.ExportActiveLog = function ([name, pwd, logCount, ncTExportLogParam]) {
    return ShareMgnt('ExportActiveLog', [name, pwd, logCount, { 'ncTExportLogParam': ncTExportLogParam }])
}


/**
 * 添加导出历史日志文件任务
 */
export const exportHistoryLog: Core.ShareMgnt.ExportHistoryLog = function ([id, validSeconds, pwd]) {
    return ShareMgnt('ExportHistoryLog', [id, validSeconds, pwd])
}

/**
 * 获取日志文件信息
 */
export const getCompressFileInfo: Core.ShareMgnt.GetCompressFileInfo = function ([taskId]) {
    return ShareMgnt('GetCompressFileInfo', [taskId])
}

/**
 * 获取日志打包进度
 */
export const getGenCompressFileStatus: Core.ShareMgnt.GetCompressFileInfo = function ([taskId]) {
    return ShareMgnt('GetGenCompressFileStatus', [taskId])
}

/**
 * 设置告警邮箱
 */
export const SMTPAlarmSetConfig: Core.ShareMgnt.SMTPAlarmSetConfig = function ([mails]) {
    return ShareMgnt('SMTP_Alarm_SetConfig', [mails])
}

/**
 * 获取告警邮箱
 */
export const SMTPAlarmGetConfig: Core.ShareMgnt.SMTPAlarmGetConfig = function () {
    return ShareMgnt('SMTP_Alarm_GetConfig')
}

/*
 * 获取管理员邮箱列表设置
 */
export const SMTPGetAdminMailList: Core.ShareMgnt.SMTPGetAdminMailList = function ([adminId]) {
    return ShareMgnt('SMTP_GetAdminMailList', [adminId])
}

/**
 * 测试邮箱是否正确
 */
export const SMTPReceiverTest: Core.ShareMgnt.SMTPReceiverTest = function ([mails]) {
    return ShareMgnt('SMTP_ReceiverTest', [mails])
}

/**
 * 认证登录
 */
export const login: Core.ShareMgnt.Login = function ([userName, password, authenType, ncTUserLoginOption]) {
    return ShareMgnt('Usrm_Login', [userName, password, authenType, { 'ncTUserLoginOption': ncTUserLoginOption }])
}

/**
 * 编辑内置管理员账号
 */
export const editAdminAccount: Core.ShareMgnt.EditAdminAccount = function ([adminId, Account]) {
    return ShareMgnt('Usrm_EditAdminAccount', [adminId, Account])
}

/**
 * 设置管理员邮箱
 */
export const setAdminMailList: Core.ShareMgnt.SetAdminMailList = function ([adminId, mailList]) {
    return ShareMgnt('SMTP_SetAdminMailList', [adminId, mailList])
}

/**
 * 获取所有文档审核员信息
 */
export const getAllAuditorInfos: Core.ShareMgnt.GetAllAuditorInfos = function () {
    return ShareMgnt('DocAuditm_GetAllAuditorInfos')
}

/**
 * 根据管理员id获取所有文档流程信息, admin获取所有
 */
export const getAllProcessInfo: Core.ShareMgnt.GetAllProcessInfo = function ([userId]) {
    return ShareMgnt('DocAuditm_GetAllProcessInfo', [userId])
}

/**
 * 搜索文档审核员信息
 */
export const searchAuditor: Core.ShareMgnt.SearchAuditor = function ([name]) {
    return ShareMgnt('DocAuditm_SearchAuditor', [name])
}

/**
 * 创建审核流程，返回流程唯一标识id
 */
export const createProcess: Core.ShareMgnt.CreateProcess = function ([docAuditInfo]) {
    return ShareMgnt('DocAuditm_CreateProcess', [{ 'ncTDocAuditInfo': docAuditInfo }])
}

/**
 * 编辑审核流程
 */
export const editProcess: Core.ShareMgnt.EditProcess = function ([editParam, editorId]) {
    return ShareMgnt('DocAuditm_EditProcess', [{ 'ncTDocAuditInfo': editParam }, editorId])
}

/**
 *  转换文档名称
 */
export const convertDocName: Core.ShareMgnt.ConvertDocName = function ([gns]) {
    return ShareMgnt('DocAuditm_ConvertDocName', [gns])
}


/**
 * 获取用户组织数据即树的根数据
 */
export const getDiskRootData: Core.ShareMgnt.GetDiskRootData = function ([userid]) {
    return ShareMgnt('Usrm_GetSupervisoryRootOrg', [userid])
}

/**
 * 获取组织用户列表
 */
export const getDepartmentUser: Core.ShareMgnt.GetDepartmentUser = function ([userid, start, end]) {
    return ShareMgnt('Usrm_GetDepartmentOfUsers', [userid, start, end])
}
/**
 * 获取所有用户
 */
export const getAllUser: Core.ShareMgnt.GetALlUser = function ([start, end]) {
    return ShareMgnt('Usrm_GetAllUsers', [start, end])
}

/**
 * 获取部门列表
 */
export const getSubDepartments: Core.ShareMgnt.GetSubDepartments = function ([usid]) {
    return ShareMgnt('Usrm_GetSubDepartments', [usid])
}

// /**
//  * 获取 EACP HTTPS 端口
//  */
// export const getEACPHttpsPort: Core.ShareMgnt.GetEACPHttpsPort = function () {
//     return ShareMgnt('GetEACPHttpsPort')
// }

// /**
//  * 获取 EFAST HTTPS 端口
//  */
// export const getEFASTHttpsPort: Core.ShareMgnt.GetEFASTHttpsPort = function () {
//     return ShareMgnt('GetEFASTHttpsPort')
// }
/**
 * 获取短信服务器配置
 */
export const getConfig: Core.ShareMgnt.SMSGetConfig = function ([]) {
    return ShareMgnt('SMS_GetConfig')
}

/**
 * 设置短信服务器配置
 */
export const setConfig: Core.ShareMgnt.SMSSetConfig = function ([config]) {
    return ShareMgnt('SMS_SetConfig', [config])
}

/**
 * 测试短信服务器
 */
export const test: Core.ShareMgnt.SMSTest = function ([config]) {
    return ShareMgnt('SMS_Test', [config])
}

/**
 * 获取月度活跃报表信息
 */
export const getActiveReportMonth: Core.ShareMgnt.GetActiveReportMonth = function ([inquireDate]) {
    return ShareMgnt('GetActiveReportMonth', [inquireDate]);
}

/**
 * 获取年度活跃报表信息
 */
export const getActiveReportYear: Core.ShareMgnt.GetActiveReportYear = function ([inquireDate]) {
    return ShareMgnt('GetActiveReportYear', [inquireDate])
}

/**
 * 创建月度活跃报表导出任务
 */
export const exportActiveReportMonth: Core.ShareMgnt.ExportActiveReportMonth = function ([name, inquireDate]) {
    return ShareMgnt('ExportActiveReportMonth', [name, inquireDate]);
}

/**
 * 创建年度活跃报表导出任务
 */
export const exportActiveReportYear: Core.ShareMgnt.ExportActiveReportYear = function ([name, inquireDate]) {
    return ShareMgnt('ExportActiveReportYear', [name, inquireDate])
}

/**
 * 获取存在活跃统计的最早时间
 */
export const opermGetEarliestTime: Core.ShareMgnt.OpermGetEarliestTime = function () {
    return ShareMgnt('Operm_GetEarliestTime');
}

/**
 *  获取生成活跃报表状态
 */
export const getGenActiveReportStatus: Core.ShareMgnt.GetGenActiveReportStatus = function ([taskId]) {
    return ShareMgnt('GetGenActiveReportStatus', [taskId])
}

/**
 * 获取运维助手开关
 */
export const getActiveReportNotifyStatus: Core.ShareMgnt.GetActiveReportNotifyStatus = function () {
    return ShareMgnt('GetActiveReportNotifyStatus');
}

/**
 * 设置运维助手开关
 */
export const setActiveReportNotifyStatus: Core.ShareMgnt.SetActiveReportNotifyStatus = function ([status]) {
    return ShareMgnt('SetActiveReportNotifyStatus', [status]);
}

/**
 * 获取指定部门下所有部门负责人信息
 */
export const usrmGetDepartResponsiblePerson: Core.ShareMgnt.UsrmGetDepartResponsiblePerson = function ([departId]) {
    return ShareMgnt('Usrm_GetDepartResponsiblePerson', [departId])
}

/**
 * 添加部门负责人
 */
export const usrmAddResponsiblePerson: Core.ShareMgnt.UsrmAddResponsiblePerson = function ([userId, departId]) {
    return ShareMgnt('Usrm_AddResponsiblePerson', [userId, departId])
}

/**
 * 设置限额
 */
export const usrmEditLimitSpace: Core.ShareMgnt.UsrmEditLimitSpace = function ([userId, limitUserSpace, limitDocSpace]) {
    return ShareMgnt('Usrm_EditLimitSpace', [userId, limitUserSpace, limitDocSpace]);
}

/**
 * 删除部门负责人
 */
export const usrmDeleteResponsiblePerson: Core.ShareMgnt.UsrmDeleteResponsiblePerson = function ([userId, departId]) {
    return ShareMgnt('Usrm_DeleteResponsiblePerson', [userId, departId])
}

/**
 * 获取个人文档状态
 */
export const usrmGetUserDocStatus: Core.ShareMgnt.UsrmGetUserDocStatus = function () {
    return ShareMgnt('Usrm_GetUserDocStatus');
}

/**
 * 获取个人文档大小
 */
export const usrmGetDefaulSpaceSize: Core.ShareMgnt.UsrmGetDefaulSpaceSize = function () {
    return ShareMgnt('Usrm_GetDefaulSpaceSize')
}

/**
 * 获取第三方组织根节点
 */
export const usrmGetThirdPartyRootNode: Core.ShareMgnt.UsrmGetThirdPartyRootNode = function () {
    return ShareMgnt('Usrm_GetThirdPartyRootNode')
}

/**
 * 展开第三方节点
 */
export const usrmExpandThirdPartyNode: Core.ShareMgnt.UsrmExpandThirdPartyNode = function ([thirdId]) {
    return ShareMgnt('Usrm_ExpandThirdPartyNode', [thirdId])
}

/**
 * 导入第三方组织结构和用户
 */
export const usrmImportThirdPartyOUs: Core.ShareMgnt.UsrmImportThirdPartyOUs = function ([ous, users, option, responsiblePersonId]) {
    return ShareMgnt('Usrm_ImportThirdPartyOUs', [ous, users, option, responsiblePersonId])
}

/**
 * 清除导入进度
 */
export const usrmClearImportProgress: Core.ShareMgnt.UsrmClearImportProgress = function () {
    return ShareMgnt('Usrm_ClearImportProgress');
}

/**
 * 获取导入进度
 */
export const usrmGetImportProgress: Core.ShareMgnt.UsrmGetImportProgress = function () {
    return ShareMgnt('Usrm_GetImportProgress')
}


