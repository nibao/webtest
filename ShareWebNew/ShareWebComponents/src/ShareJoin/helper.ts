
/**
 * 
 */
export enum ReqStatus {
    // 初始状态
    PENDING,
    // 无异常
    OK,
    // 链接已失效
    EXPIRED = 404025,
    // 文档所有者不存在
    OWNEREXIST = 404026,
    // 文档不存在
    DOCSEXIST = 404024
}
