declare namespace Components {
    namespace Share {
        namespace SecretModeMessages {
            interface Props extends React.Props<any> {
                /**
                 * 点击“确定”按钮
                 */
                onConfirm: () => void;

                /**
                 * 点击“取消”按钮
                 */
                onCancel: () => void;

                /**
                 * 文档
                 */
                doc: Core.Docs.Doc;

                /**
                 * 文档密级
                 */
                csflevelText: string;

                /**
                 * 对话框尺寸发生变化时触发
                 */
                onResize?: (size: { width: number | string, height: number | string }) => any;
            }
        }
    }
}