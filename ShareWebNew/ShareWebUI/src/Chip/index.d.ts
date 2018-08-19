declare namespace UI {
    namespace Chip {
        interface Props extends React.Props<any> {
            /**
             * 是否只读
             */
            readOnly?: boolean;

            /**
             * 是否禁用
             */
            disabled?: boolean;

            /**
             * className
             */
            className?: string;

            /**
             * 删除功能
             */
            removeHandler?: () => any;

        }
    }
}