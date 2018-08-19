declare namespace Components {
    namespace Delete {
        interface Props extends React.Props<any> {
            /**
             * 被删除的文件数组
             */
            docs: Core.Docs.Docs | null;

            /**
             * 删除单个成功
             */
            onSingleSuccess(item: any): void;

            /**
             * 开始删除
             */
            onStartDelete: () => void;

            /**
             * 删除成功
             */
            onSuccess: () => void;

            /**
             * 取消删除
             */
            onCancel: () => void;
        }

        interface State {
            /**
             * 是否显示删除文件对话框
             */
            deleteShow: boolean;

            /**
             * 是否显示删除进度弹框
             */
            progressDialogShow: boolean;

            /**
             * 错误码
             */
            errorCode?: number;

            /**
             * 出错的文件
             */
            doc?: Core.Docs.Doc;

            /**
             * 子文件被锁定的文件夹
             */
            lockedDir?: Core.Docs.Doc;
        }
    }
}