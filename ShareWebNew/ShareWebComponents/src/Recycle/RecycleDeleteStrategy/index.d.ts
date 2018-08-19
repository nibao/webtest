declare namespace Components {
    namespace Recycle {
        namespace RecycleDeleteStrategy {

            interface Props extends React.Props<any> {

                /**
                 * 文档对象
                 */
                docs: Array<Core.APIs.EFSHTTP.Doc>

                /**
                 * 是否是入口文档
                 */
                isEntry: boolean;

                /**
                 * 关闭回收站策略对话框
                 */
                onStrategyClose(goToEntry: boolean): void;
            }

            interface State {

                /**
                 * 选中的指定回收站删除时长
                 */
                durationSelection: number;

                /**
                 * 错误码
                 */
                errorCode: number;

                /**
                 * 选中项是否发生了变动
                 */
                isSelectionChange: boolean;


            }
        }
    }
}