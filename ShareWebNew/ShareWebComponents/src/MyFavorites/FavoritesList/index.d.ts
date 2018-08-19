declare namespace Components {
    namespace MyFavorites {
        namespace FavoritesList {
            interface Props extends React.Props<any> {
                /**
                 * 收藏列表数据
                 */
                docs?: ReadonlyArray<Core.APIs.EFSHTTP.FavoritesInfo>;

                /**
                 * 用户在搜索框中输入的数据
                 */
                searchKey: string;

                /**
                * 预览文件
                */
                doFilePreview?: (e, doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

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

                /**
                 * 选中的收藏文件列表
                 */
                selections: Array<Core.APIs.EFSHTTP.FavoritesInfo>;

                /**
                 * 选中项发生改变是通知父元素更新selections
                 */
                doSelectionChange?: (selections: Array<Core.APIs.EFSHTTP.FavoritesInfo>) => any;

                /**
                 * 右键时通知父元素打开右键菜单
                 */
                doContextMenu?: (e) => any;
            }
        }
    }
}