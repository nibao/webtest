declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Sync {

                /**
                 * 请求下载本地缓存文件
                 */
                type RequestDownloadFile = Core.APIs.ClientAPI<{

                    /**
                     * 相对路径
                     */
                    relPath: string

                }, void>

                /**
                 * 请求下载本地缓存目录
                 */
                type RequestDownloadDir = Core.APIs.ClientAPI<{

                    /**
                    * 相对路径
                    */
                    relPath: string

                }, void>

                /**
                 * 请求清除本地缓存目录
                 */
                type RequestLocalCleanDir = Core.APIs.ClientAPI<{

                    /**
                     * 相对路径
                     */
                    relPath: string

                }, void>

                /**
                 * 请求清除本地缓存目录
                 */
                type RequestLocalCleanFile = Core.APIs.ClientAPI<{

                    /**
                     * 相对路径
                     */
                    relPath: string

                }, void>

                /**
                 * 是否有同步任务
                 */
                type HasSyncTask = Core.APIs.ClientAPI<{}, boolean>

                /**
                 * 获取正在同步任务数
                 */
                type GetSyncTaskNum = Core.APIs.ClientAPI<{}, Core.APIs.Client.SyncTaskNum>

                /**
                 * 获取同步详情
                 */
                type GetSyncDetailByInterval = Core.APIs.ClientAPI<{

                    /**
                     * 起始参数
                     */
                    begin: number,

                    /**
                     * 最终参数 
                     */
                    end: number
                }, Core.APIs.Client.SyncingTasks>

                /**
                 * 暂停某个同步任务通过任务id
                 */
                type PauseTaskById = Core.APIs.ClientAPI<{

                    /**
                     * 任务id 
                     */
                    taskId: string

                }, void>

                /**
                 * 取消某个同步任务通过任务id
                 */
                type CancelTaskById = Core.APIs.ClientAPI<{

                    /**
                     * 任务id
                     */
                    taskId: string

                }, void>

                /**
                 * 恢复某个同步任务通过任务id
                 */
                type ResumeTaskById = Core.APIs.ClientAPI<{

                    /**
                     * 任务id 
                     */
                    taskId: string

                }, void>

                /**
                 * 暂停所有同步任务
                 */
                type PauseAllTask = Core.APIs.ClientAPI<{}, void>

                /**
                 *取消所有同步任务
                 */
                type CancelAllTask = Core.APIs.ClientAPI<{}, void>

                /**
                 *恢复所有同步任务
                 */
                type ResumeAllTask = Core.APIs.ClientAPI<{}, void>

                /**
                 * 请求转移未同步文件
                 */
                type RequestTransferUnsync = Core.APIs.ClientAPI<{

                    /**
                     * 未同步路径集合，为空表示转移所有未同步文件
                     */
                    absPaths: ReadonlyArray<string>,

                    /**
                     * 转移至目标目录
                     */
                    dirPath: string
                }, void>

                /**
                 * 请求上传未同步文件
                 */
                type RequestUploadUnsync = Core.APIs.ClientAPI<{

                    /**
                     * 未同步路径集合，为空表示转移所有未同步文件
                     */
                    absPaths: ReadonlyArray<string>
                }, void>

            }
        }
    }
}