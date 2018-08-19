declare namespace Components {
    namespace ContactList {
        interface Props extends React.Props<any> {
            /**
             * 正在加载中
             */
            isLoading: boolean;

            /**
             * 联系人
             */
            persons: Array<Core.APIs.EACHTTP.ContactUser2>;

            /**
             * 联系人选中项
             */
            personSelection: Array<Core.APIs.EACHTTP.ContactUser2>;

            /**
             * 滚动时触发加载
             */
            lazyLoad: () => void;

            /**
             * 从分组中删除联系人
             */
            deleteContactPerson: (personSelection: Array<Core.APIs.EACHTTP.ContactUser2>) => void;

            /**
             * 联系人选中项变动
             */
            onPersonSelectionChange: (personSelection: Array<Core.APIs.EACHTTP.ContactUser2>) => void;

        }
    }
}