declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Owner {
                /**
                 * 检查是否是所有者
                 */
                type Check = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.OwnerCheckResult>

                /**
                 * 添加所有者（永久有效）
                 */
                type AddByEndTime = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 要设置的用户的id数组
                     */
                    userids: Array<string>;
                }, void>

                /**
                 * 批量设置所有者
                 */
                type Set = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 所有者用户信息
                     */
                    userconfigs: Array<{
                        /**
                         * 要设置的所有者id
                         */
                        useid: string;

                        /**
                         * 继承自路径
                         */
                        inheritpath: string;
                    }>;
                }, Core.APIs.EACHTTP.OwnerSetResult>

                /**
                 * 获取指定文档所有者信息
                 */
                type Get = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;
                }, Core.APIs.EACHTTP.OwnerInfos>

                /**
                * 删除所有者
                */
                type Delect = Core.APIs.OpenAPI<{
                    /**
                     * 文档id
                     */
                    docid: string;

                    /**
                     * 要设置的用户的id数组
                     */
                    userids: Array<string>;
                }, void>
            }
        }
    }
}