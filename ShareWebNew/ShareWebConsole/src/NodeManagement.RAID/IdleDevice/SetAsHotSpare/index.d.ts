declare namespace Console {
    namespace NodeManagementRAID {
        namespace IdleDevice {
            namespace SetAsHotSpare {
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
                    onSetHotSpareCancel: () => any;

                    /**
                     * 设置为热备盘失败时触发
                     */
                    onSetHotSpareFail: () => any;

                    /**
                     * 设为热备盘成功时
                     */
                    onSetHotSpareSuccess: (physicalDisk: object) => any;
                }

                interface State {
                    /**
                     * 所有的可关联逻辑设备
                     */
                    lgDiskList: ReadonlyArray<string>;

                    /**
                     * 设置热备盘成功后重新请求得到的逻辑磁盘列表，用于通知父元素更新列表显示
                     */
                    physicalDisk: object;

                    /**
                    * 选择的可关联逻辑设备
                    */
                    selectedLgDisk: string,

                    /**
                     * 设为热备盘选项对话框
                     */
                    setDialog: boolean;

                    /**
                    * 确认设为热备盘对话框
                    */
                    confirmDialog: boolean;

                    /**
                     * 正在设置为热备盘等待提示
                     */
                    processingSet: boolean;

                    /**
                     * 设为热备盘失败错误提示
                     */
                    setErrMsg: string;
                }
            }
        }
    }
}