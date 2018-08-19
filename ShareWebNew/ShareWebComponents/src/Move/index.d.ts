declare namespace Components {
    namespace Move {
        interface Props extends React.Props<any> {
            /**
             * 需要移动的文件
             */
            docs: Core.Docs.Docs;

            /**
             * 顶级视图选择范围
             */
            selectRange: ReadonlyArray<number>;

            /**
             * 规则排序
             */
            sort?: {
                /**
                 * 排序字段
                 */
                by: 'name';

                /**
                 * 排序顺序
                 */
                sort: 'asc' | 'desc';
            }

            /**
             * 移动一个文件完成
             */
            onSingleMoveComplete: (doc) => void;

            /**
             * 开始移动
             */
            onStartMove: () => void;

            /**
             * 移动成功
             * @param result 移动结果
             * @param target 要移动的目标路径
             */
            onSuccess: (result: any, target: Core.Docs.Doc) => void;

            /**
             * 取消
             */
            onCancel: () => void;
        }

        interface State {
            /**
             * 要移动到的目标路径
             */
            selection?: any;

            /**
             * 是否显示‘移动到’对话框
             */
            showCopyToDialog: boolean;

            /**
             * 异常
             */
            exception?: number;

            /**
             * 当前正在操作的文件
             */
            processingDoc?: Core.Docs.Doc;

            /**
             * 是否显示‘正在移动，请稍后’转圈
             */
            showLoading: boolean;

            /**
             * 子文件被锁定的文件夹
             */
            lockedDir?: Core.Docs.Doc;
        }
    }
}