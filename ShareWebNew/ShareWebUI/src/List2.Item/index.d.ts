declare namespace UI {
    namespace List2Item {
        interface Props extends React.Props<void> {
            /**
             * 复选框
             */
            checkbox?: {
                /**
                 * 复选框是否禁用
                 */
                disabled?: boolean;

                /**
                 * 复选框勾选状态发生变化
                 */
                onChange: (Checked: boolean) => any;

                /**
                 * 勾选状态
                 */
                checked?: boolean;
            }

            /**
             * 右侧图标
             */
            rightIcon: React.ReactInstance;

            /**
             * 点击事件
             */
            onClick: () => any;
        }
    }
}
