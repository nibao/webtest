declare namespace Components {
    namespace TagBox {
        interface Props extends React.Props<any> {
            /**
             * 选中的文件
             */
            docs: Core.Docs.Docs;

            /**
             * 标签
             */
            tags?: ReadonlyArray<string>;

            /**
             * 点击标签跳转
             */
            doJumpSearch?: (tag: string) => void;

            /**
             * 编辑标签接口
             */
            doEditTag?: (docs: ReadonlyArray<Core.Docs.Doc>) => any;

            /**
             * 新增标签接口
             */
            doAddTag?: (docs: ReadonlyArray<Core.Docs.Doc>) => any;
        }

        interface State {
            /**
             * 当前的状态，添加 or 编辑 or none
             */
            status: number;

            /**
             * 是否显示编辑标签dialog
             */
            showEditDialog: boolean;

            /**
             * 当选中一个文件时，需要显示的标签
             */
            tags: ReadonlyArray<string>;

            /**
             * 是否显示标签添加dialog
             */
            showAdderDialog: boolean;
        }
    }
}