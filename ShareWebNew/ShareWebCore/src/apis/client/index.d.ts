declare namespace Core {
    namespace APIs {
        namespace Client {

            /**
             * 缓存信息
             */
            interface CacheInfo {

                /**
                 * 缓存信息集合
                 */
                cacheInfo: ReadonlyArray<Info>
            }


            /**
             * 未同步文档集合
             */
            interface UnsyncInfos {

                /**
                 * 未同步任务集合
                 */
                unsyncInfo: ReadonlyArray<UnsyncInfo>
            }

            /**
             * 未同步文档集合
             */
            interface UnsyncInfo {

                /**
                 * 缓存路径（主路径和本地同步目录）
                 */
                path: string;

                /**
                 * 缓存路径下未同步文档集合
                 */
                unsyncDetail: ReadonlyArray<UnsyncDetail>
            }

            interface UnsyncNum {

                /**
                 * 未同步任务总数
                 */
                num: number
            }

            interface UnsyncDoc {

                /**
                 * 未同步文档集合
                 */
                unsyncDoc: ReadonlyArray<string>
            }

            interface IsNewView {
                isNewView: boolean
            }


            interface SyncLogInfo {

                /**
                 * 同步日志集合
                 */
                syncLogInfo: ReadonlyArray<Detail>
            }

            /**
             * 缓存信息
             */
            interface Info {
                /**
                 * 文档属性
                 */
                attr: number;

                /**
                 * 文档id
                 */
                docId: string;

                /**
                 * 文档状态（0：无状态；1：延迟下载；2：过期（已下载）；3：最新（已下载）；4：未同步）
                 */
                state: number;

                /**
                 * 是否为文件夹
                 */
                isDir: boolean;

                /**
                 * 文档最后修改时间
                 */
                lastModified: number;

                /**
                 * 版本id或otag
                 */
                otag: string;

                /**
                 * 文档大小
                 */
                size: number;

                /**
                 * 文档类型
                 */
                type: number;

                /**
                 * 文档分类名称
                 */
                typeName: string;

                /**
                 * 文档分类名称
                 */
                viewName: string;

                /**
                 * 文档分类类型
                 */
                viewType: number;
            }

            /**
              * 缓存路径下未同步文档详情
              */
            interface UnsyncDetail {
                /**
                 * 错误码
                 */
                errCode: number;

                /**
                 * 是否是文件夹
                 */
                isDir: boolean;

                /**
                 * 大小
                 */
                size: number;

                /**
                 * 未同步文档名
                 */
                name: string;

                /**
                 * 相对路径
                 */
                relPath: string;
            }


            /**
             * 本地用户信息
             */
            interface LocalUserConfig {

                localUserConfig: LocalUser
            }

            interface LocalUser {

                /**
                 * 自动同步配置
                 */
                autoSyncConfig: AutoSyncConfig;

                /**
                 * 缓存路径
                 */
                cachePath: string;

                /**
                 * 缓存迁移路径
                 */
                changeCachePath: string;

                /**
                 * 是否退出清除缓存
                 */
                clearCache: boolean;

                /**
                 * 是否退出弹清除缓存提示
                 */
                clearCacheTips: boolean;

                /**
                 * 最近自动清除时间
                 */
                lastAutoClearTime: number;

                /**
                 * 本地自动同步路径集合
                 */
                localSyncConfig: null;

                /**
                 * 本地自动同步路径删除集合
                 */
                localSyncDelConfig: Array<any>;

                /**
                 * 登录配置
                 */
                loginConfig: LoginConfig,

                /**
                 * 提醒配置
                 */
                remindConfig: RemindConfig,

                /**
                 * 是否弹同步提示
                 */
                syncingTips: boolean;

                /**
                 * 用户id
                 */
                userId: string;
            }


            /**
             * 自动同步配置
             */
            interface AutoSyncConfig {

                /**
                 * 自动同步路径集合
                 */
                autoSyncPaths: string;

                /**
                 * 限制自动同步后缀名集合
                 */
                limitOtherExts: string;

                /**
                 * 限制自动同步文件大小
                 */
                limitSize: number;

                /**
                 * 限制自动同步类型集
                 */
                limitType: number;
            }

            /**
             * 登录配置
             */
            interface LoginConfig {

                /**
                 * 是否自动登录
                 */
                autoLogin: boolean;

                /**
                 * 登录密码
                 */
                password: string;

                /**
                 * 登录名称
                 */
                userName: string
            }

            interface RemindConfig {

                /**
                 * 是否提醒自动同步
                 */
                remindAutoSync: boolean;
            }

            /**
             * 全局配置
             */
            interface GlobalServerConfig {

                globalServerConfig: GlobalServer
            }

            interface GlobalServer {

                /**
                 * 自动同步配置
                 */
                autoSyncConfig: AutoSyncConfig;

                /**
                 * 默认缓存路径
                 */
                cachePath: string;

                /**
                 * 是否退出清除缓存
                 */
                clearCache: boolean;

                /**
                 * 是否退出弹清除缓存提示
                 */
                clearCacheTips: boolean;

                /**
                 * 其他配置
                 */
                featuresConfig: FeaturesConfig;

                /**
                 * 首次登陆默认缓存路径
                 */
                firstCachePath: string;

                /**
                 * 最近登陆的服务器地址
                 */
                lastServer: string;

                /**
                 * 提醒配置
                 */
                remindConfig: RemindConfig;

                /**
                 * 是否弹同步提示框
                 */
                syncingTips: boolean;
            }

            /**
             * 其他配置
             */
            interface FeaturesConfig {

                /**
                 * 是否显示联系人
                 */
                enableContact: boolean;

                /**
                 * 是否开启直传
                 */
                enableDirectTransfer: boolean;

                /**
                 * 是否显示消息中心
                 */
                enableMsgCenter: boolean;

                /**
                 * 是否显示发现共享
                 */
                enableShareDiscovery: boolean;

                /**
                 * 是否显示共享管理
                 */
                enableSharedMgr: boolean;

                /**
                 * 是否显示托盘
                 */
                enableTrayIcon: boolean
            }

            /**
             * 服务器配置
             */
            interface LocalServerConfig {

                localServerConfig: LocalServer
            }

            interface LocalServer {

                /**
                 * 自动配置
                 */
                authConfig: AuthConfig;

                /**
                 * 权限服务端口
                 */
                eacpPort: number;

                /**
                 * 文档服务端口
                 */
                efspPort: number;

                /**
                 * 代理详情
                 */
                proxyInfo: ProxyInfo;

                /**
                 * 代理类型
                 */
                proxyType: number;

                /**
                 * 服务器地址
                 */
                serverIp: string;

                /**
                 * 服务器名称
                 */
                serverName: string;

                /**
                 * 最近登录用户id
                 */
                userId: string;
            }

            /**
             * 版本信息
             */
            interface VersionInfo {
                /**
                 * 主版本号
                 */
                majorVersionNumber: string;

                /**
                 * 从版本号
                 */
                minorVersionNumber: string;

                /**
                 * 版本构建时间
                 */
                versionData: string;
            }

            /**
             * 语言信息
             */
            interface LanguageInfo {

                /**
                 * zh-cn代表中文；zh-tw代表繁体；en-us代表英文
                 */
                language: string;
            }

            /**
             * 自动配置
             */
            interface AuthConfig {

                /**
                 * 是否认证通过
                 */
                hasAuth: boolean;

                /**
                 * 是否允许记住密码
                 */
                oemconfig_allowRememberPwd: boolean;

                /**
                 * 是否显示用户协议
                 */
                oemconfig_enableUserAgreement: boolean;

                /**
                 * 是否隐藏第三方登录按钮
                 */
                thirAuth_hideThirdLogin: boolean;

                /**
                 * 第三方id
                 */
                thirAuth_id: string;

                /**
                 * 是否隐藏登录窗
                 */
                webAuth_hideLogin: boolean;

                /**
                 * 是否隐藏第三方登录按钮
                 */
                webAuth_hideThirdLogin: boolean;

                /**
                 * 是否开启域用户免登陆
                 */
                windowsAdSso: boolean;
            }

            /**
             * 代理详情
             */
            interface ProxyInfo {

                /**
                 * 代理地址
                 */
                address: string;

                /**
                 * 代理密码
                 */
                password: string;

                /**
                 * 代理端口
                 */
                port: number;

                /**
                 * 代理用户
                 */
                user: string;
            }


            /**
             * 同步任务详情
             */
            interface Detail {

                /**
                 * 日志id
                 */
                logId: number;

                /**
                 * 新名称
                 */
                newName: string;

                /**
                 * 相对路径
                 */
                relPath: string;

                /**
                 * 绝对路径
                 */
                absPath: string;

                /**
                 * 备注
                 */
                remark: string;

                /**
                 * 大小
                 */
                size: number;

                /**
                 * 任务类型
                 */
                taskType: number;

                /**
                 * 时间
                 */
                time: number
            }


            /**
             * 正在同步的任务数
             */
            interface SyncTaskNum {
                num: number
            }


            /**
             * 正在同步的任务
             */
            interface SyncingTasks {

                /**
                 * 正在同步的任务集合
                 */
                detail: Array<SyncingDetail>

                /**
                 * 正在同步的任务总数
                 */
                total: number,
            }

            /**
             * 正在同步的任务详情
             */
            interface SyncingDetail {

                /**
                 * 任务id
                 */
                taskId: number,

                /**
                 * 任务类型
                 */
                taskType: number,

                /**
                 * 任务状态
                 */
                taskStatus: number,

                /**
                 * 相对路径
                 */
                relPath: string,

                /**
                 * 大小
                 */
                size: number,

                /**
                 * 速率
                 */
                rate: number,

                /**
                 * 进度
                 */
                ratios: number
            }

            /**
              * 侧边栏选中项
              */
            interface SelectedItems {

                /**
                 * 选中文档集合
                 */
                items: Array<string>;

                /**
                 * 当前所在路径
                 */
                path: string;
            }
        }
    }
}