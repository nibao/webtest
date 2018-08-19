declare namespace Components {
    namespace MyFavorites {
        namespace ContextMenu {
            interface Props extends React.Props<any> {
                /**
                 * 选中的收藏文件列表
                 */
                selections?: Array<Core.APIs.EFSHTTP.FavoritesInfo>;

                /**
                 * 打开右键菜单
                 */
                open?: boolean;

                /**
                 * 右键菜单位置
                 */
                position?: [number, number];

                /**
                 * 通知父元素关闭右键菜单
                 */
                onRequestClose?: () => any

                /**
                * 打开文件所在位置
                */
                doDirOpen?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

                /**
                 * 处理取消收藏事件
                 */
                onFavoriteCancel?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any,

                /**
                 * 处理内链共享事件
                 */
                doShare?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any,

                /**
                 * 处理外链共享事件
                 */
                doLinkShare?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

                /**
                 * 处理下载事件
                 */
                doDownload?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;
            }
        }
    }
}