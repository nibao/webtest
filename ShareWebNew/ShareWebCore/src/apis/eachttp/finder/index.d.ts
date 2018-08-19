declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Finder {

                /**
                 * 文档发现状态
                 */
                type GetStatus = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.DocStatus>

                /**
                 * 开启文档发现状态
                 */
                type Enable = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, void>

                /**
                 * 关闭文档发现状态
                 */
                type Disable = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, void>

                /**
                * 用户开启发现的文档
                */
                type GetEnabled = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.EnabledInfos>
            }
        }
    }
}