declare namespace Components {
    namespace Recycle {
        namespace RecycleList {
            interface Props extends React.Props<any> {

                /**
                 * 回收站文档对象数组
                 */
                listDocs: Array<object>;

                /**
                 * 选中的回收站文档对象数组
                 */
                listSelections: Array<object>;

                /**
                 * 回收站策略天数
                 */
                duration: number;

                /**
                 * 服务端天数
                 */
                servertime: number;

                /**
                 * 是否正在加载
                 */
                isLoading: boolean;

                /**
                 * 是否搜索结果为空
                 */
                isSearchEmpty: boolean;

                /**
                 * 懒加载
                 */
                lazyLoad: boolean;

                /**
                 * 选中事件
                 */
                handleSelected: (selection: Object) => void;

                /**
                 * 右键菜单事件
                 */
                handleContextMenu: (e: React.MouseEvent<HTMLDivElement>, selection: Object, index: number) => void;

                /**
                 * 点击删除按钮事件
                 */
                handleClickDeleteRecycle: (e: React.MouseEvent<HTMLSpanElement>, selectDoc: Object) => void;

                /**
                 * 点击还原按钮事件
                 */
                handleClickRestoreRecycle: (e: React.MouseEvent<HTMLSpanElement>, selectDoc: Object) => void;

                /**
                 * 点击查看大小按钮事件
                 */
                handleClickViewSize: (e: React.MouseEvent<HTMLSpanElement>, selectDoc: Object) => void;


            }
        }
    }
}