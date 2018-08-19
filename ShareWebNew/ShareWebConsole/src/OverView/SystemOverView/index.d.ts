declare namespace Console {
    namespace OverView {
        interface Props extends React.Props<void> {
            /**
             * 系统关闭完成
             */
            onSystemShutdown: () => void
        }

        interface State {
            /**
             * 版本信息
             */
            version: string;

            /**
             * 系统时间
             */
            time: string;

            /**
             * 服务器数量
             */
            nodeLength: number | string;

            /**
             * 警告提示状态
             */
            status: boolean;

            /**
             * 关闭系统
             */
            closing: boolean;
        }
    }
}