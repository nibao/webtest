declare namespace Components {
    namespace DrawerMenu {
        interface Props extends React.Props<any> {
            /**
             * 提示信息
             */
            message: string;

            /**
             * 点击确定按钮的时候执行的操作
             */
            doConfirm(): void;

            /**
             * 点击删除按钮的时候执行的操作
             */
            doCancel: () => void;
        }
    }
}