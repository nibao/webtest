declare namespace UI {
    namespace NWWindow {
        interface NWWindow {
            /**
             * DOM Window
             */
            window: Window;

            /**
             * 窗口id
             */
            id?: string;

            /**
             * 窗口标题栏
             */
            title?: string;

            /**
             * 关闭窗口
             * @param force 是否强制关闭（容易造成nw奔溃）
             */
            close: (force?: boolean) => void;

            /**
             * 显示窗口
             * @param show 显示或者隐藏窗口
             */
            show: (show?: boolean) => void;

            /**
             * 隐藏窗口
             */
            hide: () => void;

            /**
             * 缩放窗口
             * @param width 窗口宽度
             * @param height 窗口高度
             */
            resizeTo: (width?: number, height?: number) => void;

            /**
             * 窗口是否可缩放
             */
            setResizable: (resizable: boolean) => void;

            /**
             * 使窗口最大化
             */
            maximize: () => void;

            /**
             * 监听NWWindow事件
             */
            on: (name: string, callback: () => any) => void;

            /**
             * 聚焦窗口
             */
            focus: () => void;

            /**
             * 限制最小窗口尺寸
             */
            setMinimumSize: (minWidth: number, minHeight: number) => void;
        }

        interface Props extends React.Props<void> {
            /**
             * 目标窗口id，当使用nw.Window.open多次打开同一个id的窗口时，会将已经打开的窗口还原。
             */
            id?: string;

            /**
             * 目标窗口URL
             */
            url?: string;

            /**
             * 宽度
             */
            width?: number;

            /**
             * 高度
             */
            height?: number;

            /**
             * 最小宽度
             */
            minWidth?: number;

            /**
             * 最小高度
             */
            minHeight?: number;

            /**
             * 是否显示边框
             */
            frame?: boolean;

            /**
             * 标题
             */
            title?: string;

            /**
             * 是否显示对话框
             */
            show?: boolean;

            /**
             * 是否允许用户拖拽窗口大小
             */
            resizable?: boolean;

            /**
             * 是否最大化显示窗口
             */
            maximize?: boolean;

            /**
             * 是否遮罩
             */
            modal?: boolean;

            /**
             * 弹窗关闭时执行
             */
            onClose?: () => any;

            /**
             * 打开窗口时触发，注意此时虽然可以获得nwWindow实例，但窗口尚未显示
             */
            onOpen?: (nwWindow: NWWindow) => any;

            /**
             * 窗口加载完成触发，此时window窗口已经显示，可以进行window对象的操作
             */
            onLoaded?: (nwWindow: NWWindow) => any;
        }
    }
}