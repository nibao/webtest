declare namespace Console {
    namespace NodeManagementRAID {
        namespace HotSpare {
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
                 * 删除热备盘成功时将physicalDisk传递给父元素通知更新显示列表
                 */
                doDelHotSpareSuccess: (physicalDisk: object) => any;
            }

            interface State {
                /**
                 * 热备盘信息
                 */
                hotSpareDisk: ReadonlyArray<object>;

                /**
                 * 要删除的磁盘信息
                 */
                deleteInfo: object | null;

                /**
                 * 正在执行删除操作提示
                 */
                processingDel: boolean;
            }
        }
    }
}
