declare namespace Components {
    namespace AppealDialog {
        interface Props extends React.Props<any> {

            /**
             * 申诉文件对象
             */
            currentDoc: Core.APIs.EFSHTTP.QuarantineDocs;

            /**
            * 点击"确定""按钮,提交申诉内容
            */
            handleAppealFile(doc: Core.APIs.EFSHTTP.QuarantineDocs, reason: string): void;

            /**
             * 点击"关闭"或"X"按钮,关闭申诉对话框
             */
            onCloseDialog(appealCode: number): void;

            /**
             * 监听文本框内容
             */
            handleTextAreaChange(reason: string): void;

        }
        interface State {

            /**
             * 申诉内容
             */
            appealReason: string;

            /**
             * 申诉限制状态
             */
            overAppealWords: boolean;

        }

    }
}