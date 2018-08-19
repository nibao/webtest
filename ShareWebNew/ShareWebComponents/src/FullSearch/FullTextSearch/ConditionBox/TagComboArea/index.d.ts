declare namespace Components {
    namespace FullTextSearch {
        namespace TagComboArea {

            interface Props extends React.Props<any> {
                /**
                 * 传递文档标签参数
                 */
                onChange(tagKeys: Array<string>): void;
            }

            interface State {
                /**
                 * 外部文档标签块
                 */
                tagKeys: Array<string>;

                /**
                 * 输入框文档标签块
                 */
                tagInputKeys: Array<string>;

                /**
                 * 是否选择添加文档标签块输入框
                 */
                isTagInput: boolean;

                /**
                 * 输入框聚焦状态
                 */
                tagInputFocus: boolean;

                /**
                 * 下拉菜单锚点
                 */
                tagInputAnchor: object;

                /**
                 * 通过接口获取到的建议标签列表
                 */
                tagSuggestions: Array<string>;

                /**
                 * 输入框的值
                 */
                tagInputValue: string;

                /**
                 * 是否显示建议标签列表
                 */
                isTagSuggestionShow: boolean;
            }
        }
    }
}