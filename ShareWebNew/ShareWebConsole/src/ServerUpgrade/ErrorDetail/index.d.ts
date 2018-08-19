declare namespace Console {
    namespace ServerUpgrade {
        namespace ErrorDetail {
            interface Props extends React.Props<any> {
                /**
                 * 节点信息
                 */
                node: any;

                /**
                 * 关闭窗口
                 */
                onClose: () => any;
            }
        }
    }
}