declare namespace Components {
    namespace ViewSize {
        namespace Content {
            interface Props extends React.Props<void> {
                /**
                 * 确定事件
                 * @param size 大小
                 */
                onConfirm: () => void;

                /**
                 * 取消事件
                 */
                onCancel: () => void;

                /**
                 * 查询状态
                 */
                isQuering: boolean;

                /**
                 * 窗口与组件大小自适应(pc侧边栏)
                 */
                filenum: number;

                /**
                 * 总文件夹数
                 */
                dirnum: number;

                /**
                 * 总大小
                 */
                totalsize: number;

                /**
                 *  回收的大小
                 */
                recyclesize: number;

                /**
                 * 是否是回收站
                 */
                onlyrecycle: boolean;
            }
        }
    }
} 