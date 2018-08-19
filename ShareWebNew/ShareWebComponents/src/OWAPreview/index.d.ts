declare namespace Components {
    namespace OWAPreview {
        interface Props {

            /**
             * 是否允许打印
             */
            canprint: boolean;

            /**
             * 是否允许编辑
             */
            canEdit: boolean;

            /**
             * 文档
             */
            doc: any;

            /**
             * 是否以编辑状态打开
             */
            edit: boolean;

            /**
             * 切换编辑状态
             */
            onToggleEdit: () => any;

            /**
             * 下载
             */
            doDownload?: (doc: Core.Docs.Doc) => void;

            /**
             * 转存
             */
            doSaveTo?: (doc: Core.Docs.Doc) => any;

            /**
             * 预览错误
             */
            onError?: (errcode: number) => void;

            /**
             * 还原历史版本
             */
            doRevisionRestore?: (doc: Core.Docs.Doc) => void;
        }
    }
}