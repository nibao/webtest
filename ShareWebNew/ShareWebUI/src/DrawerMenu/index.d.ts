declare namespace UI {
    namespace DrawerMenu {

        type DrawerPosition = 'top' | 'right' | 'bottom' | 'left'

        interface Props extends React.Props<any> {
            /** 
             * 是否显示抽屉组件
             */
            open: boolean;

            /**
            * 遮罩层
            */
            mask?: boolean;

            /**
             * 位置
             */
            position?: DrawerPosition;

            /**
             * 样式
             */
            className?: any;
        }

        interface State {
            /** 
             * 是否显示抽屉组件
             */
            open: boolean;
        }
    }
}