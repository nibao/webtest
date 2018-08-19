declare namespace Components {
    namespace Sync {
        namespace Failed {
            interface Props extends React.Props<void> {

                /** 
                 * 同步失败数据 
                 */
                failedSyncs: Array<Core.APIs.Client.Detail>,

                /** 
                 * 同步失败总数 
                 */
                failedNum: number,

                /** 
                 * 清空记录 
                 * @param logType 任务类型
                 */
                clear: (logType: number) => void;

                /** 
                 * 打开文件夹 
                 * @param relPath 相对路径
                 */
                openDirByRelPath: (relPath: string) => void;

                /** 
                 * 打开文件夹 
                 * @param absPath 绝对路径
                 */
                openDirByAbsPath: (absPath: string) => void;

                /** 
                 * 删除 
                 * @param logId 任务id
                 */
                deleteByLogId: (logId: number) => void;

                /**
                 * 显示任务图标
                 * @param taskType 任务类型
                 * @return code 图标
                 * @return color 颜色
                 */
                showTaskIcon: (taskType: number) => { code: string, color: string };
            }
        }
    }

}