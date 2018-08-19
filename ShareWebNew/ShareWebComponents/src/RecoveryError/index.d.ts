declare namespace Components {
    namespace RecoveryError {

        interface Props extends React.Props<any> {
            /**
             * 错误码
             */
            errorCode: number;

            /**
             * 关闭提示框
             */
            onClose(): void;
        }

        interface State {

        }
    }
}