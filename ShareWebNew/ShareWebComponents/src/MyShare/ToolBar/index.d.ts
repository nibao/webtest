declare namespace Components {
    namespace MyShare {
        namespace ToolBar {
            interface Props extends React.Props<any> {
                /**
                 * 选中的文件列表
                 */
                selection: ReadonlyArray<Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult>;

                /**
                 * 取消内链|外链共享
                 */
                doShareCancel?: (e, doc: Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult) => any;
            }
        }
    }
}