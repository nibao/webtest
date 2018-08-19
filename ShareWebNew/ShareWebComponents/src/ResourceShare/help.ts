/**
* 选择要保存到的地点
*/
export enum SelectTargetType {
    SHARE_TO_SELF,      // 保存资源到个人工作室
    SHARE_TO_CLASS, // 保存资源到个人班级
    SHARE_TO_RESOUCRE_CENTER, // 保存资源到资源中心
}

/**
 * 选择目录类型
 */
export enum SelectUnitType {
    DIR, // 目录
    FILE, // 文件
}

/**
* 提示
*/
export enum ShareTip {
    DISABLED,      // 不显示提示信息
    LARGEFILE, // 文件过大分享时间过长提示
    SUCCESS, // 显示分享成功提示信息
    ERROR, // 显示分享失败提示信息
}
