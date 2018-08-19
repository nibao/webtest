declare namespace Components {
    namespace IsolationZone {
        interface Props extends React.Props<any> {

            /**
             * 请求隔离区文件信息
             */
            onLoadFileList(): void;

            /**
             * 点击"查看"按钮
             */
            onClickFileViewVersion(doc: Core.APIs.EFSHTTP.QuarantineDocs): void;

            /**
             * 点击关闭查看历史文件版本按钮
            */
            onClickFileViewVersion(): void;

            /**
             * 点击“申诉”按钮
            */
            onClickFileAppeal(doc: Core.APIs.EFSHTTP.QuarantineDocs): void;

            /**
             * 点击关闭按钮，关闭申诉窗口
            */
            onCloseAppealDialog(appealCode: number): void;

            /**
             * 点击确定按钮，提交申诉内容
            */
            handleAppealFile(doc: Core.APIs.EFSHTTP.QuarantineDocs, reason: string): void;

            /**
             * 点击确定按钮，关闭提交申诉内容后的提示窗口
            */
            onConfirmAppeal(): void;

            /**
             * 点击历史文件，预览文件
            */
            handlePreviewFile(currentDoc: Core.APIs.EFSHTTP.QuarantineDocs, versionDoc: Core.APIs.EFSHTTP.QuarantineReversion): void;

            /**
             * 时间戳转日期
             */
            convertToDate(doc: Core.APIs.EFSHTTP.QuarantineDocs): string;

            /**
             * 截止日期处理
             */
            handleDeadLine(doc: Core.APIs.EFSHTTP.QuarantineDocs): boolean;

            /**
             * 预览隔离区文件
             */
            onPreview(docInfo: previewParams): void;

        }

        type previewParams = {
            /**
             * 文件位于隔离区的docid
             */
            docid: string;

            /**
             * 版本id
             */
            rev: string;
        }

        interface State {

            /**
             * 隔离区文件集合
             */
            quarantineDocs: Array<Core.APIs.EFSHTTP.QuarantineDocs>;

            /**
             * 查看的文档对象
             */
            currentDoc: Core.APIs.EFSHTTP.QuarantineDocs;

            /**
             * 要申诉的文档对象
             */
            appealDoc: Core.APIs.EFSHTTP.QuarantineDocs;

            /**
             * 历史文档对象集合
             */
            versionDocs: Array<Core.APIs.EFSHTTP.QuarantineReversion>;

            /**
             * 隔离区文件是否加载完毕
             */
            isLoadingOver: boolean;

            /**
             * 当前选中行的文档对象
             */
            selectedDoc: Core.APIs.EFSHTTP.QuarantineDocs;

            /**
             * 申诉状态
             */
            appealStatus: number;


        }
    }
}