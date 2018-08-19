declare namespace Components {
    namespace Sync {
        namespace Syncing {
            interface Props extends React.Props<void> {

                /** 
                 * 正在同步的任务详情 
                 */
                detail: Array<Core.APIs.Client.SyncingDetail>;

                /** 
                 * 正在同步的任务总数 
                 */
                total: number;

                /** 
                 * 全部恢复 
                 */
                resumeAllTask: () => void;

                /** 
                 * 全部暂停 
                 */
                pauseAllTask: () => void;

                /** 
                 * 全部取消 
                 */
                cancelAllTask: () => void;

                /** 
                 * 暂停 
                 * @param taskId 任务id
                 */
                pause: (taskId: string) => void;

                /** 
                 * 恢复 
                 * @param taskId 任务id
                 */
                resume: (taskId: string) => void;

                /** 
                 * 取消 
                 * @param taskId 任务id
                 */
                cancel: (taskId: string) => void;

                /**
                 * 显示任务图标
                 * @param taskType 任务类型
                 * @return code 图标
                 * @return color 颜色
                 */
                showTaskIcon: (taskType: number) => { code: string, color: string };

                /**
                 * 根据任务类型和任务状态显示相应的文字
                 * @param taskType 任务类型
                 * @param taskStatus 任务状态
                 * @param rate 下载速度
                 */
                showTextByStatus: (taskType: string, taskStatus: number, rate: number) => void;

            }
        }
    }

}