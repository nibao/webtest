declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {
            namespace Search {

                /**
                 * 按范围的搜索条件
                 */
                type Condition = {
                    /**
                     * 条件类型
                     */
                    condition: '=' | '>' | '<' | '[]',

                    /**
                     * 条件类型为 '='、'>'、'<'时需要
                     */
                    value?: number;

                    /**
                     * 条件类型为 '[]'时，区间右值
                     */
                    lvalue?: number;

                    /**
                     * 条件类型为 '[]'时，区间左值
                     */
                    rvalue?: number;
                }

                /**
                 * 自定义属性按范围搜索的条件
                 */
                type CustomCondition = Condition & {
                    /**
                     * 自定义属性的属性id
                     */
                    attr: number;

                    /**
                     * 自定义层级属性的层级数
                     */
                    level?: number;
                }

                /**
                 * 全文检索
                 */
                type Search = Core.APIs.OpenAPI<{

                    /**
                     * 分页加载起始位置
                     */
                    start: number;

                    /**
                     * 请求返回的查询记录条数
                     */
                    rows: number;

                    /**
                     * 高亮显示前缀
                     */
                    hlpre?: string;

                    /**
                     * 高亮显示后缀
                     */
                    hlpost?: string;

                    /**
                     * 0 查找range下的有权限文件;
                     * 1 查找range下的有权限文件和发现共享文件
                     * 2 查找range下的发现共享文件
                     */
                    style?: number;

                    /**
                     * 指定的某个目录下，具体为gns路径
                     * ```ts
                     * [] // 传空搜索所有目录
                     * [gns?//XXX/*] // 搜索目录及子目录 
                     * [gns?//XXX/] // 搜索目录不含子目录  
                     * ```
                     */
                    range?: ReadonlyArray<string>;

                    /**
                     * 文档修改时间范围的起始时间
                     */
                    begin?: number;

                    /**
                     * 文档修改时间范围的结束时间
                     */
                    end?: number;

                    /**
                     * 搜索关键字
                     */
                    keys?: string;

                    /**
                     * 搜索关键字有效字段(仅当keys不为空时有效)
                     * ```ts
                     * ['basename', 'content']
                     * ```
                     */
                    keysfields?: ReadonlyArray<'basename' | 'content'>;

                    /**
                     * 搜索匹配后缀，以点开头
                     * ```ts
                     * ['.exe', '.bat']
                     * ```
                     */
                    ext?: ReadonlyArray<string>;

                    /**
                     * 排序规则:默认按相关度排序
                     * ```ts
                     * 'size' // 按大小升序
                     * '-size' // 按大小降序
                     * 'modified' // 按修改时间升序
                     * '-modified' // 按修改时间降序
                     * ```
                     */
                    sort?: 'size' | '-size' | 'modified' | '-modified';

                    /**
                     * 按标签搜索
                     */
                    tags?: ReadonlyArray<string>;

                    /**
                     * 按标签文件大小搜索
                     */
                    size?: Condition;

                    /**
                     * 自定义属性搜索
                     */
                    customattr?: ReadonlyArray<CustomCondition>;

                    /**
                     * 创建时间
                     */
                    createtime?: Condition;

                }, Core.APIs.EFSHTTP.SearchResult>

                /**
                 * 标签补全协议
                 */
                type TagSuggest = Core.APIs.OpenAPI<
                    {
                        /**
                         * 需要建议的标签前缀，不能为空
                         */
                        prefix: string;

                        /**
                         * 需要建议的最大返回个数，大于0，默认是10
                         */
                        count?: number;
                    },
                    Core.APIs.EFSHTTP.TagSuggestResult
                    >

                /**
                 * 获取自定义属性协议
                 */
                type CustomAttribute = Core.APIs.OpenAPI<void, Core.APIs.EFSHTTP.CustomAttributeResult>
            }
        }
    }
}