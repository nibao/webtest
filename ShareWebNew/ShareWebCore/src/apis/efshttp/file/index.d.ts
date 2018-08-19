declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {

            namespace File {

                /**
                 * 获取文件属性协议
                 */
                type Attribute = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string
                    },
                    Core.APIs.EFSHTTP.DocAttributes
                    >

                /**
                 * 在线播放请求协议
                 */
                type PlayInfo = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 版本号，为空默认获取最新版本
                         */
                        rev?: string;

                        /**
                         * 视频画质（音频音质），为空默认为原始画质有效值：空； od；sd
                         */
                        definition?: string;
                    },
                    Core.APIs.EFSHTTP.PlayInfoResult
                    >

                /**
                 * 文档预览协议
                 */
                type PreviewOSS = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 版本号，为空默认获取最新版本
                         */
                        rev?: string;

                        /**
                         * 需要预览的转换文件类型
                         * 默认参数pdf，获取转换后pdf文件的链接
                         * 参数html，获取转换后html打包文件的链接
                         */
                        type?: 'pdf' | 'html';

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载数据，默认为true
                         */
                        usehttps: boolean;

                        /**
                         * 是否增加水印，默认为true
                         */
                        watermark?: boolean;
                    },
                    Core.APIs.EFSHTTP.PreviewOSSResult
                    >

                /**
                 * 下载文件协议
                 */
                type OSDownload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 文件版本号，为空默认下载最新版本。
                         */
                        rev?: string;

                        /**
                         * 默认为空，在header中包含鉴权，
                         * QUERY_STRING，url中包含鉴权
                         */
                        authtype?: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载，默认为true
                         */
                        usehttps?: boolean;

                        /**
                         * 使用 QUERY_STRING方式下载时（浏览器），可以设置要保存的文件名
                         */
                        savename?: string;
                    },
                    Core.APIs.EFSHTTP.FileOSDownloadResult
                    >
                /**
                 * 获取元数据协议
                 */
                type MetaData = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 版本号，为空默认获取最新版本的元数据
                         */
                        rev?: string;
                    },
                    Core.APIs.EFSHTTP.MetaDataResult
                    >
                /**
                 * 获取上传文件的建议名称
                 */
                type GetSuggestName = Core.APIs.OpenAPI<
                    {
                        /**
                         * 父目录的gns路径
                         */
                        docid: string;

                        /**
                         * UTF-8编码，要上传的文件名
                         */
                        name: string;
                    },
                    Core.APIs.EFSHTTP.GetSuggestNameResult
                    >

                /**
                 * 开始上传文件协议
                 */
                type OSBeginUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * gns（全局名字空间）路径，创建或者列举协议返回
                         * 说明：如果name不为空，gns为待创建文件的父目录gns；否则为文件的gns
                         */
                        docid: string;

                        /**
                         * 整个文件的长度
                         */
                        length: number;

                        /**
                         * 文件名称，UTF8编码
                         * 说明：
                         * 1、如果为空，在父目录文件下生成版本；
                         * 2、如果不为空，在父目录下创建文件，同时生成版本
                         */
                        name?: string;

                        /**
                         * 由客户端设置的文件本地修改时间
                         * 创建新版本（rev为空或name为为空）时，写入版本
                         */
                        client_mtime?: number;

                        /**
                         * 老版本服务器（20141206）不处理该字段，仅当name不为空时才会生效
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: 1 | 2 | 3;

                        /**
                         * 向存储服务器上传数据时的请求方法。
                         * 默认为“PUT”；参数值“POST”表示使用POST表单的方式上传
                         */
                        reqmethod?: 'PUT' | 'POST';

                        /**
                         * 向存储服务器上传数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps?: boolean;

                        /**
                        * 文件密级预检查，要设置密级必须在osendupload中设置
                        * 0：默认值，不检查密级
                        * 5~15：正常密级
                        * 0x7FFF：空密级
                        */
                        csflevel?: 0 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15 | 0x7FFF;
                    },
                    Core.APIs.EFSHTTP.OSBeginUploadResult
                    >
                /**
                 * 上传文件完成协议
                 */
                type OSEndUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（创建协议返回）
                         */
                        docid: string;

                        /**
                         * 文件版本号
                         */
                        rev: string;

                        /**
                         * 文件MD5值
                         */
                        md5?: string;

                        /**
                         * 文件的CRC32校验码
                         */
                        crc32?: string;

                        /**
                         * 文件的slice_md5
                         */
                        slice_md5?: string;

                        /**
                         * 文件密级预检查，要设置密级必须在osendupload中设置
                         * 0：默认值，不检查密级
                         * 5~15：正常密级
                         * 0x7FFF：空密级
                        */
                        csflevel?: 0 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15 | 0x7FFF;
                    },
                    Core.APIs.EFSHTTP.OSEndUploadResult
                    >
                /**
                * 下载文件协议(不对外开放)
                */
                type OSDownloadEXT = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 文件版本号，为空默认下载最新版本。
                         */
                        rev?: string;

                        /**
                         * 默认为空，在header中包含鉴权，
                         * QUERY_STRING，url中包含鉴权
                         */
                        authtype?: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载，默认为true
                         */
                        usehttps?: string;

                        /**
                         * 使用 QUERY_STRING方式下载时（浏览器），可以设置要保存的文件名
                         */
                        savename?: string;
                    },
                    Core.APIs.EFSHTTP.FileOSDownloadResult
                    >
                /**
                 * 获取属性属性值
                 */
                type CustomAttributeValue = Core.APIs.OpenAPI<
                    {
                        /**
                         * 属性ID
                         */
                        attributeid: string;
                    },
                    Core.APIs.EFSHTTP.CustomAttributeValueResult
                    >
                /**
                 * 获取文件自定义属性
                 */
                type GetFileCustomAttribute = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.GetFileCustomAttributeResult
                    >
                /**
                 * 设置文件属性值
                 */
                type SetFileCustomAttribute = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径
                         */
                        docid: string;

                        /**
                         * 属性值数组
                         */
                        attribute: Array<CustomAttributeItem>
                    },
                    void
                    >

                /**
                 * 单条属性值
                 */
                type CustomAttributeItem = {
                    /**
                     * 属性ID
                     */
                    id: string;

                    /**
                     * 属性值
                     * type等于3时value类型为string，0为int array, 其余均为int
                     * 注： 时长单位为秒
                     */
                    value?: string | number | Array<number>;
                }

                /**
                 * 设置文件密级
                 */
                type setCsfLevel = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径
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
                 * 添加文件标签
                 */
                type AddTag = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 标签名
                         */
                        tag: string;
                    },
                    void
                    >

                /**
                 * 删除文件标签
                 */
                type DeleteTag = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 标签名
                         */
                        tag: string;
                    },
                    void
                    >
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
                 * 获取文件评论
                 */
                type GetComment = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string
                    },
                    Core.APIs.EFSHTTP.GetCommentResult
                    >

                /**
                 * 提交文件评论
                 */
                type SubmitComment = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 被回复者id 
                         */
                        answertoid?: string;

                        /**
                         * 评分
                         * 评论模式mode 为 2 或 3 时（包含评分功能），需要此项
                         * 默认为 -1，表示无评分
                         */
                        score?: number;

                        /**
                         * 评论内容评论模式mode 为 1 或 3 时（包含评论功能），需要此项默认为空
                         */
                        comment?: string;
                    },
                    void
                    >

                /**
                 * 删除文件评论
                 */
                type DeleteComment = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;
                        /**
                         * 评论id（由获取文件评论协议返回）
                         */
                        commentid: string;
                    },
                    void
                    >

                /**
                 * 重命名文件
                 */
                type Rename = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要重命名的文件gns路径
                         */
                        docid: string;

                        /**
                         * 重命名成功后的新文件名，UTF8编码
                         */
                        name: string;

                        /**
                         * 老版本服务器（20141206）不处理该字段，
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         */
                        ondup?: 1 | 2;
                    },
                    Core.APIs.EFSHTTP.RenameResult
                    >

                /**
                 * 移动文件
                 */
                type Move = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要移动的文件gns路径
                         */
                        docid: string;

                        /**
                         * 目标父对象的gns路径
                         */
                        destparent: string;

                        /**
                         * 老版本服务器（20141206）不处理该字段，
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         */
                        ondup?: 1 | 2 | 3;
                    },
                    Core.APIs.EFSHTTP.MoveResult
                    >
                /**
                 * 复制文件
                 */
                type Copy = Core.APIs.OpenAPI<
                    {
                        /**
                             * 要移动的文件gns路径
                             */
                        docid: string;

                        /**
                         * 目标父对象的gns路径
                         */
                        destparent: string;

                        /**
                         * 老版本服务器（20141206）不处理该字段，
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         */
                        ondup?: 1 | 2 | 3;
                    },
                    Core.APIs.EFSHTTP.FileCopyResult
                    >

                /**
                 * 删除文件
                 */
                type Del = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要删除文件的gns路径
                         */
                        docid: string;
                    },
                    void
                    >

                /**
                 * 获取应用元数据
                 */
                type GetAppmetadata = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 应用 id，由控制台配置后分配
                         */
                        appid: string;
                    },
                    Core.APIs.EFSHTTP.GetAppmetadataResult
                    >

                /**
                 * 转换路径协议
                 */
                type ConvertPath = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.ConvertPathResult
                    >

                /**
                 * 
                 */
                type AddTags = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 多个标签 
                         */
                        tags: Array<string>;
                    },
                    Core.APIs.EFSHTTP.AddTagsResult
                    >

                /**
                 * 文件及文件夹批量下载
                 */
                type BatchDownload = Core.APIs.OpenAPI<
                    {
                        /**
                         * zip压缩包名称
                         */
                        name: string;

                        /**
                         * 文件GNS数组
                         */
                        files?: Array<string>;

                        /**
                         * 文件夹GNS数组
                         */
                        dirs?: Array<string>;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps?: boolean;
                    },
                    Core.APIs.EFSHTTP.BatchDownloadResult
                    >

                /**
                 * 大文件切片上传
                 */
                type OSInitMultiUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * gns（全局名字空间）路径，创建或者列举
                         * 协议返回
                         * 说明：如果name不为空，gns为待创建文件的父目录gns；否则为文件的gns
                         */
                        docid: string;

                        /**
                         * 整个文件的长度
                         */
                        length: number;

                        /**
                         * 文件名称，UTF8编码
                         * 说明：1、如果为空，在父目录文件下生成版本；2、如果不为空，在父目录下创建文件，同时生成版本
                         */
                        name?: string;

                        /**
                         * 由客户端设置的文件本地修改时间
                         * 创建新版本（rev为空或name为为空）时，写入版本
                         */
                        client_mtime?: number;

                        /**
                         * 老版本服务器（20141206）不处理该字段，仅当name不为空时才会生效
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: 1 | 2 | 3;

                        /**
                         * 文件密级预检查，要设置密级必须在osendupload中设置
                         * 0：默认值，不检查密级
                         * 5~15：正常密级
                         * 0x7FFF：空密级
                         */
                        csflevel: 0 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15 | 0x7FFF;
                    },
                    Core.APIs.EFSHTTP.OSInitMultiUploadResult
                    >

                /**
                 * 上传大文件的分块完成协议
                 */
                type OSCompleteUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件的gns路径（创建协议返回）
                         */
                        docid: string;

                        /**
                         * 文件版本号
                         */
                        rev: string;

                        /**
                         * Multiupload事件Id
                         */
                        uploadid: string;

                        /**
                         * 分片信息
                         */
                        partinfo: Array<PartInfo>

                        /**
                         * 向存储服务器上传数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps?: string;
                    },
                    Core.APIs.EFSHTTP.OSCompleteUploadResult
                    >

                /**
                 * 分片信息
                 */
                type PartInfo = {
                    /**
                     * 存储服务器返回的分块的Etag值
                     */
                    partetag: string;

                    /**
                     * 分块的大小
                     */
                    partsize: string;
                }
                /**
                 * 上传大文件的分块协议
                 */
                type OSUploadPart = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件的gns路径（创建协议返回）
                         */
                        docid: string;

                        /**
                         * 文件版本号
                         */
                        rev: string;

                        /**
                         * Multiupload事件Id
                         */
                        uploadid: string;

                        /**
                         * 需要鉴权的数据块号，支持两种格式的组合，组合时以逗号分隔：
                         * 1. 以“-”连接的数据块区间
                         * 2. 单独的数据块号
                         * 如：1-100,2,3,4,23-120,130,288
                         */
                        parts: string;

                        /**
                         * 向存储服务器上传数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps?: boolean;
                    },
                    Core.APIs.EFSHTTP.OSUploadPartResult
                    >

                /**
                 * 获取文件历史版本协议
                 */
                type Revisions = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要列举版本的gns路径
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.RevisionsResult
                    >

                /**
                * 还原文件历史版本协议
                */
                type RestoreRevision = Core.APIs.OpenAPI<
                    {
                        /**
                         * 需要还原版本的文件gns路径
                         */
                        docid: string;

                        /**
                         * 版本号
                         */
                        rev?: string;
                    },
                    Core.APIs.EFSHTTP.RestoreRevisionResult
                    >

                /**
                * 对象存储的选项值
                */
                type OsOption = Core.APIs.OpenAPI<void, Core.APIs.EFSHTTP.OsOptionResult>

                /**
                * 上传文件更新协议
                */
                type OsUploadRefresh = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（创建协议返回）
                         */
                        docid: string;

                        /**
                         * 文件版本号
                         */
                        rev: string;

                        /**
                         * 默认为-1；不为-1时，更新版本的length为参数值
                         */
                        length?: number;

                        /**
                         * 默认为false;
                         * 参数为true，返回大文件分片上传需要的uploadid；
                         * 参数 为false，返回单文件上传需要的鉴权请求
                         */
                        multiupload?: boolean;

                        /**
                         * 采用单文件上传方式向存储服务器上传数据时的请求方法。
                         * 默认为“PUT”；参数值“POST”表示使用POST表单的方式上传
                         */
                        reqmethod?: string;

                        /**
                         * 向存储服务器上传数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps?: boolean;

                    },
                    Core.APIs.EFSHTTP.OsUploadRefreshResult
                    >

                /**
                * 秒传校验码协议
                */
                type PredUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 整个文件的长度
                         */
                        length: number;

                        /**
                         * 校验段校验码
                         */
                        slice_md5: string;

                    },
                    Core.APIs.EFSHTTP.PredUploadResult
                    >

                /**
                * 秒传文件协议
                */
                type Dupload = Core.APIs.OpenAPI<
                    {
                        /**
                         * gns（全局名字空间）路径，创建或者列举协议返回
                         */
                        docid: string;

                        /**
                         * 整个文件的长度
                         */
                        length: number;

                        /**
                         * 文件MD5值
                         */
                        md5: string;

                        /**
                         * 文件的CRC32校验码
                         */
                        crc32: string;

                        /**
                         * 文件名称，UTF8编码
                         */
                        name?: string;

                        /**
                         * 仅当name不为空时才会生效
                         * 1:检查是否重命名，重名则抛异常
                         * 2:如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: number;

                        /**
                         * 由客户端设置的文件本地修改时间
                         */
                        client_mtime?: number;

                        /**
                         * 文件密级
                         * 0：默认值，创建文件时文件密级设为创建者密级，覆盖版本时不改变密级
                         * 5~15：正常密级
                         * 0x7FFF：空密级
                         */
                        csflevel?: 0 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 15 | 0x7FFF;

                    },
                    Core.APIs.EFSHTTP.DuploadResult
                    >

                /**
                * 图片缩略图协议
                */
                type Thumbnail = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 缩略图的高度
                         */
                        height: number;

                        /**
                         * 缩略图的宽度
                         */
                        width: number;

                        /**
                         * 版本号，为空默认获取最新版本。
                         */
                        rev?: string;

                        /**
                         * 缩略图质量，默认为75
                         */
                        quality?: number;

                    },
                    Blob
                    >

                /**
                * 在线播放协议
                */
                type Play = Core.APIs.OpenAPI<
                    {
                        /**
                         * 转码文件id（在线播放请求协议返回）
                         */
                        docid: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载数据，默认为true
                         */
                        usehttps?: boolean;

                    },
                    Blob
                    >

                /**
                * 在线播放协议
                */
                type PlayThumbnail = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 版本号，为空默认获取最新版本
                         */
                        rev?: string;
                    },
                    Blob
                    >

                /**
                * 发送文件协议
                */
                type Send = Core.APIs.OpenAPI<
                    {
                        /**
                         * 要发送的文件gns路径
                         */
                        docid: string;

                        /**
                         * 收件人名字，为用户登录名，UTF8编码
                         */
                        recipients: string | Array<string>;
                    },
                    Core.APIs.EFSHTTP.SendResult
                    >

                /**
                * 由名字路径获取对象信息协议
                */
                type GetInfoByPath = Core.APIs.OpenAPI<
                    {
                        /**
                         * 名字路径，由顶级入口（个人文档/文档库/群组等）开始的对象全路径，以”/”分隔
                         */
                        namepath: string;
                    },
                    Core.APIs.EFSHTTP.GetInfoByPathResult
                    >

                /**
                * 设置应用元数据
                */
                type SetAppMetaData = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 应用 id，由控制台配置后分配
                         */
                        appid: string;

                        /**
                         * json 格式的应用元数据集合，key-value string 的形式
                         */
                        appmetadata: object;
                    },
                    void
                    >

                /**
                * 批量获取文件操作统计
                */
                type OpStatistics = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.OpStatisticsResult
                    >
            }
        }
    }
} 
