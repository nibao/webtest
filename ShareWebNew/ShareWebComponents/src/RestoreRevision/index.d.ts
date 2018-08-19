declare namespace Components {
    namespace RestoreRevisions {
        interface Props extends React.Props<any> {

            /**
             * 文档
             */
            doc: Core.Docs.Doc;

            /**
             * 版本对象
             */
            revision: any;

            /**
             * 确认错误
             */
            onConfirmError?: () => any;

            /**
             * 取消还原触发
             */
            onRevisionRestoreCancel?: () => any;

            /**
             * 取消还原触发
             */
            onRevisionRestoreSuccess?: (doc, revision) => any;

            /**
            * 打开窗口时触发
            */
            onOpenRestoreRevisionDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseRestoreRevisionDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {

            /**
             * 错误码
             */
            errorCode: number,

            /**
             * 是否显示错误弹窗
             */
            showError: boolean;

            /**
             * 还原历史版本的时候，自动重命名的新名字
             */
            restoreNewName: string;
        }
    }
}