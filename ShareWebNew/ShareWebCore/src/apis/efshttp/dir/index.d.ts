declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {
            namespace Dir {

                /**
                 * 获取文档列表
                 */
                type List = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要浏览的目录的gns路径
                         */
                        docid: string,

                        /**
                         * 指定按哪个字段排序，若不指定，默认按docid升序排序
                         * 说明：
                         * name，按文件名称（中文按拼音）排序
                         * size，按大小排序（目录按name升序）
                         * time，按服务器修改时间排序
                         */
                        by?: 'name' | 'size' | 'time',

                        /**
                         * 升序还是降序，默认为升序
                         * 说明：
                         * asc，升序
                         * desc，降序
                         */
                        sort?: 'asc' | 'desc',

                        /**
                         * 默认为false,即不取文件或者目录属性信息,为true时,则取文件或者目录的属性信息
                         */
                        attr?: boolean
                    },
                    Core.APIs.EFSHTTP.Docs>

                /**
                 * 获取目录属性协议
                 */
                type Attribute = Core.APIs.OpenAPI<
                    {

                        /**
                         * 要浏览的目录的gns路径
                         */
                        docid: string
                    },
                    Core.APIs.EFSHTTP.DirAttributes
                    >

                /**
                 * 设置目录密级
                 */
                type SetCsfLevel = Core.APIs.OpenAPI<
                    {
                        /**
                         * 目录gns路径（列举协议返回）
                         */
                        docid: string;
                        /**
                         * 文件密级：5~15
                         */
                        csflevel: 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
                    },
                    Core.APIs.EFSHTTP.SetCsfLevel
                    >

                /**
                 *创建目录协议
                 */
                type Create = Core.APIs.OpenAPI<
                    {
                        /**
                         * 待创建目录的父目录gns路径
                         */
                        docid: string;

                        /**
                         * 目录名称，UTF8编码
                         */
                        name: string;

                        /**
                         * 老版本服务器（20141206）不处理该字段，仅当name不为空时才会生效
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup: 1 | 2 | 3;
                    },
                    Core.APIs.EFSHTTP.CreateResult
                    >

                /**
                 * 创建多级目录协议
                 */
                type CreateMultiLevelDir = Core.APIs.OpenAPI<
                    {
                        /**
                         * 待创建多级目录的父目录gns路径
                         */
                        docid: string;

                        /**
                         * 多级目录名称，UTF8编码
                         */
                        path: string;
                    },
                    Core.APIs.EFSHTTP.CreateMultiLevelDir
                    >

                /**
                 * 删除目录协议
                 */
                type Del = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要删除的目录gns路径
                         */
                        docid: string;
                    },
                    void
                    >

                /**
                 * 重命名目录协议
                 */
                type Rename = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要重命名的目录的gns路径
                         */
                        docid: string;

                        /**
                         * 该目录的新名称，UTF8编码
                         */
                        name: string;

                        /**
                         * 老版本服务器（20141206）不处理该字段
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         */
                        ondup?: 1 | 2;
                    },
                    Core.APIs.EFSHTTP.RenameResult | void
                    >
                /**
                 * 移动目录协议
                 */
                type Move = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要移动的目录gns路径
                         */
                        docid: string;

                        /**
                         * 目标父对象的gns路径
                         */
                        destparent: string;

                        /**
                         * 老版本服务器（20150508以前）不处理
                         * 1:检查是否重命名，重名则抛异常
                         * 2:默认值，如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: 1 | 2 | 3;
                    },
                    Core.APIs.EFSHTTP.MoveResult
                    >
                /**
                 * 复制目录协议
                 */
                type Copy = Core.APIs.OpenAPI<
                    {

                        /**
                         * 要复制的目录gns路径
                         */
                        docid: string;

                        /**
                         * 目标父对象的gns路径
                         */
                        destparent: string;

                        /**
                         * 老版本服务器（20150508以前）不处理，
                         * 1:检查是否重命名，重名则抛异常
                         * 2:默认值，如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: 1 | 2 | 3;
                    },
                    Core.APIs.EFSHTTP.DirCopyResult
                    >
                /**
                 * 复制目录进度查询协议
                 */
                type CopyProgress = Core.APIs.OpenAPI<
                    {
                        /**
                         * 复制任务的id
                         */
                        id: string;
                    },
                    Core.APIs.EFSHTTP.CopyProgressResult
                    >

                /**
                 * 获取创建目录的建议名称
                 */
                type GetSuggestName = Core.APIs.OpenAPI<
                    {

                        /**
                         * 父目录的gns路径
                         */
                        docid: string;

                        /**
                         * UTF-8编码，要上传的目录名
                         */
                        name: string;

                    },
                    Core.APIs.EFSHTTP.GetSuggestNameResult
                    >

                type Size = Core.APIs.OpenAPI<
                    {
                        /**
                         * 目录/文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 对于顶级目录： 如果为false，统计整个顶级目录的大小；如果为true，只统计其中回收的大小。默认为false.
                         */
                        onlyrecycle?: boolean;
                    },
                    Core.APIs.EFSHTTP.SizeResult
                    >

                type IsFileoutBox = Core.APIs.OpenAPI<
                    {
                        /**
                         * 目录/文件gns路径
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.IsFileoutBoxResult
                    >

                type CheckWatermark = Core.APIs.OpenAPI<
                    {
                        /**
                         * 目录/文件gns路径
                         */
                        docid: string
                    },
                    Core.APIs.EFSHTTP.CheckWatermarkResult
                    >
            }
        }
    }
}