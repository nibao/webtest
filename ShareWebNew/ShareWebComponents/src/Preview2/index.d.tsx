declare namespace Components {
    namespace Preview2 {
        interface Props extends React.Props<any> {
            /**
             * 外链预览
             */
            link?: APIs.EFSHTTP.Link.Get;

            /**
             * 文档对象预览，如果通过外链目录预览，则需要同时传递link与doc
             */
            doc?: Core.Docs.Doc;

            /**
             * 是否非法内容隔离区文件
             */
            illegalContentQuarantine?: boolean;

            /**
             * 是否允许收藏
             */
            enableCollect: boolean;

            /**
             * 是否允许编辑（OWA预览）
             */
            canEdit: boolean;

            onPathChange: Function;

            doDownload?: (doc) => any;

            doSaveTo?: (doc) => any;

            doInnerShareLink?: (doc) => any;

            doOuterShareLink?: (doc) => any;

            /**
             * 还原历史版本
             */
            doRevisionRestore?: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;

            /**
            * 打开窗口时触发
            */
            onOpenPreviewDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onClosePreviewDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };

            /**
             * 外链预览错误
             */
            onLinkError: (errcode: number) => void;
        }

        interface State {
            /**
             * 预览页面错误码
             */
            error: null | number;

            /**
             * 错误弹窗
             */
            errDialog: null | number;

            /**
             * 预览方式
             */
            previewMethod: null | number;

            /**
             * 文档是否已经收藏
             */
            favorited: boolean;

            /**
             * 是否展示转存按钮
             */
            saveToEnable: boolean;

            /**
             * 是否全屏
             */
            fullScreen: boolean;

            /**
             * 已加载的文档大小
             */
            loadedSize: number;

            /**
             * 转换后的文档总大小
             */
            totalSize: number;

            /**
             * 是否有下载权限
             */
            downloadEnable: boolean;

            /**
             * 是否打开转存组件
             */
            savingTo: boolean;

            /**
             * 是否打开内链共享（权限配置）
             */
            innerShare: boolean;

            /**
             * 是否打开外链共享
             */
            linkShare: boolean;

            /**
             * 是否已经登录
             */
            logedIn: boolean;


            avoidCopy: boolean;


            avoidPrint: boolean;

            doc: any;
        }
    }
}