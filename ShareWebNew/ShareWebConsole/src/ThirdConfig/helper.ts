/**
 * 表单状态
 */
export enum FormStatus {
    //正常
    NORMAL,
    //认证服务ID为空
    ERR_MISSING_ID,
    //认证服务名称为空
    ERR_MISSING_NAME,
    //认证服务参数
    ERR_MISSING_CONFIG
    
};