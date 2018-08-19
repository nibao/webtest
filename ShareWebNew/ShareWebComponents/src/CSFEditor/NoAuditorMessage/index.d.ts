declare namespace Components {
    namespace Attributes {
        namespace NoCsfAuditorMessage {
            interface Props extends React.Props<void> {
                /**
                 * 是否显示跳过
                 */
                docs: Core.Docs.Docs;

                /**
                 * 当前文档
                 */
                currentDoc: any;

                /**
                 * 复选框状态改变
                 */
                onChange: (value: boolean) => void;

                /**
                 * 确定事件
                 */
                onConfirm: (skipNoAuditorState?: boolean) => void;
            }
        }
    }

}