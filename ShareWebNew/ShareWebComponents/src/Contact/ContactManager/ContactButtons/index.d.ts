declare namespace Components {
    namespace ContactButtons {

        interface Props extends React.Props<any> {
            /**
             * 分组
             */
            groups: Array<Core.APIs.EACHTTP.ContactGroup>;

            /**
             * 分组选中项
             */
            groupSelection: Array<Core.APIs.EACHTTP.ContactGroup>;

            /**
             * 点击创建联系人分组
             */
            onCreateGroup: (groudName: string) => void;

            /**
             * 点击编辑联系人分组
             */
            onModifyGroup: (groudName: string) => void;

            /**
             * 点击删除联系人分组
             */
            onDeleteGroup: () => void;

            /**
             * 点击批量添加联系人按钮
             */
            onBatchAddContacts: (candidates: Array<string>) => void;
        }
    }
}