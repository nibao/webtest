declare namespace Console {
    namespace StoragePoolManager {
        namespace AddDevicesDialog {
            interface Props {
                /**
                 * 存储池节点信息
                 */
                storagePoolNodeInfo: ReadonlyArray<Core.ECMSManager.ncTStorageNodeInfo>;

                /**
                 * 确认变更存储池设备
                 */
                onAddDevicesConfirm(waitForAddFreeDevices: object, shouldAddAllDevices: object): void;

                /**
                 * 取消变更存储池设备
                 */
                onAddDevicesCancel(): void;
            }

            interface State {

                /**
                 * 错误信息
                 */
                errorMsg: string;

                /**
                 * 是否显示等待提示
                 */
                showLoading: boolean;

                /**
                 * 待添加的空闲设备集合
                 * {
                 *   node_ip: {dev1, dev2}
                 * }
                 */
                waitForAddFreeDevices: object;

                /**
                 * 是否添加当前节点全部空闲设备
                 * {
                 *   node_ip: false
                 * }
                 */
                shouldAddAllDevices: object;

                /**
                 * 节点空闲设备状态
                 */
                devicesExceptionStatus: {
                    status: number;
                    detail: any;
                }
            }
        }
    }
}