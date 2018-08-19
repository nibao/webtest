declare namespace Core {
    namespace APIs {
        namespace Client {
            namespace Config {

                /**
                 * 获取本地用户配置
                 */
                type GetLocalUserById = Core.APIs.ClientAPI<{

                    /**
                     *  用户id
                     */
                    userId: string
                }, Core.APIs.Client.LocalUserConfig>

                /**
                 * 获取全局配置
                 */
                type GetGlobalServer = Core.APIs.ClientAPI<void, Core.APIs.Client.GlobalServerConfig>

                /**
                 * 获取当前服务配置
                 */
                type GetLocalServerById = Core.APIs.ClientAPI<{

                    /**
                     * 服务器地址
                     */
                    serverId: string
                }, Core.APIs.Client.LocalServerConfig>

                /**
                * 获取版本信息
                */
                type GetVersionInfo = Core.APIs.ClientAPI<{

                }, Core.APIs.Client.VersionInfo>

                /**
                * 获取语言信息
                */
                type GetLanguageInfo = Core.APIs.ClientAPI<{

                }, Core.APIs.Client.LanguageInfo>


            }
        }
    }
}