declare namespace Components {
    namespace Recycle {
        namespace RecycleEntry {
            interface Props extends React.Props<any> {

                /**
                 * 回收站入口文档对象数组
                 */
                entryDocs: Array<object>;

                /**
                 * 选中的回收站入口文档对象数组
                 */
                entrySelections: Array<object>;

                /**
                 * 是否正在加载
                 */
                isLoading: boolean;

                /**
                 * 触发选中事件
                 */
                handleSelected: (selection: Object) => void;

                /**
                 * 触发点击事件
                 */
                handleClick: (docinfos: Object) => void;

                /**
                 * 触发双击事件
                 */
                handleDoubleClick: (e: React.MouseEvent<HTMLDivElement>, selection: Object, index: number) => void;

                /**
                 * 触发点击查看大小按钮事件
                 */
                handleClickViewSize: (e: React.MouseEvent<HTMLSpanElement>, selectDoc: Object) => void;
            }
        }
    }
}