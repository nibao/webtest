declare namespace Components {
    namespace DocSelector2 {
        namespace ToolButtons {
            interface Props extends React.Props<any> {
                /**
                 * className
                 */
                className?: string;

                /**
                 * 路径数组
                 */
                crumbs: Core.Docs.Docs;

                /**
                 * 工具栏按钮的描述
                 */
                description: string;

                /**
                 * 选择文件
                 */
                onConfirm: (dest: Core.Docs.Doc) => void;
            }
        }
    }

}