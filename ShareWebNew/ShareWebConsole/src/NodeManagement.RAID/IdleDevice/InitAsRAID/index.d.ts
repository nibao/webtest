declare namespace Console {
    namespace NodeManagementRAID {
        namespace IdleDevice {
            namespace InitAsRAID {
                interface Props extends React.Props<any> {
                    /**
                     * 节点信息
                     */
                    node: object;

                    /**
                     * 选中项信息
                     */
                    disks: ReadonlyArray<object>;

                    /**
                     * 关闭对话框
                     */
                    onInitRAIDCancel: () => any;

                    /**
                     * 初始化RAID失败
                     */
                    onInitRAIDFail: () => any;

                    /**
                     * 初始化成功时
                     */
                    onInitRAIDSuccess: (physicalDisk: object, logicDisk: object) => any;
                }

                interface State {
                    /**
                    * 选择的RAID类型（RAID0|RAID5）
                    */
                    selectedRAIDType: 'RAID0' | 'RAID5';

                    /**
                    * 选择的每组磁盘数
                    */
                    selectedDiskNum: number,

                    /**
                     * 设置初始化RAID选项对话框
                     */
                    initDialog: boolean;

                    /**
                    * 确认初始化RAID对话框
                    */
                    confirmDialog: boolean;

                    /**
                     * 正在执行初始化等待提示
                     */
                    processingInit: boolean;

                    /**
                     * 初始化RAID失败信息
                     */
                    initErrMsg: string;

                    /**
                     * 初始化RAID成功后重新请求得到的物理磁盘列表，用于通知父元素更新列表显示
                     */
                    physicalDisk: object;

                    /**
                     * 初始化RAID成功后重新请求得到的逻辑磁盘列表，用于通知父元素更新列表显示
                     */
                    logicDisk: object;
                }
            }
        }
    }
}