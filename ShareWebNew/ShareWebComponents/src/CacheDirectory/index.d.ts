declare namespace Components {
    namespace CacheDirectory {
        interface Props extends React.Props<any> {
            /**
             * 缓存目录
             */
            directory: Core.Docs.Doc;

            /**
             * 确定缓存
             * @param 确定缓存的文档对象
             */
            onConfirmCacheDirectory: (directory: Core.Docs.Doc) => any;

            /**
             * 取消缓存
             */
            onCancelCacheDirectory: () => any;

            /**
            * 打开窗口时触发
            */
            onOpenCacheDirectoryDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseCacheDirectoryDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }
    }
}