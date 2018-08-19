declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace EntryDoc {

                /**
                 * 获取入口文档
                 */
                type Get = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.EntryDocs>


                /**
                 * 根据文档类型获取入口文档
                 */
                type GetByType = Core.APIs.OpenAPI<{
                    /**
                     * 入口文档类型
                     */
                    doctype: number;
                }, Core.APIs.EACHTTP.EntryDocsByType>


                /**
                 * 获取顶层文档分类视图
                 */
                type GetViews = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.Views>


                /**
                 * 获取文档类型
                 */
                type GetDocType = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.DocType>


                /**
                 * 退出入口文档
                 */
                type Quit = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, void>

                /**
                *加入入口文档
                */
                type Join = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, void>

                /**
                * 已退出的入口文档
                */
                type GetQuitInfos = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.QuitInfos>


                /**
                 * 获取入口文档信息（根据文档ID）
                 */
                type getByDocId = Core.APIs.OpenAPI<{
                    /**
                     * 入口文档id
                     */
                    docid: string
                }, Core.APIs.EACHTTP.EntryDocInfo>
            }
        }
    }
}