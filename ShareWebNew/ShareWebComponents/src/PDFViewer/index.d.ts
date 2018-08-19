declare namespace Components {
    namespace PDFViewer {
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
             * pdf加载进度处理
             */
            onPropgress: Function;

            /**
             * 是否全屏
             */
            fullScreen: boolean;

            /**
             * 请求全屏/退出全屏回调
             */
            onRequestFullScreen: Function;

            /**
             * 预览错误处理
             */
            onError: Function;
        }

        interface State {

            /**
             * 文档加载状态
             */
            status: number;

            /**
             * 文档转换后的pdf对象
             */
            pdf: any;

            /**
             * 水印生成函数
             */
            watermark: Function;

            /**
             * 缩放大小，默认100%
             */
            scaleRate: number;

            /**
             * 当前页面，默认第一页
             */
            pageNumber: number;

            /**
             * 总页数,默认0页
             */
            totalPage: number;

            /**
             * 是否全屏
             */
            fullScreen: boolean;

            /**
             * 页面向上滚动距离
             */
            scrollViewTop: number;

            /**
             * 页面向左滚动距离
             */
            scrollViewLeft: number;

            /**
             * 文档预览区域高度
             */
            scrollViewHeight: number;

            /**
             * 文档预览区域宽度
             */
            scrollViewWidth: number;

            /**
             * 预览模式（放映模式or连续模式）
             * "ContinuousMode" or "Show"
             */
            mode: string;

            /**
             * 页面原始大小
             * {width: 0,height: 0}
             */
            initialSize: object;

            /**
             * 当前预览总页数
             */
            pages: Array<object>;

            /**
             * toolbar是否显示
             */
            toolbar: boolean;

            /**
             * 缩放比例气泡是否显示
             */
            scaleTip: boolean;
        }
    }
}