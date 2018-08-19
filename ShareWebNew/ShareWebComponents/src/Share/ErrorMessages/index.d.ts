declare namespace Components {
    namespace Share {
        namespace ErrorMessages {
            interface Props extends React.Props<any> {
                /**
                 * 点击“确定”按钮
                 */
                onConfirmError: () => void;

                /**
                 * 错误码
                 */
                errCode: number;

                /**
                 * 文档
                 */
                doc: Core.Docs.Doc;

                /**
                 * 最新的模板
                 */
                template: any;

                /**
                 * 对话框尺寸发生变化时触发
                 */
                onResize?: (size: { width: number | string, height: number | string }) => any;
            }
        }
    }
}