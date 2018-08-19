declare namespace Console {
    namespace StoragePoolManager {
        namespace ReplaceDevicesDialog {
            interface Props {

                /**
                 * 待替换的设备信息
                 */
                replacedPoolDevice: Core.ECMSManager.ncTStoragePoolDevice;

                /**
                 * 可用于替换指定存储池设备的备选空闲数据盘
                 * [
                 *      {
                 *          name: dev_name,
                 *          ...otherprops
                 *      }
                 * 
                 * ]
                 */
                freePoolDevices: Array<object>;

                /**
                 * 确认替换设备操作
                 * newDevice:{
                 *     name: dev_name,
                 *     ...otherprops
                 * }
                 */
                onReplaceDevicesConfirm(oldDevice: Core.ECMSManager.ncTStoragePoolDevice, newDevice: object): void;

                /**
                 * 取消替换设备操作
                 */
                onReplaceDevicesCancel(): void;

            }

            interface State {

                /**
                 * 选定用于替换的空闲设备
                 * {
                 *     name: dev_name,
                 *     ...otherprops
                 * }
                 */
                waitForReplacedDevices: object;


            }

        }
    }
}