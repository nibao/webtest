declare namespace Components {
    namespace ViewVersionDialog {
        interface Props extends React.Props<any> {

            /**
            *  历史文件对象集合
            */
            versionDocs: Array<Core.APIs.EFSHTTP.QuarantineReversion>;

            /**
            *  当前文档对象的最新版本文件名
            */
            currentDoc: Core.APIs.EFSHTTP.QuarantineDocs;

            /**
             * 点击"关闭"按钮
             */
            onCloseDialog(): void;

            /**
             * 点击查看历史文件版本按钮
            */
            onClickHistoryFileName(currentDoc: Core.APIs.EFSHTTP.QuarantineDocs, versionDoc: Core.APIs.EFSHTTP.QuarantineReversion): void;

            /**
             * 时间戳转时间,精确到分
             */
            convertToDate(versionDoc: Core.APIs.EFSHTTP.QuarantineReversion): string;

        }
    }
}