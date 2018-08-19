declare namespace Components {
    namespace QuotaSpace {
        type State = {
            /**
              * 所有文档已使用空间总额
              */
            totalUsed: number,

            /**
             * 所有文档配额空间总额
             */
            totalQuota: number,

            /**
             * 单个文档配额空间数组
             */
            quotaStackDatas: Array<{
                /**
                 * 已使用文档空间
                 */
                used: number,

                /**
                 * 文档配额空间
                 */
                doctype: string,

                /**
                 * 文档名称
                 */
                docname: string,

                /**
                 * 文档配额
                 */
                quota: string,

                /**
                 * 文档对用stack背景色
                 */
                background: string,
            }>,

            /**
             * 账户总体配额空间总数组
             */
            totalStackDatas: Array<{
                /**
                 * 文档名称
                 */
                docname: string,

                /**
                 * 已使用文档空间
                 */
                value: string,

                /**
                 * 文档对用stack背景色
                 */
                background: string,
            }>
        }
        interface Base {
            state: State
        }
    }

}