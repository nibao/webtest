declare namespace Components {
    namespace Account {
        interface Props extends React.Props<void> {
            /**
             * 当前路径
             */
            path: string;

            /**
             * 点击设置邮箱
             */
            onClickEmailConfig: () => void;
        }
    }
}