declare namespace Components {
    namespace PDFViewer {
        namespace Toolbar {
            interface Props extends React.Props<any> {
                /**
                 * 外层样式
                 */
                className?: string;

                /**
                 * 缩放回调
                 * @param scaleRate:缩放比例
                 */
                onScale: (scaleRate: number) => any;

                /**
                 * slider按住并开始拖动
                 * @param scaleRate:缩放比例
                 */
                onZoomStart: (scaleRate: number) => any;

                /**
                 * slider放开鼠标
                 * @param scaleRate:缩放比例
                 */
                onZoomEnd: (scaleRate?: number) => any;

                /**
                 * 请求全屏/退出全屏回调
                 */
                onRequestFullScreen: () => any;

                /**
                 * 是否全屏
                 */
                isFullScrren: boolean;

                /**
                 * 翻页回调
                 * @param page:页数
                 */
                onPage: (page: number) => any;

                /**
                 * 当前缩放大小，默认100
                 */
                scaleRate: number;

                /**
                 * 当前所在页
                 */
                pageNumber: number;

                /**
                 * 总页数
                 */
                totalPage: number;

                /**
                 * 鼠标移入
                 */
                onToolsMouseEnter: () => any;

                /**
                 * 移动移出
                 */
                onToolsMouseLeave: () => any;
            }

            interface State {
            }
        }
    }
}