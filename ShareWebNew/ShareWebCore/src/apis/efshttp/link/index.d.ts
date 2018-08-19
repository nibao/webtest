declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {

            namespace Link {

                /**
                 * 获取外链文件信息
                 */
                type Get = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 文件gns路径，通过文件夹外链访问文件信息时，需要该参数，默认为空
                         */
                        docid?: string;
                    },
                    Core.APIs.EFSHTTP.GetResult
                    >

                /**
                 * 获取外链信息
                 */
                type GetInfo = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * gns路径
                         */
                        docid?: string
                    },
                    Core.APIs.EFSHTTP.GetInfoResult
                    >

                /**
                 * 缩略图预览
                 */
                type Thumbnail = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 文件gns路径，通过文件夹外链获取缩略图时，需要该参数，默认为空
                         */
                        docid?: string;

                        /**
                         * 版本号，为空默认获取最新版本。
                         */
                        rev?: string;

                        /**
                         * 缩略图的高度
                         */
                        height: number;

                        /**
                         * 缩略图的宽度
                         */
                        width: number;

                        /**
                         * 缩略图质量，默认为75
                         */
                        quality: number;
                    },
                    Blob
                    >

                /**
                 * 浏览目录
                 */
                type ListDir = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 文件gns路径，通过文件夹外链访问子目录时，需要该参数，默认为空
                         */
                        docid?: string;

                        /**
                         * 指定按哪个字段排序
                         * 若不指定，默认按docid升序排序
                         * 说明：
                         * name，按文件名称（中文按拼音）排序
                         * size，按大小排序（目录按name升序）
                         * time，按服务器修改时间排序
                         */
                        by?: 'name' | 'size' | 'time';

                        /**
                         * 升序还是降序，默认为升序
                         * 说明：
                         * asc，升序
                         * desc，降序
                         */
                        sort?: 'asc' | 'desc';
                    },
                    Core.APIs.EFSHTTP.ListDirResult
                    >
                /**
                 * 获取文件
                 */
                type OSDownload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password?: string;

                        /**
                         * 文件gns路径，通过文件夹外链下载文件时，需要该参数，默认为空
                         */
                        docid?: string;

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
                    Core.APIs.EFSHTTP.LinkOSDownloadResult
                    >

                /**
                 * 外链视频播放
                 */
                type PlayInfo = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 文件gns路径，通过文件夹外链在线播放时，需要该参数，默认为空
                         */
                        docid?: string;

                        /**
                         * 版本号，为空默认获取最新版本
                         */
                        rev?: string;

                        /**
                         * 视频画质（音频音质），为空默认为原始画质
                         * 有效值：空； od；sd
                         */
                        definition?: string;
                    },
                    Core.APIs.EFSHTTP.PlayInfoResult
                    >

                /**
                 * 文档预览
                 */
                type PreviewOSS = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 文件gns路径，通过文件夹外链进行文档预览时，需要该参数，默认为空
                         */
                        docid?: string;

                        /**
                         * 需要预览的转换文件类型
                         * 默认参数pdf，获取转换后pdf文件的链接
                         * 参数html，获取转换后html打包文件的链接
                         */
                        type?: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载数据，默认为true
                         */
                        usehttps?: boolean;
                    },
                    Core.APIs.EFSHTTP.PreviewOSSResult
                    >

                /**
                 * 开始上传文件
                 */
                type OSBeginUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * gns（全局名字空间）路径，创建或者列举协议返回
                         * 说明：gns为待创建文件的父目录gns 
                         * 如果为空，默认在外链根目录下创建文件
                         */
                        docid?: string;

                        /**
                         * 整个文件的长度
                         */
                        length: number;

                        /**
                         * 文件名称，UTF8编码
                         * 说明：如果name 为空，docid需是已存在的文件gns
                         */
                        name?: string;

                        /**
                         * 由客户端设置的文件本地修改时间
                         */
                        client_mtime?: number;

                        /**
                         * 默认为1。
                         * 1:检查是否重命名，重名则抛异常
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: 1 | 3;

                        /**
                         * 向存储服务器上传数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 向存储服务器上传数据时的请求方法。
                         * 默认为“PUT”；参数值“POST”表示使用
                         * POST表单的方式上传
                         */
                        reqmethod?: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps: boolean
                    },
                    Core.APIs.EFSHTTP.OSBeginUploadResult
                    >

                /**
                 * 下载文件协议(不对外开放)
                 */
                type OSDownloadEXT = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 文件gns路径（列举协议返回）
                         */
                        docid: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 文件版本号，为空默认下载最新版本。
                         */
                        rev?: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载，默认为true
                         */
                        usehttps?: string;
                    },
                    Core.APIs.EFSHTTP.LinkOSDownloadResult
                    >

                /**
                 * 外链上传完成
                 */
                type OSEndUpload = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链ID
                         */
                        link: string;

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
                    },
                    Core.APIs.EFSHTTP.OSEndUploadResult
                    >

                /**
                 * 获取外链详细信息
                 */
                type GetDetail = Core.APIs.OpenAPI<
                    {
                        /**
                         * 文件gns路径（创建协议返回）
                         */
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.LinkDetail
                    >

                /**
                 * 修改外链
                 */
                type Set = Core.APIs.OpenAPI<
                    {
                        /**
                         * 待修改外链的对象gns路径
                         */
                        docid: string;

                        /**
                         * 如果true，返回密码，false，密码空
                         */
                        open: boolean;

                        /**
                         * 到期时间
                         * 如果entime对应的时间为：2015-10-16，15:30:33
                         * 后端会自动会将时间调整为：2015-10-1623:59:59
                         */
                        endtime: number;

                        /**
                         * 权限值，值域为[1,7]，具体说明参见开启外链中的描述
                         */
                        perm: number;

                        /**
                         * 外链使用次数。
                         * -1为无限制
                         * 不传默认-1
                         */
                        limittimes: number;
                    },
                    Core.APIs.EFSHTTP.LinkSetResult
                    >

                /**
                 * 开启外链
                 */
                type Open = Core.APIs.OpenAPI<
                    {
                        /**
                         * 待开启外链的对象gns路径
                         */
                        docid: string;

                        /**
                         * 如果true，返回密码，false，密码空
                         */
                        open?: boolean;

                        /**
                         * 到期时间
                         * 如果entime对应的时间为：2015-10-16，15:30:33
                         * 后端会自动会将时间调整为：2015-10-1623:59:59
                         */
                        endtime?: number;

                        /**
                         * 权限值，值域为[1,7]，具体说明参见开启外链中的描述
                         */
                        perm?: number;

                        /**
                         * 外链使用次数。
                         * -1为无限制
                         */
                        limittimes?: number;
                    },
                    Core.APIs.EFSHTTP.LinkOpenResult
                    >

                /**
                 * 关闭外链
                 */
                type Close = Core.APIs.OpenAPI<
                    {
                        /**
                         * 待关闭外链的对象gns路径
                         */
                        docid: string;
                    },
                    void
                    >

                /**
                 * 权限检查
                 */
                type ChecPerm = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * 权限值，值域为1、2、4，具体说明参见开启外链中的描述
                         */
                        perm: number;
                    },
                    Core.APIs.EFSHTTP.CheckPermResult
                    >

                /**
                 * 提取码获取外链 id 的协议
                 */
                type GetLinkByAccessCode = Core.APIs.OpenAPI<
                    {
                        /**
                         * 提取码
                         */
                        accesscode: string;
                    },
                    Core.APIs.EFSHTTP.GetLinkByAccessCodeResult
                    >

                /**
                 * 批量下载
                 */
                type BatchDownload = Core.APIs.OpenAPI<
                    {
                        /**
                         * zip压缩包名称
                         */
                        name: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost: string;

                        /**
                         * 上传是否使用https，默认为true
                         */
                        usehttps?: boolean;

                        /**
                         * 文件GNS数组
                         */
                        files?: Array<string>;

                        /**
                         * 文件夹GNS数组
                         */
                        dirs?: Array<string>;

                        /**
                         * 外链唯一标识
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;
                    },
                    Core.APIs.EFSHTTP.BatchDownloadResult
                    >

                /**
                 * 云端复制
                 */
                type Copy = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                         */
                        link: string;

                        /**
                         * 密码
                         */
                        password: string;

                        /**
                         * gns路径，通过文件夹外链复制其中的子对象时，需要该参数，默认为空
                         */
                        docid?: string;

                        /**
                         * 目标父对象的gns路径
                         */
                        destparent: string;

                        /**
                         * 1:检查是否重命名，重名则抛异常
                         * 2:默认值，如果重名冲突，自动重名
                         * 3:如果重名冲突，自动覆盖
                         */
                        ondup?: number
                    },
                    Core.APIs.EFSHTTP.LinkCopyResult
                    >

                /**
                 * 获取外链访问详情的文件列表
                 */
                type OpFiles = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链文件或文件夹gns路径（getlinked协议返回）
                         */
                        docid: string;

                        /**
                         * 开始位置，默认为0
                         */
                        start?: number;

                        /**
                         * 分页条数，默认为-1，返回start后面的所有记录
                         */
                        limit?: number;
                    },
                    Core.APIs.EFSHTTP.OpFilesResult
                    >

                /**
                 * 获取文件访问详情
                 */
                type OpStatistics = Core.APIs.OpenAPI<
                    {
                        /**
                         * 外链文件gns路径（getlinked协议返回）
                         */
                        link_docid: string;

                        /**
                         * 文件gns（opfiles协议返回）
                         */
                        file_docid: string;

                        /**
                         * 开始位置，默认为0
                         */
                        start?: number;

                        /**
                         * 分页条数，默认为-1，返回start后面的所有记录
                         */
                        limit?: number
                    },
                    Core.APIs.EFSHTTP.StatisticsResult
                    >

                /**
                * 获取我的外链
                */
                type GetLinked = Core.APIs.OpenAPI<
                    void,
                    Core.APIs.EFSHTTP.GetLinkedResult
                    >

                /**
                * 在线播放
                */
                type Play = Core.APIs.OpenAPI<
                    {
                        /**
                         * 转码文件id（外链在线播放请求返回）
                         */
                        docid: string;

                        /**
                         * 从存储服务器下载数据时的请求地址
                         */
                        reqhost?: string;

                        /**
                         * 是否使用https下载数据，默认为true
                         */
                        usehttps?: boolean
                    },
                    Blob
                    >

                /**
                * 获取视频缩略图
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
                * 获取视频缩略图
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
                 * 检查水印设置
                 */
                type CheckWatermark = Core.APIs.OpenAPI<
                    {
                        docid: string;
                    },
                    Core.APIs.EFSHTTP.CheckWatermarkResult
                    >
            }
        }
    }
}
