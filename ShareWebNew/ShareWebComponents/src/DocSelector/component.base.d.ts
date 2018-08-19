declare namespace Components {
    namespace DocSelector {
        type Props = {
            /**
             * 选中事件
             */
            onSelect: any;

            /**
             * 文件和文件夹的选择控制
             * eg: (1) selectType = [SelectType.DIR, SelectType.FILE]   // 文件和文件夹都可选（文件夹和文件都显示）
             *     (2) selectType = [SelectType.DIR]   //  只能选择文件夹（只显示文件夹）
             *     (3) selectType = [SelectType.FILE]  //  只能选择文件（文件夹和文件都显示）
            */
            selectType: Array<number>;

            /**
             * 选择模式: 'single'--单选, 'multi'--多选, 'cascade'--级联
            */
            selectMode: string;

            /**
             * 选中“取消”按钮 或者 右上角的关闭按钮
             */
            onCancel: () => void;
        }

        type State = {
            /**
             * 选中的文件
             */
            selection: any;
        }

        interface Base {
            props: Props;

            state: State;
        }
    }
}