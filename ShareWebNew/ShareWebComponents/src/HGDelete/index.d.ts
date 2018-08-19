declare namespace Components {
    namespace HGDelete {
        interface Props extends React.Props<any> {
            /**
             * 被删除的文件数组
             */
            docs: Core.Docs.Docs | null;

            /**
             * 删除单个成功
             */
            onSingleDeleteSuccess(item: any): void;

            /**
             * 删除成功
             */
            onDeleteSuccess: () => void;
        }

        interface State {
            /**
             * 是否显示删除文件对话框
             */
            showConfirm: boolean;

            /**
             * 是否显示“加载中”图标
             */
            processingDelete: boolean;

            /**
             * 错误码
             */
            errorCode?: number;

            /**
             * 出错的文件
             */
            failedDoc?: Core.Docs.Doc;

        }
    }
}