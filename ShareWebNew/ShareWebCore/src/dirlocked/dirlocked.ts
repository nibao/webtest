/**
 * 子文件被锁定的文件夹的策略
 */
export enum DirLockedStrategy {
    None,   // 询问

    Cancel,  // 取消

    Continue,  // 继续
}