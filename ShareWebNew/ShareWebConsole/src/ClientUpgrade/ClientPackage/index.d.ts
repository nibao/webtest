declare namespace Console {
    namespace ClientUpgrade {
        namespace ClientPackage {
            interface Props extends React.Props<any> {
                /**
                 * 包信息
                 */
                packageinfo: any;

                /**
                 * 客户端类型
                 */
                osType: number;
            }

            interface State {
                /**
                 * 升级包的状态
                 */
                packageStatus: number;

                /**
                 * 进度值
                 */
                progress: number;

                /**
                 * 升级包的信息
                 */
                packageinfo: any;

                /**
                 * 错误
                 */
                error: {
                    type: any;

                    message: string;
                }

                /**
                 * 警告提示框的状态
                 */
                confirmStatus: number;
            }
        }
    }
}