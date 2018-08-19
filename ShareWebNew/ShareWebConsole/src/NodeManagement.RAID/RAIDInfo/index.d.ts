declare namespace Console {
    namespace NodeManagementRAID {
        namespace RAIDInfo {
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
                 * 逻辑磁盘信息
                 */
                logicDisk: object;

            }

            interface State {
                /**
                 * 磁盘设备详情
                 */
                details: object | null;

                /**
                 * 磁盘id
                 */
                diskID: string;
            }
        }
    }
}
