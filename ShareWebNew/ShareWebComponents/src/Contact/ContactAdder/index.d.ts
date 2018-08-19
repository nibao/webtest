declare namespace Components {
    namespace ContactAdder {
        interface Props extends React.Props<any> {
            /**
             * 将选中的联系人传出去
             */
            onAddContact: (candidates: ReadonlyArray<any>) => any;

            /**
             * 取消
             */
            onCancel: () => void;
        }

        interface State {
            /**
             * 已选的联系人
             */
            candidates: ReadonlyArray<any>;
        }
    }
}