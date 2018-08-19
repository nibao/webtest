declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Quota {

                /**
                 * 获取用户配额
                 */
                type GetUserQuota = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.QuotaInfos>

                /**
                * 根据cid路径获取配置信息
                */
                type GetByCid = Core.APIs.OpenAPI<{
                    /**
                     * cid地址
                     */
                    cid: string;
                }, Core.APIs.EACHTTP.QuotaInfosByCid>

            }
        }
    }
}
