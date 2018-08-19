declare namespace Components {
    namespace DatabaseSubsystem {

        type Props = {
            /**
             * 前去服务器管理添加数据库节点点击事件
             */
            doRedirectServers(): () => void;

            /**
             * 数据库模式弹窗关闭取消事件
             */
            onDataBaseModeCancel: () => void;
        }

        type State = {

            /**
             * 第三方数据库配置
             */
            externalDBInfo?: Readonly<Core.DatabaseSubsystem.ncTExternalDBInfo>,

            /**
             * 当前数据库配置为第三方
             */
            isExternalDB: boolean
        }
    }
}



