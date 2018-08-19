declare namespace Components {
    namespace CSFDetails {
        interface Props extends React.Props<void> {
            /**
             * 文档对象
             */
            doc: Core.Docs.Doc;

            /**
             * 确定事件
             */
            onConfirm: () => void;
        }

        interface State {
            /**
             * 密集详情信息
             */
            csfDetails: any;
        }
    }
}