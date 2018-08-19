declare namespace Components {
    namespace ContactGroups {

        interface Props extends React.Props<any> {
            /**
             * 联系人分组
             */
            groups: Array<Core.APIs.EACHTTP.ContactGroup>;

            /**
             * 联系人分组选中项变动
             */
            onGroupSelectionChange: (groupSelection: Array<Core.APIs.EACHTTP.ContactGroup>) => void;
        }
    }
}