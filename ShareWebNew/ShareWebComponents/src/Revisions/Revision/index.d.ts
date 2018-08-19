declare namespace Components {
    namespace Revisions {
        namespace Revision {
            interface Props extends React.Props<any> {
                /**
                 * 文档对象
                 */
                doc: Core.Docs.Doc;

                /**
                 * 当前版本对象
                 */
                revision: Core.APIs.EFSHTTP.RevisionsResult;

                /**
                 * 所有版本对象数组
                 */
                revisions?: ReadonlyArray<Core.APIs.EFSHTTP.RevisionsResult>;

                /**
                 * 点击还原
                 * @param doc 文档
                 * @param revision 版本
                 */
                doRevisionRestore: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;

                /**
                 * 点击查看
                 * @param docid 文档id
                 * @param revision 版本
                 */
                doRevisionView: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;

                /**
                 * 点击下载
                 * @param docid 文档id
                 * @param revision 版本
                 */
                doRevisionsDownload?: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;
            }
        }
    }
}