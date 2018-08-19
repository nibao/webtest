declare namespace Components {
    namespace SyncDetails {
        interface Props extends React.Props<any> {
            onCloseDialog?(): any;

            /**
             * 同步状态
             */
            defaultActiveView: number;

            /**
            * 打开窗口时触发
            */
            onOpenSyncDetailsDialog?: (nwwindow) => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {

            /**
             * 正在同步数据 
             */
            detail: Array<Core.APIs.Client.SyncingDetail>,

            /**
             * 正在同步总任务数 
             */
            total: number,

            /** 
             * 同步完成数据
             */
            completedSyncs: Array<Core.APIs.Client.Detail>,

            /** 
             * 同步完成总数 
             */
            completedNum: number,

            /** 
             * 同步失败数据 
             */
            failedSyncs: Array<Core.APIs.Client.Detail>,

            /** 
             * 同步失败总数 
             */
            failedNum: number,

            /** 未同步文档数据 */
            unSyncs: Array<Core.APIs.Client.UnsyncInfo>;

            /** 
             * 未同步文档总数 
             */
            unSyncsNum: number;

            /** 
             * 处罚选择本地文件夹 
             */
            isSelectDir: boolean;

            /** 
             * 当前待转移的绝对路径 
             */
            currentAbsPath: Array<string>;

            /**
             * 取消任务的id
             */
            cancelTaskId: string;

            /**
             * 取消所有任务
             */
            cancelAllTask: boolean;
        }

    }
}