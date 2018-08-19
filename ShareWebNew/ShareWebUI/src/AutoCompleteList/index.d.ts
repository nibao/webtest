declare namespace UI {
    namespace AutoCompleteList {
        interface Props extends React.Props<void> {
            /**
             * 高度
             */
            maxHeight?: number;

            /**
             * 当前选中项
             */
            selectIndex?: number;

            /**
             * 键盘按下的状态
             */
            keyDown?: number;

            /**
             * selectIndex发生变化
             */
            onSelectionChange?: (selectIndex: number) => void;

        }

        interface State {
            /**
             * 当前选中项
             */
            selectIndex: number;
        }
    }
}