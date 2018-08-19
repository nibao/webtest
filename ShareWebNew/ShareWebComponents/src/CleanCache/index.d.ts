declare namespace Components {
    namespace CleanCache {
        interface Props extends React.Props<any> {
            /**
             * 待清除文档对象
             */
            docs: ReadonlyArray<Core.Docs.Doc>;

            /**
             * 确定清除缓存
             * @param 确定清除缓存的文档对象
             */
            onConfirmClean: (docs: ReadonlyArray<Core.Docs.Doc>) => any;

            /**
             * 取消清除缓存
             */
            onCancelClean: () => any;

            /**
            * 打开窗口时触发
            */
            onOpenCleanCacheDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseCleanCacheDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }
    }
}