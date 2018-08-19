/**
 * 弹出框类型
 */
export enum Status {

    // 没有弹窗
    NoPop,

    // 个人文档关闭
    NoUserDoc,

    // 正常弹窗
    Normal,

    // 名称已占用
    DuplicationName,

    // 创建群组失败
    FailToCreate,

    // 编辑群组失败
    FailToEdit,

    // 删除失败
    FailToDelete

}
