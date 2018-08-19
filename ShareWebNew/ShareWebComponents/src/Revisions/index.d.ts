declare namespace Components {
    namespace Revisions {
        interface Props extends React.Props<any> {
            /**
             * 文档
             */
            doc: Core.Docs.Doc;

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
            doRevisionView?: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;

            /**
             * 点击下载
             * @param docid 文档id
             * @param revision 版本
             */
            doRevisionDownload?: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;
        }

        interface State {
            /**
             * 文件历史版本数据
             */
            revisions: ReadonlyArray<Core.APIs.EFSHTTP.RevisionsResult>;

            /**
             * 是否有预览权限
             */
            previewEnabled: boolean;
        }
    }
}