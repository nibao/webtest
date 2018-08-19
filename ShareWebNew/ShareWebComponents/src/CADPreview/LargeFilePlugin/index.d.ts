declare namespace Components {
    namespace CADPreview {
        namespace LargeFilePlugin {
            interface Props extends React.Props<any> {
                /**
                 * 32位大图插件下载地址
                 */
                gstarCADWebViewerSetup86Url: string;

                /**
                 * 64位大图插件下载地址
                 */
                gstarCADWebViewerSetup64Url: string;

                /**
                 * 大图插件跳转需要用到的url
                 */
                gstarcadwebviewUrl: string;

                /**
                 * 文档对象
                 */
                doc: Core.Docs.Doc;

                /**
                 * 下载
                 */
                onDownloadFile?: (doc: Core.Docs.Doc) => any;
            }
        }
    }
}