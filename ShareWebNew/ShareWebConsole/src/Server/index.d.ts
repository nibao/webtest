declare namespace Components {
    namespace Server {
        interface Props extends React.Props<void> {
            /**
             * 更新节点配置事件
             */
            onUpdateNodeConfig: () => void;
        }

        interface State {
            /**
             * 站点内全部节点的信息
             */
            nodesInfo: ReadonlyArray<Core.ECMSManager.ncTNodeInfo>;

            /**
             * 站点内全部高可用节点信息
             */
            haNodes: ReadonlyArray<Core.ECMSManager.ncTHaNodeInfo>;

            /**
             * 站点内全部应用节点信息
             */
            appNodes: ReadonlyArray<Core.ECMSManager.ncTAppNodeInfo>;

            /**
             * 站点内全部存储节点信息
             */
            storNodes: ReadonlyArray<Core.ECMSManager.ncTStorageNodeInfo>;

            /**
             * 站点内全部数据库节点信息
             */
            dbNodes: ReadonlyArray<Core.ECMSManager.ncTDBNodeInfo>;

            /**
             * 站点内全部文档索引节点信息
             */
            indexNodes: ReadonlyArray<Core.ECMSManager.ncTNodeInfo>;

            /**
             * 站点内部所有节点完整信息
             */
            nodesCompleteInfo: Array<any>;

            /**
             * 是否处于等待状态
             */
            loading: boolean;

            /**
             * 显示节点配置弹窗(添加节点/配置角色)
             */
            showNodeConfig: boolean;

            /**
             * 出错信息
             */
            errorMessage: any;

            /**
             * 操作状态
             */
            opState: number;

            /**
             * 索引服务状态
             */
            indexServiceState: boolean;

            /**
             * 搜索关键字
             */
            searchKey: string;

            /**
             * 显示确认提示框
             */
            confirmOperation: boolean;
        }
    }
}