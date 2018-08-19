import StorageOverView from "./component.view";

declare namespace Console {
    namespace StorageOverView {
        interface Props extends React.Props<void> {
            /**
             * 跳转到存储子系统
             */
            doStorageRedirect: () => void;

            /**
             * 跳转到服务器管理
             */
            doServerRedirect: () => void
        }

        interface State {
            /**
             * 存储池状态
             */
            storageStatus: number;

            /**
             * 存储服务信息
             */
            storagePool: Core.ECMSManager.ncTStoragePool,

            /**
             * 副本健康度
             */
            replicasHealth: number;


            /**
             * 编辑副本
             */
            editReplicas: number;

            /**
             * 显示编辑副本弹窗
             */
            showEditReplicas: boolean;

            /**
             * 重载均均衡提示
             */
            resetBalanceWarn: boolean;

            /**
            * 错误弹窗
            */
            error: {
                /**
                 * 后端返回的错误消息
                 */
                errorInfo: any;

                /**
                 * 错误原因
                 */
                errorReason: number;
            } | null;

            /**
             * 正在重置副本健康度
             */
            resetingBalance: boolean;

            /**
             * 正在更改副本模式
             */
            changingStorageModel: boolean;
        }


    }
}