declare namespace Components {
    /**
     * 查看文件信息，包含历史版本/自定义属性/文件评论等各种详情
     */
    namespace DocsInfo {
        interface Props extends React.Props<any> {
            /**
             * 文档数组
             */
            docs: ReadonlyArray<Core.Docs.Doc>;

            /**
             * 查看文件大小
             */
            doViewSize?: (doc: Core.Docs.Doc) => any;

            /**
             * 编辑标签
             */
            doEditTag?: (doc: Core.Docs.Doc) => any;

            /**
             * 新建标签
             */
            doAddTag?: (doc: Core.Docs.Doc) => any;

            /**
             * 查看版本接口
             */
            doRevisionView?: (doc: Core.Docs.Doc, revision) => any;

            /**
             * 还原版本接口
             */
            doRevisionRestore?: (doc: Core.Docs.Doc, revision) => any;

            /**
             * 抛出标签点击事件
             */
            doJumpSearch?: (tag: string) => any;

            /** 
             * 文档是否被收藏
             */
            favorited: boolean;

            /**
             * 添加或取消收藏触发事件
             * @param docs 文档
             * @param favorited 收藏状态
             */
            onFavoriteChange: (docs: ReadonlyArray<Core.Docs.Doc>, favorited: boolean) => any
        }
    }
}