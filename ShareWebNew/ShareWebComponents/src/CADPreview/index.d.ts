declare namespace Components {
    namespace CADPreview {
        interface Props extends React.Props<any> {
            /**
             * 文档对象
             */
            doc?: Core.Docs.Doc;

            /**
             * 外链预览
             */
            link?: APIs.EFSHTTP.Link.Get;

            /**
             * 是否非法内容隔离区文件
             */
            illegalContentQuarantine?: boolean;

            /**
             * 全屏/非全屏状态, true--全屏; false--非全屏
             */
            fullScreen: boolean;

            /**
             * 是否跳过下载权限检查(权限审核和流程审核需要跳过下载权限检查，直接显示下载按钮)
             */
            skipPermissionCheck: boolean;

            /**
             * 全屏/退出全屏操作
             */
            onRequestFullScreen: (fullScreen: boolean) => any;

            /**
             * 错误处理
             */
            onCADPreviewError: (errcode: number) => any;

            /**
             * 下载
             */
            doDownload?: (doc: Core.Docs.Doc) => void;
        }

        interface State {
            /**
             * 背景颜色，黑色 or 白色
             */
            theme: 'dark' | 'light';

            /**
             * 工具栏是否显示
             */
            showBottomTool: boolean;

            /**
             * 小图(flash插件)还是大图(大图插件)预览
             */
            previewType: number;

            /**
             * 控制下载组件Download的显示
             */
            downloading: boolean;
        }
    }
}