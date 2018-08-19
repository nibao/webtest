declare namespace Components {
    namespace ErrorInvalidMessage {
        interface Props extends React.Props<void> {
            /**
             * 确认错误按钮
             * goToEntry: 是否需要返回顶层目录
             */
            onConfirm: (goToEntry?: boolean) => void;

            /**
             * 错误码
             */
            errorCode: string;

            /**
             * 发生错误的对象
             */
            errorDoc: Core.Docs.Doc;

            /**
             * 是否是回收站
             */
            onlyrecycle: boolean;

        }
    }
}