declare namespace Console {
    namespace StoragePoolManager {
        namespace PoolDevicesList {
            interface Props {
                /**
                 * 是否显示存储池内设备信息
                 */
                expand: boolean;

                /**
                 * 存储池中节点设备列表
                 */
                storagePoolDevices: ReadonlyArray<Core.ECMSManager.ncTStoragePoolDevice>;

                /**
                 * 存储池节点信息
                 */
                storagePoolNodeInfo: ReadonlyArray<Core.ECMSManager.ncTStorageNodeInfo>;
            }

            interface State {

                /**
                 * 是否显示存储池内设备信息
                 */
                showPoolDevicesList: boolean;

                /**
                 * 设备选中项
                 */
                deviceSelection: Array<Core.ECMSManager.ncTStoragePoolDevice>;


            }

        }
    }
}