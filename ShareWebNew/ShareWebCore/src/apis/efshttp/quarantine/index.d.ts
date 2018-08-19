declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {
            namespace Quarantine {

                /**
                 * 获取隔离区入口文档信息
                 */
                type List = Core.APIs.OpenAPI<void, Array<Core.APIs.EFSHTTP.QuarantineDocs>>

                /**
                 * 获取隔离区文档版本信息
                 */
                type ListReversion = Core.APIs.OpenAPI<{
                    /**
                     * 查看的文档docid
                     */
                    docid: string;
                }, Array<Core.APIs.EFSHTTP.QuarantineReversion>>

                /**
                 * 申诉隔离区文档
                 */
                type Appeal = Core.APIs.OpenAPI<{
                    /**
                     * 申诉的文档docid
                     */
                    docid: string;

                    /**
                     * 申诉理由
                     */
                    reason: string;
                }, void>

                /**
                * 预览隔离区文档
                */
                type Preview = Core.APIs.OpenAPI<{
                    /**
                     * 预览的文件docid
                     */
                    docid: string;

                    /**
                     * 预览版本ID（不可为空）
                     */
                    rev: string;

                    /**
                     * 从存储服务器下载数据时的请求地址
                     */
                    reqhost?: string;

                    /**
                     * 是否使用https下载数据，默认为true
                     */
                    usehttps?: boolean;
                }, Core.APIs.EFSHTTP.QuarantinePreview>
            }
        }
    }
}