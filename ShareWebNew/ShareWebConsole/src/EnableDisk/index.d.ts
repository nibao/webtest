declare namespace Console {
    namespace EnableDisk {
        interface Props extends React.Props<any> {
            /**
             * 取消
             */
            onCancel: () => void;

            /**
             * 确认
             */
            onConfirm: () => void;
        }

        interface State {
            /**
             * 树节点
             */
            nodes: ReadonlyArray<any>;

            /**
             * 选中的树节点
             */
            selection: ReadonlyArray<any>;
        }
    }
}