/**
 * visitor类型
 */
export enum VisitorTypes {
    USER,         // 用户
    DEPARTMENT,   // 部门
    GROUP         // 组
}

/**
 * user department group 对应的id名称
 */
export const idNames = {
    [VisitorTypes.USER]: 'userid',
    [VisitorTypes.DEPARTMENT]: 'depid',
    [VisitorTypes.GROUP]: 'groupid'
}