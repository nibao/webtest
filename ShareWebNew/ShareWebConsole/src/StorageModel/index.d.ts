declare namespace Console {
    namespace StorageModel {
        interface Props {
            /**
             * 存储模式选择
             */
            storageModelSelection: number;

            /**
             * 确认选择存储模式
             */
            onSelectionConfirm(selection: number): void;

            /**
             * 取消选择存储模式
             */
            onSelectionCancel(): void;
        }

        interface State {
            /**
             * 存储模式选择
             */
            storageModelSelection: number;

            /**
             * 是否显示警告提示框
             */
            showWarningDialog: boolean;

        }
    }
}