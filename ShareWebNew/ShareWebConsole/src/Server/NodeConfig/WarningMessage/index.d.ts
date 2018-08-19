declare namespace Components {
    namespace Server {
        namespace NodeConfig {
            namespace WarnginMessage {
                interface Props extends React.Props<void> {
                    /**
                     * 操作
                     */
                    operations: {
                        cancelHaMaster: boolean;
                        cancelHaSlave: boolean;
                        cancelDbSlave: boolean;
                        cancelIndex: boolean;
                    }

                    /**
                     * 确定事件
                     */
                    onMessageConfirm: () => void;

                    /**
                     * 取消事件
                     */
                    onMessageCancel: () => void;

                    /**
                     * 卸载索引节点删除索引目录选择事件
                     */
                    onUnInstallIndexChange: (checked: boolean) => void;
                }
            }
        }
    }
}