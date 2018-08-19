declare namespace Components {
    namespace RestoreRevision {
        namespace ErrorMessage {
            interface Props extends React.Props {
                /**
                 * 文件名
                 */
                name: string;

                /**
                 * 错误码
                 */
                errorCode: number;

                /**
                 * 锁定者名字
                 */
                locker?: string;

                /**
                 * 关闭窗口
                 */
                onConfirm: () => void;
            }
        }
    }
}