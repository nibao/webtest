declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Update {

                /**
                 * 检查客户端是否需要更新
                 */
                type Check = Core.APIs.OpenAPI<{
                    /**
                     * 客户端对应的平台(目前只支持Windows)
                     */
                    platform: string;

                    /**
                    * 客户端的操作系统架构(目前只支持“x86”和“x64”)
                    */
                    arch: string;

                    /**
                    * 客户端程序的版本(为3.5.3.244形式)
                    */
                    version: string;

                    /**
                    * 客户端的软件型号(支持“EShare”或者”AnyShare”)
                    */
                    softwaretype?: string;
                }, Core.APIs.EACHTTP.UpdateInfo>

                /**
                 * 获取外链
                 */
                type Download = Core.APIs.OpenAPI<{
                    /**
                     * 客户端类型
                     */
                    osType: number;

                    /**
                     * 返回的下载地址的host
                     */
                    reqhost?: string;

                    /**
                     * 是否使用https下载
                     */
                    usehttps?: boolean;
                }, Core.APIs.EACHTTP.ClientURL>
            }
        }
    }
}