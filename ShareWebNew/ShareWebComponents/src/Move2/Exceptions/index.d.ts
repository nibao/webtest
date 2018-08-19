declare namespace Components {
    namespace Move2 {
        namespace Exceptions {
            interface State {
                /**
                 * 事件数组
                 */
                events: ReadonlyArray<any>;

                /**
                 * 子文件被锁定的文件夹的提示窗口，为以后相同的冲突执行此操作，勾选状态
                 */
                checked: boolean;
            }
        }
    }
}