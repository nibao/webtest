declare namespace Components {
    namespace Reycycle {
        namespace RecycleBin {
            interface Props extends React.Props<any> {

                /**
                 * 入口文档对象数组
                 */
                entryDocs: Core.Docs.Docs;

                /**
                 * 回收站文档对象数组
                 */
                listDocs: Core.Docs.Docs;

                /**
                 * 选中的入口文档对象数组
                 */
                entrySelections: Core.Docs.Docs;

                /**
                 * 选中的回收站文档对象数组
                 */
                listSelections: Core.Docs.Docs;

                /**
                 * 待进行操作的文档对象
                 */
                operationObj: { docs: Core.Docs.Docs, type: number };

                /**
                 * 地址栏DOCID
                 */
                historyDoc: { docid: string };

                /**
                 * 点击查看大小按钮
                 */
                handleClickOperationBtn: (operationObj: { docs: Core.Docs.Docs, type: number }) => void;

                /**
                 * 入口文档条件变更
                 */
                handleIsEntry: (isEntry: boolean) => void;

                /**
                 * 入口文档对象变化
                 */
                handleEntryDocsChange: (docs: Core.Docs.Docs) => void;

                /**
                 * 回收站文档对象变化
                 */
                handleListDocsChange: (docs: Core.Docs.Docs) => void;

                /**
                 * 入口文档选中项变化
                 */
                handleEntrySelectionChange: (selection: Core.Docs.Docs) => void;

                /**
                 * 回收站文档选中项变化
                 */
                handleListSelectionChange: (selection: Core.Docs.Docs) => void;

                /**
                 * 路径发生变化
                 */
                handlePathChange: (doc: Core.Docs.Docs, sort: string, by: string) => void;



            }
            interface State {

                /**
                 * 是否处于加载中
                 */
                isLoading: boolean;

                /**
                 * 是否处于入口文档处
                 */
                isEntry: boolean;

                /**
                 * 入口文档对象数组
                 */
                entryDocs: Array<object>;

                /**
                 * 回收站文档对象数组
                 */
                listDocs: Array<object>;

                /**
                 * 选中的入口文档对象数组
                 */
                entrySelections: Array<object>;

                /**
                 * 选中的回收站文档对象数组
                 */
                listSelections: Array<object>;

                /**
                 * 已保存的搜索关键词
                 */
                searchKeys: Array<any>;

                /**
                 * 当前搜索框值
                 */
                searchValue: string;

                /**
                 * 是否显示排序菜单
                 */
                isSortSelected: boolean;

                /**
                 * 排序按钮锚点
                 */
                sortAnchor: object;

                /**
                 * 排序标准：time | name | size | type
                 */
                sortBy: string;

                /**
                 * 正向或逆向排序： asc | desc
                 */
                sortOrder: string;

                /**
                 * 待进行操作的文档对象
                 */
                operationObj: { docs: Core.Docs.Docs, type: number };

                /**
                 * 鼠标右击时的锚点
                 */
                mouseAnchor: Array<number>;

                /**
                 * 是否显示右键菜单
                 */
                isContextMenu: boolean;

                /**
                 * 搜索框锚点
                 */
                searchAnchor: object;

                /**
                 * 是否显示搜索下拉菜单
                 */
                isSearchMenu: boolean;

                /**
                 * 是否显示搜索见过为空字段
                 */
                isSearchEmpty: boolean;

                /**
                 * 回收站策略天数
                 */
                duration: number;

                /**
                 * 服务端时间
                 */
                servertime: number;

                /**
                 * 搜索框聚焦状态
                 */
                searchFocusStatus: boolean;

                /**
                 * 路径
                 */
                path: string;

                /**
                 * 懒加载
                 */
                lazyLoad: boolean;

                /**
                 * 列举目录错误
                 */
                listErrors: Array<any>;

                /**
                 * 确认列举目录错误事件
                 */
                confirmError: () => void;

            }
        }

    }
}