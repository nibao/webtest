declare namespace Console {
    namespace ServerUpgrade {
        namespace ServerPackage {
            interface Props extends React.Props<any> {
                /**
                 * 查看监控详情
                 */
                doSystemDetailRedirect: () => void;
            }

            interface State {
                /**
                 * 升级包的状态， 显示 progress/upload/packageDetail
                 */
                packageStatus: number;

                /**
                 * 进度值
                 */
                progress: number;

                /**
                 * 升级包的信息
                 */
                upgradePackageInfo: any;

                /**
                 * 升级状态
                 */
                upgradeStatusArray: ReadonlyArray<any>;

                /**
                 * 升级包状态 上传成功，升级中，升级完成
                 */
                serverPackageStatus: number;

                /**
                 * error
                 */
                error: {
                    /**
                     * 错误类型
                     */
                    type: number;

                    /**
                     * 错误信息
                     */
                    message: string;
                }
            }
        }
    }
}