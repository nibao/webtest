declare namespace Components {
    namespace Copy {
        interface Props extends React.Props<any> {
            /**
             * 需要复制的文件
             */
            docs: Core.Docs.Docs;

            /**
             * 复制一个文件完成
             */
            onSingleCopyComplete: (doc) => void;

            /**
            * 个人文档，共享文档，群组文档，文档库，归档库的选择控制
            */
            selectRange: Array<number>;

            /**
             * 对话框的标题
             */
            title?: string;

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
             * 复制完成
             * @param result 复制的结果
             * @param target 要复制到的目标路径
             */
            onSuccess: (result: any, target: Core.Docs.Doc) => void;

            /**
             * 取消
             */
            onCancel: () => void;
        }

        interface State {
            /**
             * 要复制到的目标路径
             */
            selection: any;

            /**
             * 是否显示‘复制到’对话框
             */
            showCopyToDialog: boolean;

            /**
             * 异常
             */
            exception: number;

            /**
             * 当前正在操作的文件
             */
            processingDoc: Core.Docs.Doc;

            /**
             * 是否显示‘正在复制，请稍后’转圈
             */
            showLoading: boolean;
        }
    }
}