declare namespace Components {
    namespace MyShare {
        interface Props extends React.Props<any> {
            /**
             * 打开文件所在位置
             */
            doDirOpen?: (doc: Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult) => any;

            /**
             * 打开文件
             */
            doFilePreview?: (doc: Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult) => any;

            /**
             * 内链共享
             */
            doShare?: (doc: Core.APIs.EACHTTP.SharedDocs) => any;

            /**
             * 外链共享
             */
            doLinkShare?: (doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

            /**
             * 打开外链详情
             */
            doLinkShareDetailShow?: (doc: Core.APIs.EFSHTTP.GetLinkedResult) => any;

            /**
             * 跳转至共享申请
             */
            doApvJump?: () => any;
        }

        interface State {
            /**
             * 选择的共享类型(内链或外链)
             */
            type: number;

            /**
             * 内链共享文件列表
             */
            shareDocs: ReadonlyArray<Core.APIs.EACHTTP.SharedDocs> | null;

            /**
             * 外链共享文件列表 
             */
            linkShareDocs: ReadonlyArray<Core.APIs.EFSHTTP.GetLinkedResult> | null;

            /**
             * 选中的文件列表
             */
            selections: Array<Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult>;

            /**
             * 取消共享的内链或外链文件
             */
            cancelDocs: Array<Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult>;

            /**
             * 内链共享文件详情
             */
            shareDocDetail: ReadonlyArray<Core.APIs.EACHTTP.PermInfo>;

            /**
             * 要显示详情的文件
             */
            record: Core.APIs.EACHTTP.SharedDocs;

            /**
             * 错误码
             */
            errorCode?: number;

            /**
             * 出错的文件
             */
            failedDoc?: Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult;

            /**
             * 是否弹出跳转至共享申请提示框
             */
            apvCase: Boolean;
        }
    }
}