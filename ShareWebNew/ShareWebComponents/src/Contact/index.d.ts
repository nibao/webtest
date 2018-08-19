declare namespace Components {
    namespace Contact {

        interface Props extends React.Props<any> {

        }

        interface State {
            /**
             * 操作类型
             */
            action: number;

            /**
             * 分组选中项
             */
            groupSelection: Array<Core.APIs.EACHTTP.ContactGroup>;
        }
    }
}