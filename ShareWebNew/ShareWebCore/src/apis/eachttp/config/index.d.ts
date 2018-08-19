declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Config {
                /**
                * 获取配置信息
                */
                type Get = Core.APIs.OpenAPI<{}, Core.APIs.EACHTTP.CacheConfigs>

                /**
                 * 获取OEM配置
                 */
                type GetOemConfigBySection = Core.APIs.OpenAPI<{
                    /**
                     * 格式类似：shareweb_zh-cn
                     */
                    section: string;
                }, Core.APIs.EACHTTP.OEMInfo>

                /**
                 * 获取水印配置
                 */
                type GetDocWatermarkConfig = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.DocWatermarkConfig>

                /**
                 * 获取OfficeOnline站点信息
                 */
                type GetSiteOfficeOnlineInfo = Core.APIs.OpenAPI<{
                    /**
                     * 文件归属站点
                     */
                    sitename: string;
                }, Core.APIs.EACHTTP.SiteOfficeOnlineInfo>
            }
        }
    }
}