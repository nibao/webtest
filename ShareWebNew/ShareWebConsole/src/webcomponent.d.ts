declare namespace Components {
    namespace WebComponent {
        interface Props extends React.Props<any> {
            /**
             * 销毁前执行，如果返回false则不执行销毁
             */
            beforeDestroy?: () => any
        }
    }
}