declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Contact {
                /**
                 * 获取所有联系人
                 */
                type GetGroups = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.ContactGroups>

                /**
                 * 获取分组下所有联系人
                 */
                type Get = Core.APIs.OpenAPI<{
                    /**
                     * 联系人组id
                     */
                    groupid: string;
                }, Core.APIs.EACHTTP.ContactUsers>;

                /**
                 * 搜索联系人和联系人组信息
                 */
                type Search = Core.APIs.OpenAPI<{
                    /**
                     * 搜索关键字
                     */
                    key: string;
                }, Core.APIs.EACHTTP.ContactSearchResult>;

                /**
                 * 新建联系人分组
                 */
                type AddGroup = Core.APIs.OpenAPI<{
                    /**
                     * 分组名称
                     */
                    groupname: string;
                }, Core.APIs.EACHTTP.ContactGroup.id>;

                /**
                 * 编辑联系人分组
                 */
                type EditGroup = Core.APIs.OpenAPI<{
                    /**
                     * 分组id
                     */
                    groupid: string;

                    /**
                     * 新分组名称
                     */
                    newname: string;
                }, void>;

                /**
                 * 新建联系人分组
                 */
                type DeleteGroup = Core.APIs.OpenAPI<{
                    /**
                     * 分组id
                     */
                    groupid: string;
                }, void>;

                /**
                 * 添加联系人到分组
                 */
                type AddPersons = Core.APIs.OpenAPI<{
                    /**
                     * 分组id
                     */
                    groupid: string;

                    /**
                     * 用户列表
                     */
                    userid: Array<string>;
                }, void>;


                /**
                 * 删除指定联系人
                 */
                type DeletePersons = Core.APIs.OpenAPI<{
                    /**
                     * 分组id
                     */
                    groupid: string;

                    /**
                     * 用户列表
                     */
                    userid: Array<string>;
                }, void>;

                /**
                 * 获取分组下所有联系人
                 */
                type GetPersons = Core.APIs.OpenAPI<{
                    /**
                     * 联系人组id
                     */
                    groupid: string;

                    /**
                     * 起始加载条目
                     */
                    start: number;

                    /**
                     * 一次性加载条目数
                     */
                    limit: number;

                }, Core.APIs.EACHTTP.ContactUsers2>;

                /**
                 * 搜索联系人
                 */
                type SearchPersons = Core.APIs.OpenAPI<{
                    /**
                     * 关键词
                     */
                    key: string;

                }, Core.APIs.EACHTTP.ContactSearchResult2>;
            }
        }
    }
}