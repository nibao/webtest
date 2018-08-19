declare namespace Components {
    namespace NodeManagement {
        namespace RAID {
            interface Props extends React.Props<any> {
                /**
                 * 节点信息
                 */
                node: object;
            }

            interface State {
                /**
                 * 判断该节点是否具有RAID信息
                 */
                hasRAID: boolean | null;

                /**
                 * 是否展示RAID信息
                 */
                openRAIDInfo: boolean;

                /**
                 * 是否展示热备盘信息
                 */
                openHotSpare: boolean;

                /**
                 * 是否展示空闲物理设备
                 */
                openIdleDevice: boolean;

                /**
                 * RAID物理磁盘信息
                 */
                physicalDisk: object;

                /**
                 * RAID逻辑磁盘信息
                 */
                logicDisk: object;
            }
        }
    }
}