declare namespace Core {
    namespace APIs {
        namespace EACHTTP {
            namespace Department {
                /**
                 * 获取用户所能访问的根部门信息
                 */
                type GetRoots = Core.APIs.OpenAPI<void, Core.APIs.EACHTTP.Departments>


                /**
                 * 获取用户所能访问的根部门信息
                 */
                type GetSubDeps = Core.APIs.OpenAPI<{
                    /**
                     * 部门id
                     */
                    depid: string;
                }, Core.APIs.EACHTTP.Departments>;


                /**
                 * 获取用户所能访问的根部门信息
                 */
                type GetSubUsers = Core.APIs.OpenAPI<{
                    /**
                     * 部门id
                     */
                    depid: string;
                }, Core.APIs.EACHTTP.DepartmentUsers>


                /**
                 * 在组织下搜索用户和部门信息
                 */
                type DepartmentSearchResult = Core.APIs.OpenAPI<{
                    /**
                     * 搜索关键字
                     */
                    key: string
                }, Core.APIs.EACHTTP.DepartmentSearchResult>
            }
        }
    }
}