declare namespace Components {
    namespace Docs {
        interface Props {
            /**
             * 全文检索响应事件
             */
            onRequestGlobalSearch: (key: string, range?: string) => void;

            /**
             * 点击标签后的全文检索响应事件
             */
            onRequestGlobalSearchForTag: (tag: string) => void;

            /**
             * 跳转至共享申请
             */
            doApprovalCheck?: () => any;
        }

        interface Context {
            fileSystem: Core.FileSystem.AsFileSystem
        }
    }
}