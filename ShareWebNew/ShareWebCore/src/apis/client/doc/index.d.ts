declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Doc {

                /**
                 * 检查本地同步
                 */
                type CheckLocalSync = Core.APIs.ClientAPI<{

                    /**
                     * 本地路径
                     */
                    localPath: string,

                    /**
                     * 同步目录
                     */
                    syncPath: string
                }, void>

                /**
                 * 获取未同步文档
                 */
                type GetUnsyncDoc = Core.APIs.ClientAPI<{

                    /**
                     * 绝对路径
                     */
                    absPath: string
                }, Core.APIs.Client.UnsyncDoc>

                /**
                 * 是否开启新视图
                 */
                type IsNewView = Core.APIs.ClientAPI<{}, Core.APIs.Client.IsNewView>
            }
        }
    }
}