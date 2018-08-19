declare namespace Components {
    namespace Favorite {

        interface Props extends React.Props<any> {
            /**
            * 选中的文件
            */
            doc: Core.Docs.Doc;

            /**
             * 添加或取消收藏触发事件
             * @param docs 文档
             * @param favorited 收藏状态
             */
            onFavoriteChange: (docs: ReadonlyArray<Core.Docs.Doc>, favorited: boolean) => any

            /** 
             * 文档是否被收藏
             */
            favorited: boolean;
        }

        interface State {
            /**
             * 文档是否被收藏
             */
            favorited: boolean;

            /**
             * 错误码
             */
            errorCode?: number;

            /**
            * 选中的文件
            */
            doc: Core.Docs.Doc;
        }
    }
}