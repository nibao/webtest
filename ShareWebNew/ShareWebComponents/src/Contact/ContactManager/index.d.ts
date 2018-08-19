declare namespace Components {
    namespace ContactManager {

        interface Props extends React.Props<any> {
            /**
             * 点击批量添加联系人按钮
             */
            onBatchAddContacts: (candidates: Array<string>) => void;

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
             * 分组选中项变动
             */
            onGroupSelectionChange: (groupSelection) => void;
        }

        interface State {
            /**
             * 分组选中项
             */
            groupSelection: {};

            /**
             * 联系人选中项
             */
            personSelection;

            /**
             * 是否正在执行加载或搜索操作
             */
            isLoading: boolean;

            /**
             * 分组
             */
            groups: Array<Core.APIs.EACHTTP.ContactGroup>;

            /**
             * 联系人
             */
            persons: Array<Core.APIs.EACHTTP.ContactUser2>;

        }
    }
}