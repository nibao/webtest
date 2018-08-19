declare namespace Components {
    namespace RenameDialog {
        interface Props extends React.Props<any> {

            /**
             * 需要重命名的文档
             */
            doc: Core.Docs.Doc;

            /**
             * 重命名成功,返回新名称
             */
            onRenameSuccess(name: string): void;

            /**
             * 取消重命名
             */
            onCancelRename: () => void;

            /**
             * 重命名失败
             */
            onRenameFailed: () => void;

        }

        interface State {

            /**
             *  需要重命名的文档
             */
            doc: Core.Docs.Doc;

            /**
             * 重命名提示类型
             */
            renameTip: string;

            /**
             * 重命名值
             */
            renameValue: string;

            /**
             * 是否允许重命名
             */
            enableRename: boolean;

            /**
             * 选中文件名的下标 | 是否选中文件名
             */
            selectFoucs: [number] | [number, number] | boolean;

        }
    }
}