declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Log {

                /**
                 * 获取同步日志集合
                 */
                type GetSyncLogByIdAndType = Core.APIs.ClientAPI<{

                    /**
                     * 日志类型
                     */
                    logType: number,

                    /**
                     * 日志id
                     */
                    logId: number
                }, Core.APIs.Client.SyncLogInfo>

                /**
                 * 通过日志类型隐藏同步日志   
                 */
                type HideAllSyncLogByType = Core.APIs.ClientAPI<{

                    /**
                     * 日志类型
                     */
                    logType: number
                }, void>

                /**
                 * 通过日志id隐藏同步日志
                 */
                type HideSyncLogById = Core.APIs.ClientAPI<{

                    /**
                     * 日志id
                     */
                    logId: number
                }, void>

            }
        }
    }
}