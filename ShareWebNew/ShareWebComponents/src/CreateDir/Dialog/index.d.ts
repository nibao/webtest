declare namespace Components {
    namespace CreateDir {
        namespace Dialog {
            interface State {
                /**
                 * 事件数组
                 */
                events: ReadonlyArray<any>;

                /**
                 * 输入框的值
                 */
                value: string;

                /**
                 * 前端检测的错误
                 */
                errCode: number;
            }
        }
    }
}