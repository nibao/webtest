declare namespace Console {
    namespace DocLibrarySeletor {
        interface Props extends React.Props<void>{
            /**
             * 管理员id
             */
            userid: string;
            /**
             * 确定
             */
            onConfirmSelectDocLib: (selected) => any;
            /**
             * 取消
             */
            onCancelSelectDocLib: () => void;
        }
        interface State {
            /**
             *  选择的节点
             */
            selected: Array<any>;
        }
    }
}