declare namespace Console {
    namespace ServerUpgrade {
        namespace NodeInfos {
            interface Props extends React.Props<any> {
                /**
                 * 升级状态  升级中/上传成功/上级完成
                 */
                serverPackageStatus: number;

                /**
                 * 显示 进度/上传/具体信息页面
                 */
                packageStatus: number;

                /**
                 * 升级状态更新
                 */
                onUpdatePackageStatus: (serverPackageStatus: number) => any;
            }

            interface State {
                /**
                 * 当前版本
                 */
                currentVersion: string;

                /**
                 * 节点升级状态
                 */
                nodesUpgradeStatus: ReadonlyArray<ncTNodeUpgradeStatus>;

                /**
                 * 当前正在查看错误详情的节点
                 */
                currentNode: any;

                /**
                 * ConfirmDialog状态
                 */
                confirmStatus: number;

                /**
                 * 节点信息
                 */
                upgradeStatusArray: ReadonlyArray<any>;
            }
        }
    }
}