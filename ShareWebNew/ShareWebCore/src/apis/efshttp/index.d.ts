declare namespace Core {
    namespace APIs {
        namespace EFSHTTP {
            /**
             * 文档
             */
            interface Doc {
                /**
                 * 文档id
                 */
                docid: string;

                /**
                 * 文档名称
                 */
                name: string;

                /**
                 * 版本
                 */
                rev: string;

                /**
                 * 文件大小，-1表示文件夹
                 */
                size: number;

                /**
                 * 最后修改时间
                 */
                modified: number;

                /**
                 * 客户端修改时间
                 */
                client_mtime: number;

                /**
                 * 当前用户对文档的权限
                 */
                attr?: number;
            }

            /**
             * 文档属性
             */
            interface DocAttributes {
                /**
                 * 对于归档库文件，返回文件唯一标识
                 */
                uniqueid?: string;

                /**
                 * 文件创建者
                 */
                creator: string;

                /**
                 * 文件创建时，客户端设置的文件本地修改时间；若未设置，返回modified的值
                 */
                create_time: number;

                /**
                 * 文件密级，5~15
                 */
                csflevel: 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

                /**
                 * 文件的标签，字符串数组
                 */
                tags: Array<string>;

                /**
                 * 文件名，UTF8编码
                 */
                name: string;
            }

            /**
             * 列举出的文档列表
             */
            interface Docs {
                dirs: Array<Doc>;
                files: Array<Doc>;
            }

            /**
             * 视频播放信息
             */
            interface PlayInfo {
                /**
                 * 转码状态：
                 * 0.未开始转码
                 * 1.正在转码
                 * 2.转码完成
                 */
                status: number;

                /**
                 * 原始画质（音质）：
                 * 0.无此分辨率；
                 * 1.已转码
                 */
                odstat: number;

                /**
                 * 标清
                 * 0.无此分辨率；
                 * 1.已转码
                 */
                sdstat: number;

                /**
                 * 转码文件的唯一标识id
                 */
                docid: string;

                /**
                 * 转码剩余时间（秒），status为1时返回
                 */
                remainingTime: number;
            }

            /**
             * 目录属性
             */
            interface DirAttributes {
                /**
                 * 目录创建者
                 */
                creator: string;
                /**
                 * 目录创建的服务端时间
                 */
                create_time: number;
                /**
                 * 目录的修改时间
                 */
                modified: number;
                /**
                 * 目录名，UTF8编码
                 */
                name: string;
            }


            interface SearchedDoc {

                /**
                 * 是否有权限访问,1为有权限,0为无权限
                 */
                access: number;

                /**
                 * 文件名(不包括扩展名)
                 */
                basename: string;

                /**
                 * 
                 */
                created: number;

                /**
                 * 创建人
                 */
                creator: string;

                /**
                 * 文件密级
                 */
                csflevel: number;

                /**
                 * gns路径
                 */
                docid: string;

                /**
                 * 文件创建者
                 */
                editor: string;

                /**
                 * 文件扩展名
                 */
                ext: string;

                /**
                 * 文件修改时间
                 */
                modified: number;

                /**
                 * 父目录
                 */
                parentpath: string;

                /**
                 * 自动标签匹配权重
                 */
                score: number;

                /**
                 * 文件大小
                 */
                size: number;

                /**
                 * 版本的标签字符串数组
                 */
                tags: ReadonlyArray<string>;

                /**
                 * 发现者名称:如果有返回且不为空,说明该文档是发现文档
                 */
                sharer: string;
            }

            // ---
            // 全文检索
            // ---

            /**
             * 搜索结果高亮部分
             */
            interface SearchHighlighting {
                /**
                 * 文件名的高亮部分
                 */
                basename: ReadonlyArray<string>;

                /**
                 * 内容的高亮部分
                 */
                content: ReadonlyArray<string>;
            }

            /**
             * 全文检索返回结果
             */
            interface SearchResult {

                /**
                 * 搜索结果高亮部分
                 */
                highlighting: {
                    [key: string]: SearchHighlighting;
                };

                /**
                 * 全文检索结果
                 */
                response: {
                    /**
                     * 返回各个文档的信息
                     */
                    docs: ReadonlyArray<SearchedDoc>;

                    /**
                     * 返回检索中总数(查询第一页时返回)
                     */
                    hits: number;

                    /**
                     * 返回下次发起请求的start
                     */
                    next: number;
                }
            }

            /**
             * 设置密级返回结果
             */
            interface SetCsfLevel {
                /**
                 * 0表示没有密级变化或者成功设置； 1表示申请已提交
                 */
                result: 0 | 1
            }

            /**
             * 创建目录返回
             */
            interface CreateResult {
                /**
                 * 创建的目录的gns路径
                 */
                docid: string;
                /**
                 * 数据变化标识
                 */
                rev: string;
                /**
                 * 创建时间，UTC时间，此为服务器时间
                 */
                modified: number;

                /**
                 * UTF8编码，仅当ondup为2时才返回
                 */
                name?: string;
            }

            /**
             * 创建多级目录协议 返回
             */
            interface CreateMultiLevelDir {
                /**
                 * 创建的多级目录最后一级的gns路径
                 */
                docid: string;
                /**
                 * 数据变化标识
                 */
                rev: string;
                /**
                 * 创建时间，UTC时间，此为服务器时间
                 */
                modified: number;
            }

            /**
             * 重命名目录协议返回
             */
            interface RenameResult {
                /**
                 * UTF8编码，仅当ondup为2时才返回，否则返回参数仍然为空
                 */
                name?: string;
            }

            /**
             * 移动目录协议返回
             */
            interface MoveResult {
                /**
                 * 返回新的gns路径
                 */
                docid: string;

                /**
                 * UTF8编码，仅当ondup为2时才返回，否则返回参数仍然为空
                 */
                name?: string;
            }
            /**
             * 复制文件协议返回
             */
            interface CopyResult {

                /**
                 * 返回复制后的gns路径
                 */
                docid: string;

                /**
                 * UTF8编码，仅当ondup为2时才返回，否则返回参数仍然为空
                 */
                name?: string;
            }

            /**
             * 复制目录协议返回
             */
            interface DirCopyResult extends CopyResult {

                /**
                 * 发起复制任务后，返回任务ID,用于查询复制任务进度信息
                 */
                id: string;

            }

            /**
             * 文件复制协议返回
             */
            interface FileCopyResult extends CopyResult { }

            /**
             * 复制目录进度查询协议返回
             */
            type CopyProgressResult = {

                /**
                 * 是否查询成功
                 */
                success: boolean;

                /**
                 * 如果查询成功，返回总文件个数
                 */
                filecount?: number;

                /**
                 * 如果查询成功，返回总目录个数
                 */
                dircount?: number;

                /**
                 * 如果查询成功，返回已复制的文件个数
                 */
                filecopied?: number;

                /**
                 * 如果查询成功，返回已复制的目录个数
                 */
                dircopied?: number;

                /**
                 * 如果查询成功，返回总大小
                 */
                size?: number;

                /**
                 * 如果查询成功，返回已复制的大小
                 */
                sizecopied?: number;

                /**
                 * 如果查询成功，返回正在复制的文件名
                 */
                filecoping?: string;

                /**
                 * 如果查询成功，返回复制源位置的父目录名称，如果为根目录，返回空
                 */
                source?: string;

                /**
                 *如果查询成功，返回复制目标父目录的名称 
                 */
                destination?: string;
            }

            /**
             * 获取回收站还原后的建议名称协议
             */
            interface GetSuggestNameResult {
                /**
                 * UTF8编码，服务端如果不存在同名的name，则直接返回name；如果存在同名的name，则根据重名冲突策略找到不冲突的文件名
                 */
                name: string;

            }

            /**
             * 获取目录大小协议
             */
            interface SizeResult {

                /**
                 * 总目录数
                 */
                dirnum: number;

                /**
                 * 总文件数
                 */
                filenum: number;

                /**
                 * 回收站大小
                 */
                recyclesize: number;

                /**
                 * 总大小
                 */
                totalsize: number;
            }

            /**
             * 在线播放请求协议结果返回
             */
            interface PlayInfoResult {
                /**
                 * 转码状态:0 未开始转码；1 正在转码；2转码完成
                 */
                status: 0 | 1 | 2;

                /**
                 *  原始画质（音质）：0无此分辨率；1已转码
                 */
                odstat: 0 | 1;

                /**
                 *标清：0无此分辨率；1已转码 
                 */
                sdstat: 0 | 1;

                /**
                 * 转码文件的唯一标识id
                 */
                docid: string;

                /**
                 * 转码剩余时间（秒），status为1时返回
                 */
                remainingTime?: number;

            }

            /**
             * 文档预览协议 
             */
            interface PreviewOSSResult {
                /**
                 * 所预览文件的大小
                 */
                size: number;

                /**
                 * 下载转换后文件的url(15分钟过期)
                 */
                url: string;
            }
            /**
            * 获取文件返回
            */
            interface OSDownloadResult {
                /**
                 * 版本号
                 */
                rev: string;

                /**
                 * 版本所对应文件的最新名称
                 */
                name: string;

                /**
                 * 当前下载版本的总大小
                 */
                size: number;
            }

            /**
             * 下载文件协议
             */
            interface FileOSDownloadResult extends OSDownloadResult {
                /**
                 * 编辑者名称， UTF8编码
                 */
                editor: string;

                /**
                 * 上传时间， UTC时间，此为上传版本时的服务器时间
                 */
                modified: number;

                /**
                 * 由客户端设置的文件本地修改时间下载第0块时返回，若未设置，返回modified的值
                 */
                client_mtime: number;

                /**
                 * 包括：
                 * method: 请求方法（必需）
                 * url: 待上传的资源URL（必需）
                 * authorization: 鉴权信息（非必需）
                 * date: 服务器GMT格式时间（非必需）
                 */
                authrequest: [
                    /**
                     * method
                     */
                    string,

                    /**
                     * url
                     */
                    string,

                    /**
                     * authorization
                     */
                    string,

                    /**
                     * date
                     */
                    number
                ];
            }

            /**
             * 外链下载文件协议返回
             */
            interface LinkOSDownloadResult extends OSDownloadResult {
                /**
                 * 包括：
                 * method: 请求方法（必需）
                 * url: 待上传的资源URL（必需）
                 * authorization: 鉴权信息（非必需）
                 * date: 服务器GMT格式时间（非必需）
                 */
                authrequest: [
                    /**
                     * method
                     */
                    string,

                    /**
                     * url
                     */
                    string
                ];
            }

            /**
             * 	获取元数据协议返回
             */
            type MetaDataResult = {
                /**
                 * 文件版本ID
                 */
                rev: string;

                /**
                 * 文件版本上传时文件名称，UTF8编码
                 */
                name: string;

                /**
                 * 文件版本上传编辑者名称，UTF8编码
                 */
                editor: string;

                /**
                 * 文件版本上传时间，UTC时间，此为上传版本时的服务器时间
                 */
                modified: number;

                /**
                 * 文件版本的大小
                 */
                size: string;

                /**
                 * 文件版本的归属站点
                 */
                site: string;

                /**
                 * 由客户端设置的文件本地修改时间若未设置，返回modified的值
                 */
                client_mtime: string;

                /**
                 * 版本的标签，字符串数组
                 */
                tags: Array<string>;
            }

            /**
             * 开始上传文件协议
             */
            interface OSBeginUploadResult {
                /**
                 * 文件的gns路径
                 */
                docid: string;

                /**
                 * 文件名称，UTF8编码，创建版本时返回
                 */
                name: string;

                /**
                 * 文件版本号
                 */
                rev: string;

                /**
                 * 包括：
                 * method: 请求方法（必需）
                 * url: 待上传的资源URL（必需）
                 * authorization: 鉴权信息（非必需）
                 * date: 服务器GMT格式时间（非必需）
                 */
                authrequest: [
                    /**
                     * method
                     */
                    string,

                    /**
                     * url
                     */
                    string,

                    /**
                     * authorization
                     */
                    string,

                    /**
                     * date
                     */
                    number
                ]
            }

            /**
             * 上传文件完成协议返回
             */
            interface OSEndUploadResult {
                /**
                 * 编辑者
                 */
                editor: string;

                /**
                 * 上传时间，UTC时间，此为上传版本完成时的服务器时间
                 */
                modified: number;
            }

            /**
             * 获取属性属性值返回
             */
            interface CustomAttributeValueResult {
                /**
                 * 属性值ID
                 */
                id: string;

                /**
                 * 属性值名称
                 */
                name: string;

                /**
                 * 属性值层级
                 */
                level: number;

                /**
                 * 属性值子属性：包括以上三个字段的数组
                 */
                child?: Array<number | string>;
            }
            /**
             * 获取文件自定义属性返回
             */
            interface GetFileCustomAttributeResult {
                /**
                 * 属性名称
                 */
                name: string;

                /**
                 * 属性唯一ID
                 */
                id: string;

                /**
                 * 属性值
                 * type等于1、3时value类型为string，0为string array, 其余均为int
                 * 属性值为空时不存在此字段
                 */
                value: Array<FileCustomAttributeValue>;
            }

            /**
             * 属性值
             */
            interface FileCustomAttributeValue {
                /**
                 * 属性值ID
                 * type等于0或1时存在。0时是int array
                 */
                valueid: number | Array<number>;

                /**
                 * 属性类型
                 * 0：层级 1：枚举 2：数字 3：文本 4：时间 （秒）
                 */
                type: 0 | 1 | 2 | 3 | 4;
            }

            /**
             * 标签补全协议返回
             */
            interface TagSuggestResult {
                /**
                 * 建议的标签字符串数组
                 */
                suggestions: Array<string>;
            }

            /**
             * 获取文件评论
             */
            interface GetCommentResult {
                /**
                 * 评论模式
                 * 0. 未启用评论和评分
                 * 1. 只启用评论
                 * 2. 只启用评分
                 * 3. 同时启用评论和评分
                 */
                mode: 0 | 1 | 2 | 3;

                /**
                 * 总评分
                 * mode 为 2 或 3 时，返回此项
                 */
                averagescore?: number;

                /**
                 * 用户是否已经评分
                 * mode 为 2 或 3 时，返回此项
                 */
                hasscored: boolean;

                /**
                 * 评论内容的数组
                 * mode 不为 0 时，返回此项
                 */
                comments?: Array<FileComment>;
            }

            /**
             * 获取文件评论内容
             */
            interface FileComment {
                /**
                 * 评论id
                 */
                id: string;

                /**
                 * 评论人
                 */
                commentator: string;

                /**
                 * 评论人id
                 */
                commentatorid: string;

                /**
                 * 被回复者，无被回复者时，该项为空mode 为 1 或 3 时，返回此项
                 */
                answerto: string;

                /**
                 * 评分mode 为 2 或 3 时，返回此项默认为-1，表示未评分
                 */
                score: number;

                /**
                 * 评论内容
                 * mode 为 1 或 3 时，返回此项
                 * 默认为空，表示无评分内容
                 */
                comment: string;

                /**
                 * 评论的时间戳，UTC时间，精确到微秒
                 */
                time: number;
            }

            /**
             * 获取应用元数据返回
             */
            interface GetAppmetadataResult {
                /**
                 * 应用 id
                 */
                appid: string;

                /**
                 * 应用名
                 */
                appname: string;

                /**
                 * json 格式的应用元数据集合，key-value string 的形式
                 */
                appmetadata: any;
            }

            /**
             * 转换路径协议返回
             */
            interface ConvertPathResult {
                /**
                 * 名字路径
                 */
                namepath: string;
            }

            /**
             * 添加文件多个标签返回参数
             */
            interface AddTagsResult {
                /**
                 * 由于标签数量限制未设置成功的标签数
                 */
                unsettagnum: number;

                /**
                 * ..unhandler
                 */
                unsettags: Array<string>;
            }

            /**
             * 文件及文件夹批量下载返回
             */
            interface BatchDownloadResult {
                /**
                 * url请求方法
                 */
                method: string;

                /**
                 * 文件批量下载地址
                 */
                url: string;
            }

            /**
             * 开始上传大文件协议返回
             */
            interface OSInitMultiUploadResult {
                /**
                 * 文件的gns路径
                 */
                docid: string;

                /**
                 * 文件名称，UTF8编码，创建版本时返回
                 */
                name: string;

                /**
                 * 文件版本号
                 */
                rev: string;

                /**
                 * 标识本次Multipart Upload事件
                 */
                uploadid: string;
            }

            /**
             * 上传大文件的分块完成协议 返回
             */
            interface OSCompleteUploadResult {
                /**
                 * 包括：
                 * method: 请求方法（必需）
                 * url: 待上传的资`）
                 */
                authrequest: [
                    /**
                    * method
                    */
                    string,

                    /**
                     * url
                     */
                    string
                ];
            }

            /**
             * 上传大文件的分块协议返回
             */
            interface OSUploadPartResult {
                /**
                 * 包括一个或者多个authrequest数组，每个数组的key为数据块号：
                 * method: 请求方法（必需）
                 * url: 待上传的资源URL（必需）
                 * authorization: 鉴权信息（非必需）
                 * date: 服务器GMT格式时间（非必需）
                 */
                authrequests: [
                    /**
                     * method
                     */
                    string,

                    /**
                     * url
                     */
                    string,

                    /**
                     * authorization
                     */
                    string,

                    /**
                     * date
                     */
                    number
                ]
            }

            /**
             * 获取文件历史版本协议返回
             */
            interface RevisionsResult {
                /**
                 * 版本号
                 */
                rev: string;

                /**
                 * 版本所对应文件的最新名称
                 */
                name: string;

                /**
                 * 版本编辑者名称
                 */
                editor: string;

                /**
                 * 版本上传时间，UTC时间，此为上传版本时记录的服务器时间
                 */
                modified: number;

                /**
                 * 版本的大小
                 */
                size: number;

                /**
                 * 由客户端设置的文件本地修改时间若未设置，返回modified的值
                 */
                client_mtime: number;
            }


            /**
             * 还原历史版本信息返回
             */
            interface RestoreRevisionResult {
                /**
                 * 新的版本号
                 */
                rev: string;

                /**
                 * 版本所对应文件的名称
                 */
                name: string;

                /**
                 * 版本编辑者名称
                 */
                editor: string;

                /**
                 * UTC时间，此为还原产生新版本时的服务器时间
                 */
                modified: number;
            }

            /**
             * 浏览回收站资源协议返回参数的单个文件信息
             */
            interface ListResult {
                /**
                 * 回收站中文件/目录的gns路径
                 */
                docid: string,

                /**
                 * 回收站中文件/目录的原路径，UTF8编码
                 */
                path: string,

                /**
                 * 回收站中文件/目录的名称，UTF8编码
                 */
                name: string,

                /**
                 * 回收站中文件/目录删除者的名称
                 */
                editor: string,

                /**
                 * 回收站中文件/目录的删除时间
                 */
                modified: number,

                /**
                 * 回收站中文件的大小，目录大小为-1
                 */
                size: number
            }

            /**
             *  获取外链文件信息 返回
             */
            interface GetResult {
                /**
                 * 文件名
                 */
                name: string;

                /**
                 * 文件大小
                 */
                size: number;

                /**
                 * 修改时间
                 */
                modified: number;

                /**
                 * 按位存储的权限值（返回的是十进制），获取该值后，需要转化成二级制，检查对应的位码是否被设置。
                 * 右数第一位表示该外链可以被预览
                 * 右数第二位表示该外链可以被下载
                 * 右数第三位表示该外链可以上传文件
                 * 例如：返回1表示只能被预览
                 * 返回2表示只能被下载
                 * 返回4表示只能上传文件
                 * 返回3表示可被预览和下载
                 */
                perm: number;
            }

            /**
             * 获取外连信息 返回
             */
            interface GetInfoResult {
                /**
                 * 文件或文件夹名
                 */
                name: string;

                /**
                 * 修改时间
                 */
                modified: number;

                /**
                 * 文件大小，文件夹为-1
                 */
                size: number;
            }

            /**
             * 浏览目录返回参数
             */
            interface ListDirResult {
                /**
                 * 目录中文件/目录的gns路径
                 */
                docid: string;

                /**
                 * 目录中文件/目录的名称，UTF8编码
                 */
                name: string;

                /**
                 * 目录中文件版本号或目录数据变化标识
                 */
                rev: string;

                /**
                 * 目录中文件的大小，目录大小为-1
                 */
                size: number;

                /**
                 * 目录修改时间/文件上传时间，UTC时间，此为文件上传到服务器时间
                 */
                modified: number;

                /**
                 * 如果是文件，返回由客户端设置的文件本地修改时间
                 * 若未设置，返回modified的值
                 */
                client_mtime: number;
            }

            /**
             * 获取外链开启信息 返回
             */
            interface LinkDetail {
                /**
                 * 外链唯一标识，如FC5E038D38A57032085441E7FE7010B0
                 */
                link: string;

                /**
                 * 密码，空表示没有
                 */
                password: string;

                /**
                 * 到期时间，如果为-1，表示无限期，表示从1970-01-01,00-00-00至今的时间
                 */
                endtime: number;

                /**
                 * 按位存储的权限值（返回的是十进制），获取该值后，需要转化成二级制，检查对应的位码是否被设置。
                 * 右数第一位表示该外链可以被预览
                 * 右数第二位表示该外链可以被下载
                 * 例如：返回1表示只能被预览
                 * 返回2表示只能被下载
                 * 返回3表示可被预览和下载
                 */
                perm: number;

                /**
                 * 外链使用次数。
                 * -1为无限制
                 */
                limittimes: number;
            }

            /**
             * 	开启外链 返回
             */
            interface LinkOpenResult extends LinkDetail {
                /**
                 * 0，请求已生效，返回为最新信息
                 * 1，请求正在审核，返回为更改前信息
                 */
                result: 0 | 1;
            }

            /**
             * 修改外链 返回
             */
            interface LinkSetResult extends LinkDetail {
                /**
                 * 0，请求已生效，返回为最新信息
                 * 1，请求正在审核，返回为更改前信息
                 */
                result: 0 | 1;
            }


            /**
             * 外链信息
             */
            interface LinkInfo {
                /**
                 * 文档名
                 */
                name: string;

                /**
                 * 外链权限，1表示只能被预览，2表示只能被下载，3表示可被预览和下载，
                 */
                perm: number;

                /**
                 * 文件大小
                 */
                size: number;

                /**
                 * 最后修改时间
                 */
                modified: number;
            }

            /**
             * 权限检查返回
             */
            interface CheckPermResult {

                /**
                 * 0，请求已生效，返回为最新信息
                 * 1，请求正在审核，返回为更改前信息
                 */
                result: 0 | 1;
            }

            /**
             * 提取码获取外链 id 的协议 返回
             */
            interface GetLinkByAccessCodeResult {
                /**
                 * 外链 id，如果提取码对应的外链id不存在，返回空字符串
                 */
                link: string;
            }

            /**
             * 外链转存相应
             */
            interface LinkCopyResult extends CopyResult {
                /**
                 * 发起复制任务后，如果复制对象为目录，返回任务ID,用于查询复制任务进度信息
                 */
                id: string;
            }

            /**
             * 外链访问详情文件列表响应
             */
            interface OpFilesResult {
                /**
                 * 文件信息数组
                 */
                files: Array<OpenFileResult>;
            }

            /**
             * 单条外链访问详情
             */
            interface OpenFileResult {
                /**
                 * 文件gns
                 */
                docid: string;

                /**
                 * 文件名
                 */
                name: string;

                /**
                 * 文件路径，以外链文件或文件夹为根
                 */
                path: string;
            }

            /**
             * 外链访问详情文件访问详情
             */
            interface StatisticsResult {
                /**
                 * 统计信息数组
                 */
                statistics: Array<Object>;
            }

            interface StatisticResult {
                /**
                 * 文件gns
                 */
                docid: string;

                /**
                 * 文件名
                 */
                name: string;

                /**
                 * 文件路径，以外链文件或文件夹为根
                 */
                path: string;
            }


            /**
             * 隔离区入口文档
             */
            interface QuarantineDocs {
                /**
                 * 文件位于隔离区的docid
                 */
                docid: string;

                /**
                 * 文件被隔离时最新名字
                 */
                name: string;

                /**
                 * 文件被隔离时所在路径
                 */
                parentpath: string;

                /**
                 * 文件申诉保护到期日（UNIX时间戳）
                 */
                appealexpiredtime: number;

                /**
                 * 文件状态：
                 * 1 未申诉
                 * 2 已申诉
                 * 3 已否决
                 */
                status: number;

                /**
                 * 服务器端时间戳
                 */
                servertime: number;
            }

            /**
             * 隔离区文档版本信息
             */
            interface QuarantineReversion {
                /**
                 * 版本id
                 */
                versionid: string;

                /**
                 * 版本名称
                 */
                versionname: string;

                /**
                 * 版本修改者名称
                 */
                modifier: string;

                /**
                 * 版本修改时间
                 */
                modified: number;

                /**
                 * 版本隔离原因
                 */
                reason: string;
            }

            /**
             * 隔离区文档预览信息
             */
            interface QuarantinePreview {
                /**
                 * 所预览文件的大小
                 */
                size: number;

                /**
                 * 下载转换后文件的url(15分钟过期)
                 */
                url: string;
            }

            /** 
             * 收藏列表list结果
             */
            interface FavoritesInfo {
                /**
                 * 文件/目录的gns路径
                 */
                docid: string;

                /**
                 * 文件/目录的名称
                 */
                name: string;

                /**
                 * 文件/目录的name路径
                 */
                path: string;

                /**
                 * 文件的大小，目录大小为-1
                 */
                size: number;

                /**
                 * 	文件/目录创建者 
                 */
                creator: string;

                /**
                 * 	文件/目录创建时间
                 */
                create_time: number;

                /**
                 * 文件/文件编辑者
                 */
                editor: string;

                /**
                 * 目录修改时间/文件上传时间，UTC时间，此为文件上传到服务器时间
                 */
                modified: number;

                /**
                 * 文件的客户端修改时间
                 */
                client_mtime?: number;
            }

            /* 
            * 收藏状态查询结果
            */
            interface FavoritedInfo {
                /**
                 * 文件/目录的gns路径
                 */
                docid: string;

                /**
                 * 文件或文件夹是否被收藏
                 */
                favorited: boolean;
            }

            /* 
            * 检查是否是发件箱协议
            */
            interface IsFileoutBoxResult {
                /**
                 * 文件/目录的gns路径
                 */
                isfileoutbox: boolean;
            }

            /* 
            * 对象存储的选项值
            */
            interface OsOptionResult {
                /**
                 * 大文件分片上传，除最后一块外，其它分片的最小值
                 */
                partminsize: number;

                /**
                 * 大文件分片上传，除最后一块外，其它分片的最大值
                 */
                partmaxsize: number;

                /**
                 * 大文件分片上传，最大的分片数量
                 */
                partmaxnum: number;
            }

            /* 
            * 上传文件更新协议
            */
            interface OsUploadRefreshResult {
                /**
                 * 标识本次Multipart Upload事件
                 */
                uploadid?: string;

                /**
                 * 鉴权需要的信息
                 */
                authrequest?: [
                    /**
                     * method
                     */
                    string,

                    /**
                     * url
                     */
                    string,

                    /**
                     * authorization
                     */
                    string,

                    /**
                     * date
                     */
                    number
                ];
            }

            /* 
            * 秒传文件协议
            */
            interface DuploadResult {
                /**
                 * 是否有可能存在
                 */
                match: boolean;
            }

            /* 
            * 秒传校验码协议
            */
            interface PredUploadResult {
                /**
                 * 秒传是否成功
                 */
                success: boolean;

                /**
                 * 文件的gns路径
                 */
                docid?: string;

                /**
                 * 文件名称，UTF8编码
                 */
                name?: string;

                /**
                 * 编辑者名称，UTF8编码，秒传成功则返回
                 */
                editor?: string;

                /**
                 * 上传时间，UTC时间，此为上传版本时的服务器时间，秒传成功则返回
                 */
                modified?: number;

                /**
                 * 文件版本号
                 */
                rev?: string;
            }

            /* 
            * 发送文件协议
            */
            interface SendResult {
                /**
                 * 表示多条发送文件的返回信息
                 */
                result: Array<{
                    /**
                     * 收件人名字
                     */
                    recipient: string;

                    /**
                     * 发送是否成功
                     */
                    success: boolean;

                    /**
                     * 发送成功时为空；否则为错误信息
                     */
                    msg: string;

                    /**
                     * 发送成功时为空；否则为详细错误信息
                     */
                    causemsg: string;
                }>;
            }

            /* 
            * 由名字路径获取对象信息协议
            */
            interface GetInfoByPathResult {
                /**
                 * 文件/目录的gns路径
                 */
                docid: string;

                /**
                 * 文件/目录的名称，UTF8编码
                 */
                name: string;

                /**
                 * 文件版本号或目录数据变化标识
                 */
                rev: string;

                /**
                 * 文件的大小，目录大小为-1
                 */
                size: number;

                /**
                 * 目录修改时间/文件上传时间，
                 * UTC时间，此为文件上传到服务器时间
                 */
                modified: number;

                /**
                 * 如果是文件，返回由客户端设置的文件本地修改时间
                 * 若未设置，返回modified的值
                 */
                client_mtime?: number;
            }

            /* 
            * 批量获取文件操作统计
            */
            interface OpStatisticsResult {
                /**
                 * 下载量
                 */
                download: number;

                /**
                 * 预览量
                 */
                preview: number;
            }

            /* 
            * 还原回收站资源协议
            */
            interface RestoreResult {
                /**
                 * 还原后文件/目录的gns路径
                 * 如果父目录为新创建的，返回docid可能与传入的不同
                 */
                docid: string;

                /**
                 * 当ondup为2（自动重名）时才返回
                 */
                name?: string;
            }

            /* 
            * 获取我的外链
            */
            interface GetLinkedResult {
                /**
                 * 外链访问的文件gns路径
                 */
                docid: string;

                /**
                 * 外链访问的文件name路径
                 */
                namepath: string;

                /**
                 * 外链访问的文件大小
                 */
                size: number;

                /**
                 * 外链访问的文件最后修改时间
                 */
                modified: number;

            }

            /* 
            * 获取自定义属性协议
            */
            interface CustomAttributeResult {
                /**
                 * 属性名称
                 */
                name: string;

                /**
                 * 属性唯一ID
                 */
                id: number;

                /**
                 * 属性类型
                 * 0：层级
                 * 1：枚举
                 * 2：数字
                 * 3：文本
                 * 4：时间 （时间戳）
                 */
                type: number;

            }

            interface CheckWatermarkResult {
                /**
                 * 水印类型
                 * 0: 无水印
                 * 1: 预览水印
                 * 2: 下载水印
                 * 3: 预览下载水印
                 */
                watermarktype: number;
                /**
                 * 水印配置
                 */
                watermarkconfig: string;
            }

        }
    }
}