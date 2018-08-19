declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {
            namespace Recycle {

                /**
                 * 浏览回收站资源协议
                 */
                type List = Core.APIs.OpenAPI<
                    {
                        /**
                         * 个人文档或者文档库的gns路径
                         */
                        docid: string,

                        /**
                         * 指定按哪个字段排序
                         * 若不指定，默认按docid升序排序
                         * 说明：
                         * name，按文件名称（中文按拼音）排序type，
                         * 按文件类型排序（目录按name升序）
                         * time，按删除时间排序
                         */
                        by?: 'name' | 'type' | 'time',

                        /**
                         * 升序还是降序，默认为升序
                         * 说明：
                         * asc，升序
                         * desc，降序
                         */
                        sort?: 'asc' | 'desc',

                        /**
                         * 按照文件名查找，默认为空，不进行过滤
                         */
                        name?: Array<string>,

                        /**
                         * 按照原位置查找，默认为空，不进行过滤
                         */
                        path?: Array<string>,

                        /**
                         * 按照删除者查找，默认为空，不进行过滤
                         */
                        editor?: Array<string>,

                        /**
                         * 开始位置，默认为0
                         */
                        start?: number,

                        /**
                         * 分页条数，默认为-1，返回start后面的所有记录
                         */
                        limit?: number
                    },
                    Core.APIs.EFSHTTP.ListResult
                    >

                /**
                 * 删除回收站资源协议
                 */
                type Del = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要删除的文件/目录在回收站的gns路径
                         */
                        docid: string;
                    },
                    void
                    >

                /**
                 * 删除回收站资源协议
                 */
                type Restore = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要还原的文件/目录在回收站的gns路径
                         * （可以是回收站的子目录或者子文件）
                         */
                        docid: string;

                        /**
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         */
                        ondup?: number;
                    },
                    Core.APIs.EFSHTTP.RestoreResult
                    >

                /**
                 * 获取回收站还原后的建议名称协议
                 */
                type GetSuggestName = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要还原的文件/目录在回收站的gns路径
                         * （可以是回收站的子目录或者子文件）
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.GetSuggestNameResult
                    >

                /**
                 * 设置回收站保留天数
                 */
                type SetRetentionDays = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要配置回收站删除时间的回收站gns路径
                         */
                        docid: string,

                        /**
                         * 配置的删除时间
                         */
                        days: number
                    },
                    void
                    >

                /**
                 * 获取回收站保留天数
                 */
                type GetRetentionDays = Core.APIs.OpenAPI<
                    {
                        /**
                         * 获取回收站删除时间的回收站gns路径
                         */
                        docid: string
                    },
                    {
                        /**
                         * 配置的删除时间
                         */
                        days: number
                    }
                    >
            }
        }
    }
}
