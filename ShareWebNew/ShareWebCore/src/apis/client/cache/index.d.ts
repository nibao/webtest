declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Cache {

                /**
                 * 获取缓存信息
                 */
                type GetInfoByPath = Core.APIs.ClientAPI<{
                    /**
                     * 相对路径
                     */
                    relPath: string
                }, Core.APIs.Client.CacheInfo>


                /**
                 * 获取未同步任务
                 */
                type GetUnsyncLog = Core.APIs.ClientAPI<{

                    /**
                     * 绝对路径
                     */
                    absPath: string,

                    /**
                     * 获取数目
                     */
                    countLimit: number
                }, Core.APIs.Client.UnsyncInfo>


                /**
                 * 获取未同步任务数目
                 */
                type GetUnsyncLogNum = Core.APIs.ClientAPI<{

                    /**
                     * 绝对路径
                     */
                    absPath: string
                }, Core.APIs.Client.UnsyncNum>


            }
        }
    }
}