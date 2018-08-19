declare namespace Console {
    namespace NodeManagementRAID {
        namespace IdleDevice {
            interface Props extends React.Props<any> {
                /**
                 * 节点信息 
                 */
                node: object;

                /**
                * 物理磁盘信息
                */
                physicalDisk: object;

                /**
                 * 初始化RAID成功时
                 */
                onInitRAIDSuccess: (physicalDisk: object, logicDisk: object) => any;

                /**
                * 设为热备盘成功时
                */
                onSetAsHotSpareSuccess: (physicalDisk: object) => any;
            }

            interface State {
                /**
                 * 空闲磁盘信息
                 */
                idleDeviceArr: ReadonlyArray<object>;

                /**
                * 选中项信息
                */
                selection: object;

                /**
                 * 磁盘设备详情
                 */
                details: object | null;

                /**
                 * 磁盘id
                 */
                diskID: string;

                /**
                 * 展示初始化RAID相关配置对话框
                 */
                showInitRAIDDialog: boolean;

                /**
                 * 展示设为热备盘相关配置对话框
                 */
                showSetAsHotSpareDialog: boolean;
            }
        }
    }
}
