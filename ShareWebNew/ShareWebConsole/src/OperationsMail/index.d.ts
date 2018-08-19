
declare namespace Console {
    namespace OperationsMail {
        interface Props extends React.Props<void> {
        }

        interface State {

            /**
             * 运营邮箱数据
             */
            mails: ReadonlyArray<string>;

            /**
             * 运维助手开关状态
             */
            operationsHelperStatus: boolean;

            /**
             * 显示运维助手服务条款
             */
            showOperationsProtocol: boolean;

            /**
             * 邮箱的编辑状态
             */
            isMailsChanged: boolean;

            /**
             * 运维助手开关的编辑状态
             */
            isOperationsSwitchChanged: boolean;


            /**
             * 测试邮箱成功
             */
            isMailTestedSuccess: boolean;

            /**
             * 错误信息
             */
            errorStatus?: number;

            /**
             * 保存成功
             */
            isSavedSuccess: boolean;
        }
    }
}