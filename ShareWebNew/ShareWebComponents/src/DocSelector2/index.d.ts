declare namespace Components {
    namespace DocSelector2 {
        interface Props extends React.Props<any> {
            /**
             * className
             */
            className?: string;

            /**
             * 工具栏按钮的描述
             */
            description: string;

            /**
             * 取消文件选择
             */
            onCancel: () => void;

            /**
             * 选择文件
             */
            onConfirm: (dest: Core.Docs.Doc) => void;
        }

        interface State {
            /**
             * 路径数组
             */
            crumbs: Core.Docs.Docs;

            /**
             * 选择项数组
             */
            selections: Core.Docs.Docs;

            /**
             * 加载中
             */
            loading: boolean;

            /**
             * 列举结果
             */
            list: {
                /**
                 * 列举结果的文件夹
                 */
                dirs: Core.Docs.Docs;

                /**
                 * 列举结果的文件
                 */
                files: Core.Docs.Docs;
            };

            /**
             * 状态为打开的分类视图数组
             */
            viewsOpen: Core.Docs.Docs;

            /**
             * 分类视图数组
             */
            viewsinfo: Core.Docs.Docs;
        }
    }
}