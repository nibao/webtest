declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Perm {
                /**
                 * 设定权限
                 */
                type Set = Core.APIs.OpenAPI<{
                    docid: string;
                    permconfigs: ReadonlyArray<Core.APIs.EACHTTP.PermInfo>;
                }, Core.APIs.EACHTTP.PermSetResult>

                /**
                 * 检查最终权限
                 */
                type Check = Core.APIs.OpenAPI<{

                    /**
                     * docid
                     */
                    docid: string;

                    /**
                     * 权限值
                     */
                    perm: number;

                    /**
                     * 要检查的用户的id
                     */
                    userid: string;
                }, Core.APIs.EACHTTP.PermCheckResult>

                /**
                 * 获取权限配置
                 */
                type Get = Core.APIs.OpenAPI<{
                    docid: string;
                }, Core.APIs.EACHTTP.PermInfos>

                /**
                 * 获取内链共享模板
                 */
                type GetInternalLinkTemplate = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.InternalLinkTemplate>

                /**
                 * 获取外链共享模板
                 */
                type GetExternalLinkTemplate = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.ExternalLinkTemplate>

                /**
                 * 获取各访问者的最终权限
                 */
                type List = Core.APIs.OpenAPI<{
                    docid: string;
                }, Core.APIs.EACHTTP.PermResults>

                /**
                 * 添加权限配置项
                 */
                interface PermConfigs {
                    /**
                     * 是否允许权限
                     */
                    isallowed: boolean;

                    /**
                     * 权限值
                     */
                    permvalue: number;

                    /**
                     * 访问者id，可能是用户，部门
                     */
                    accessorid: string;

                    /**
                     * 访问者类型，值域为【”user“，”department“, “contactor”】
                     */
                    accessortyped: string;

                    /**
                     * 到期时间，如果为-1，表示无限期
                     */
                    endtime: number;
                }

                /**
                 * 编辑权限配置项
                 */
                interface PermConfigsInEdit extends PermConfigs {
                    /**
                     * 需要编辑的权限配置项的id
                     */
                    id: number;
                }

                /**
                 * 添加权限配置
                 */
                type Add = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 多个权限配置项
                     */
                    permconfigs: Array<PermConfigs>;
                }, void>

                /**
                 * 编辑权限配置
                 */
                type Edit = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 多个权限配置项
                     */
                    permconfigs: Array<PermConfigsInEdit>;
                }, void>

                /**
                 * 删除权限配置
                 */
                type Delete = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 需要删除的权限配置项的id（多条）
                     */
                    permids: Array<number>;
                }, void>

                /**
                * 检查所有权限
                */
                type CheckAll = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 用户id
                     */
                    userid: string;
                }, Core.APIs.EACHTTP.CheckAllResults>

                /**
                * 用户已共享的文档
                */
                type GetShared = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.SharedDocs>

                /**
                * 共享文档开关配置
                */
                type GetShareDocConfig = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.ShareDocConfigResult>

            }
        }
    }
}