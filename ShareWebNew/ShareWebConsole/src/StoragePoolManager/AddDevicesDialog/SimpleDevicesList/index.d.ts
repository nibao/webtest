declare namespace Console {
    namespace StoragePoolManager {
        namespace AddDevicesDialog {
            namespace SimpleDevicesList {
                interface Props {
                    /**
                     * 存储池节点信息
                     */
                    storagePoolNodeInfo: Core.ECMSManager.ncTStorageNodeInfo;

                    /**
                     * 空闲设备选中时触发
                     * @param selectedFreeDevices: ['dec/sdg': {...}, ]
                     * @param isAll: 是否调用全部添加空闲设备的接口
                     */
                    onFreeDevicesSelected(selectedFreeDevices: Array<object>, isAll: boolean): void;

                    /**
                     * 没有获取到空闲设备时触发
                     */
                    onGetFreeDevicesFailed: (devicesStatus: {status: number; detail: any;}) => void;
                }

                interface State {

                    /**
                     * 是否显示存储池内设备信息
                     */
                    showPoolDevicesList: boolean;

                    /**
                     * 顶部复选框勾选状态
                     */
                    checked: boolean;

                    /**
                     * 顶部复选框半选状态
                     */
                    halfChecked: boolean;

                    /**
                     * 设备选中项
                     */
                    deviceSelection: Array<object>;

                    /**
                     * 存储池节点的空闲设备列表
                     */
                    storagePoolFreeDevices: Core.ECMSManager.ncTStoragePoolDevice;

                    /**
                     * 正在加载空闲设备
                     */
                    loading: boolean;
                }
            }
        }
    }
}