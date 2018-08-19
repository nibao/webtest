/**
 * 检测docid是否是CID
 * @param docid
 * @returns {boolean}
 */
export function isCID(docid) {
    return docid.replace(/^gns:\/\//, '').split('/').length === 1;
};

export enum CsfStatus {
    // 无错误
    NORMAL,

    // 提交修改密级
    LOADING,

    // 选中多个文档库
    MULTI_SELECT_LIBRARIES,

    // 文件不存在
    GNS_NOT_EXIST = 404006
}
