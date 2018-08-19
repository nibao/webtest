declare namespace Components {
    namespace MyFavorites {
        interface Props extends React.Props<any> {
            /**
             * 打开文件所在位置
             * @param doc 文档
             */
            doDirOpen?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

            /**
             * 预览文件
             * @param doc 文档
             */
            doFilePreview?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

            /**
             * 内链共享
             * @param doc 文档
             */
            doShare?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

            /**
             * 外链共享
             * @param doc 文档
             */
            doLinkShare?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

            /**
             * 下载
             *  @param doc 文档
             */
            doDownload?: (doc: Core.APIs.EFSHTTP.FavoritesInfo) => any;

            /**
             * 取消收藏成功后，通知调用父元素
             * @param doc 文档
             */
            onFavoriteCancel?: (doc) => any;

            /**
             * 收藏状态发生变化的文档id
             */
            favoritedDocid?: string;

            /**
             * 收藏状态发生改变的文档的当前收藏状态
             */
            favorited: boolean;

            /**
             * 打开窗口时触发
             */
            onOpenFavoritesDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseFavoritesDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 收藏列表数据
             */
            favoritesDocs: ReadonlyArray<Core.APIs.EFSHTTP.FavoritesInfo> | null;

            /**
             * 搜索结果
             */
            filterResults: ReadonlyArray<Core.APIs.EFSHTTP.FavoritesInfo>;

            /**
             * 用户在搜索框中输入的数据
             */
            searchKey: string;

            /**
             * 正在下载下载的文件
             */
            downloadDoc: Core.APIs.EFSHTTP.FavoritesInfo | null;

            /**
             * 选中的收藏文件列表
             */
            selections: Array<Core.APIs.EFSHTTP.FavoritesInfo>;

            /**
             * 右键菜单位置
             */
            contextMenuPosition: [number, number];

            /**
             * 是否展示右键菜单
             */
            showContextMenu: boolean;
        }
    }
}