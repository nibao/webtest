declare namespace Components {
    namespace Server {
        namespace NodeConfig {
            namespace ProgressDialog {
                interface Props extends React.Props<void> {
                    /**
                     * 当前操作的节点
                     */
                    node: any;

                    /**
                     * 进程中的请求名称
                     */
                    requestInProgress: string;
                }
            }
        }
    }
}