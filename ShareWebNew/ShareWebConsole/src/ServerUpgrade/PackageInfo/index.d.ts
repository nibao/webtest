declare namespace Console {
    namespace ServerUpgrade {
        namespace PackageInfo {
            interface Props extends React.Props<any> {
                /**
                 * 升级包状态,    上传成功，升级中，升级完成
                 */
                serverPackageStatus: number;

                /**
                 * 删除升级包成功
                 */
                onDeleteServerPackageSuccess: () => any;

                /**
                 * 开始升级
                 */
                onStartUpgrade: () => any;

                /**
                 * 查看监控详情
                 */
                doSystemDetailRedirect: () => void;
            }

            interface State {
                /**
                 * 升级包信息
                 */
                upgradePackageInfo: any;

                /**
                 * confirmDialog的状态
                 */
                confirmStatus: number;

                /**
                 * 错误码
                 */
                errorCode: number;

                /**
                 * 升级包状态,    上传成功，升级中，升级完成
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

                /**
                 * ”正在删除，请稍候“
                 */
                deleting: boolean;
            }
        }
    }
}