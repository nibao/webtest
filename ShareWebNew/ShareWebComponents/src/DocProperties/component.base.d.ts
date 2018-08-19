declare namespace Components {
    namespace DocProperties {
        interface Props {
            // 文档对象
            docs: Array<Core.Docs.Doc>;

            /**
             * 父路径对象
             */
            parent: Core.Docs.Doc;

            userid?: String;

            tokenid?: String;

            className?: any;

            onTagClick?: Function;

            /**
             * 点击还原历史版本
             * @param doc 文档
             * @param revision 版本
             */
            doRevisionRestore: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;

            /**
             * 点击查看历史版本
             * @param docid 文档id
             * @param revision 版本
             */
            doRevisionView: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;

            /**
             * 点击下载历史版本
             * @param docid 文档id
             * @param revision 版本
             */
            doRevisionDownload: (doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) => void;
        }

        interface Base {
            state: {

            };

            props: Props
        }
    }
} 