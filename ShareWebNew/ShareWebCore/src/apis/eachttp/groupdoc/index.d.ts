declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace GroupDoc {
                /**
                 * 删除群组
                 */
                type Delete = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, void>

                /**
                 * 新建群组
                 */
                type Create = Core.APIs.OpenAPI<{
                    /**
                     * 群组文档名称
                     */
                    name: string;

                    /**
                     * 群组文档配额
                     */
                    quota: number;
                }, Core.APIs.EACHTTP.GroupCreateResult>

                /**
                 * 编辑群组名称
                 */
                type Edit = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 文档名称
                     */
                    name: string;
                }, void>

                /**
                 * 编辑群组配额
                 */
                type EditQuota = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 文档配额
                     */
                    quota: number;
                }, void>
            }
        }
    }
}
