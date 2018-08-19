declare namespace UI {
    namespace DrawerMenuButton {
        interface Props extends React.Props<any> {
            /**
             * 样式
             */
            className?: any;

            /**
             * 按钮类型,确认或者取消
             */
            type?: 'confirm' | 'cancel';

            /**
             * 点击事件
             */
            onClick?: () => any;
        }
    }
}