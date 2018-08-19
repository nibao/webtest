declare namespace Components {
    namespace ShareApply {
        namespace ToolBar {
            interface Props extends React.Props<any> {
                /**
                 * 选择的权限申请类型（全部申请/未审核/已审核）
                 */
                type: number;

                /**
                 * 可提供的进行搜索的条件
                 */
                keys: ReadonlyArray<string>;

                /**
                 * 输入的搜索内容
                 */
                searchKey?: string;

                /** 
                 *根据输入的搜索内容和用户的选择，拼接的搜索条件 
                 */
                searchValue?: Array<object>;

                /**
                 * 自定义弹出的下拉列表中搜索关键字和搜索值之间的组合关系
                 */
                renderOption?: (key, value) => any;

                /**
                 * 自定义生成的搜索条目搜索关键字和搜索值之间的组合关系
                 */
                renderComboItem?: (key, value) => any;

                /**
                 * 选择的类型（全部申请/未审核/已审核）发生变化时触发
                 */
                doTypeChange?: (type: object) => any;

                /**
                 * 搜索结果发生改变时通知父元素更新显示列表
                 */
                doFilterResultChange: (searchValue) => any;
            }
        }
    }
}