declare namespace Console {
    namespace StoragePoolManager {
        namespace CustomSelectMenu {
            interface Props {
                /**
                 * 是否禁用按钮
                 */
                disabled?: boolean;

                /**
                 * 标签样式
                 */
                labelClassName?: any;

                /**
                 * 整体自定义样式
                 */
                className?: any;

                /**
                 * 下拉菜单自定义样式
                 */
                popmenuClassName?: any;

                /**
                 * 下拉菜单按钮自定义样式
                 */
                btnClassName?: any;

                /**
                 * 左边标签
                 */
                label: string;

                /**
                 * 默认选中项, 若不存在则为候选项第一项
                 */
                defaultSelectedValue?: object;

                /**
                 * 候选项，结构如下
                 * [
                 *      {
                 *            name: string;
                 *            ...otherProps
                 *      }
                 * ]
                 */
                candidateItems: Array<object>;

                /**
                 * 选中项改变时触发，返回选中项
                 * {
                 *      name: 显示名称 string,
                 *      ...props: any
                 * }
                 */
                onSelect(selectValue: object): void;


            }

            interface State {
                /**
                 * 菜单锚点
                 */
                selectMenuAnchor: object;

                /**
                 * 是否显示下拉菜单项
                 */
                showSelectMenu: boolean;

                /**
                 * 菜单选中项
                 * {
                 *      name: 显示名称 string,
                 *      ...props: any
                 * }
                 */
                selectValue: object;

                /**
                 * 点击状态,用于点击后出现高亮背景
                 */
                clickStatus: boolean;
            }

        }
    }
}