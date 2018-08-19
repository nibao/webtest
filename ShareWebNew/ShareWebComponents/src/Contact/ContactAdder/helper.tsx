/**
 * visitor类型
 */
export enum ContactTypes {
    USER,         // 用户
    DEPARTMENT,   // 部门
    GROUP         // 组
}

/**
 * user department group 对应的id名称
 */
export const idNames = {
    [ContactTypes.USER]: 'userid',
    [ContactTypes.DEPARTMENT]: 'depid',
    [ContactTypes.GROUP]: 'groupid'
}