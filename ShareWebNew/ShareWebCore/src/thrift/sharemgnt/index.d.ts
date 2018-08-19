import { type } from "os";

declare namespace Core {
    namespace ShareMgnt {

        /**
         * 部门信息
         */
        type ncTUsrmDepartmentInfo = {

            /**
             * 部门id
             */
            departmentId: string;

            /**
             * 部门名称
             */
            departmentName: string

            /**
             * 父部门id
             */
            parentDepartId: string;

            /**
             * 父部门名称
             */
            parentDepartName: string;

            /**
             * 部门管理员
             */
            responsiblePerson: ncTUsrmGetUserInfo;

            /**
             * 归属站点信息
             */
            siteInfo: ncTUsrmSiteInfo;

            /**
             * 子部门id        
             */
            subDepartIds: Array<string>;
        }

        /**
         * 用户节点信息
         */
        type ncTUsrmGetUserInfo = {
            /**
             * 用户id
             */
            id: string;
            /**
             * 用户基本信息
             */
            user: ncTUsrmUserInfo;
            /**
             * 是否为初始密码      
             */
            originalPwd: boolean;
            /**
             * 用户密码   
             */
            password: string;
            /**
             * 直属部门信息
             */
            directDeptInfo: any;
        }



        /**
         *  归属站点信息
         */
        type ncTUsrmSiteInfo = {
            /**
             *  站点ID
             */
            id: string;
            /**
             *  站点名
             */
            name: string;
        }
        /**
         *  用户基本信息
         */
        type ncTUsrmUserInfo = {
            /**
             *  用户名称
             */
            loginName: string;
            /**
             *  显示名
             */
            displayName: string;
            /**
             *  邮箱
             */
            email: string;
            /**
             *  配额空间，单位Bytes，默认5GB，最小1GB                       
             */
            space: number;
            /**
            * 用户类型
            * enum ncTUsrmUserType {
            *   NCT_USER_TYPE_LOCAL = 1,        // 本地用户
            *   NCT_USER_TYPE_DOMAIN = 2,       // 域用户
            *   NCT_USER_TYPE_THIRD = 3,        // 第三方验证用户
            *   }
             */
            userType: number;

            /**
             *  所属部门id，-1时表示为未分配用户          
             */
            departmentIds: Array<string>;

            /**
             *  所属部门名称
             */
            departmentNames: Array<string>;
            /**
             * // 用户状态
             * enum ncTUsrmUserStatus {
             *      NCT_STATUS_ENABLE = 0,          // 启用
             *      NCT_STATUS_DISABLE = 1,         // 禁用
             *      NCT_STATUS_DELETE = 2,          // 用户被第三方系统删除
             * }
             */
            status: number;

            /**
             *  已使用配额空间,单位Bytes          
             */
            usedSize: number;

            /**
             *  排序优先级 
             */
            priority: number;

            /**
             *  用户密级
             */
            csfLevel: number;

            /**
             *  密码管控
             */
            pwdControl: boolean;

            /**
             *  归属站点信息   
             */
            siteInfo: ncTUsrmSiteInfo;

            /**
             *  管理员限额信息
             */
            limitSpaceInfo: ncTLimitSpaceInfo;

            /**
             *  用户创建时间
             */
            createTime: number;

            /**
             *  用户冻结状态，true:冻结 false:未冻结                    
             */
            freezeStatus: boolean;

            /**
             *  手机号
             */
            telNumber: string;
        }

        type ncTLimitSpaceInfo = {

            /**
             *  用户限额，默认为-1(无限制)
             */
            limitUserSpace: number;

            /**
             *  已分配的用户限额,默认0
             */
            allocatedLimitUserSpace: number;

            /**
             *  文档库限额，默认为-1(无限制)
             */
            limitDocSpace: number;

            /**
             *  已分配的文档库限额，默认0
             */
            allocatedLimitDocSpace: number;
        }

        /**
         * 登录验证码配置参数
         */
        type ncTVcodeConfig = {

            /**
             * 开启关闭登录验证码功能。 true - 开启，false - 关闭。
             */
            isEnable: boolean;

            /**
             *  达到开启登录验证码的用户密码出错次数
             */
            passwdErrCnt: number;
        }

        /**
         * 生成的验证码信息
         */
        type ncTVcodeCreateInfo = {
            /**
             * 经过 base64 编码后的验证码图片字符串
             */
            vcode: string;

            /**
             * 验证码唯一标识
             */
            uuid: string;
        }

        /**
         * 导出日志参数
         */
        interface ncTExportLogParam extends Core.EACPLog.ncTGetLogCountParam {
            /**
             * 最大的logId
             */
            maxLogId: number;

        }

        /**
         * 用户登录附带选项信息
         */
        interface ncTUserLoginOption {
            /**
             * 用户登录
             */
            loginIp?: string;

            /**
             * 验证码唯一标识
             */
            uuid?: string

            /**
             * 验证码唯一标识
             */
            vcode?: string;
        }

        /**
         * 定义简单的用户信息
         */
        type ncTSimpleUserInfo = {
            id: string
            displayName: string
            loginName: string
            status: ncTUsrmUserStatus
        }

        /**
         * 用户状态
         */
        enum ncTUsrmUserStatus {
            /**
             * 启用
             */
            NCT_STATUS_ENABLE = 0,

            /**
             * 禁用
             */
            NCT_STATUS_DISABLE = 1,

            /**
             * 用户被第三方系统删除
             */
            NCT_STATUS_DELETE = 2,
        }

        /**
         * 文档审核模式
         */
        enum ncTDocAuditType {
            /**
             * 同级审核，一个人审核通过即可
             */
            NCT_DAT_ONE = 1,
            /**
             * 汇签审核，全部通过才算通过
             */

            NCT_DAT_ALL = 2,
            /**
             * 逐级审核，一级一级通过
             */

            NCT_DAT_LEVEL = 3,

            /**
             * 免审核
             */
            NCT_DAT_FREE = 4,
        }

        /**
         * 创建流程参数
         */
        type ncTDocAuditInfo = {
            /**
             * 流程id
             */
            processId?: string;

            /**
             * 流程名称
             */
            name: string;

            /**
             * 审核模式
             */
            auditType: ncTDocAuditType;

            /**
             * 如果是同级/汇签审核，表示所有的审核员；如果是逐级审核，auditorIds[0]表示第一级审核，依次类推
             */
            auditorIds: Array<string>;

            /**
             * 审核通过后，存放的gns路径
             */
            destDocId: string;

            /**
             * 创建者id
             */
            creatorId?: string;

            /**
             * 有效状态
             */
            status?: boolean;

            /**
             * 审核员名称
             */
            auditorNames?: Array<string>;

            /**
             * 创建者名称
             */
            creatorName?: string;

            /**
             * 文档路径名称
             */
            destDocName?: string;

            /**
             * 流程适用的范围，限定哪些部门，哪些人可以看到该流程
             */
            accessorInfos?: Array<{ 'ncTAccessorInfo': ncTAccessorInfo }>
        }

        /**
         * 访问者信息
         */
        type ncTAccessorInfo = {
            /**
             * 访问者id
             */
            id: string;

            /**
             * 访问者类型 1:用户, 2:部门
             */
            type: number;

            /**
             * 访问者名称
             */
            name: string
        }

        /**
         * 活跃报表信息
         */
        type ActiveReportInfo = {
            /**
             * 用户总数
             */
            totalCount: number;

            /**
             * 平均用户数
             */
            avgCount: number;

            /**
             * 平均活跃度
             */
            avgActivity: number;

            /**
             * 活跃用户数信息
             */
            userInfos: ReadonlyArray<ncTActiveUserInfo>;
        };

        /**
         * 活跃用户信息
         */
        type ncTActiveUserInfo = {
            /**
             * 时间
             */
            time: string;

            /**
             * 用户活跃数
             */
            activeCount: number;

            /**
             * 用户活跃度
             */
            userActivity: number;
        }

        /**
         * 第三方根节点信息
         */
        type ncTThirdPartyRootNodeInfo = {
            /**
             * 跟组织名称
             */
            name: string;

            /**
             * 根组织第三方id
             */
            thirdId: string;
        }

        /**
         * 第三方节点信息
         */
        type ncTUsrmThirdPartyNode = {
            /**
             * 组织
             */
            ncTUsrmThirdPartyOUs: ReadonlyArray<ncTUsrmThirdPartyOU>

            /**
             * 用户
             */
            ncTUsrmThirdPartyUsers: ReadonlyArray<ncTUsrmThirdPartyUser>
        }

        /**
         * 第三方用户信息
         */
        type ncTUsrmThirdPartyUser = {
            /**
             * 登录名
             */
            loginName: string;

            /**
             * 显示名
             */
            displayName: string;

            /**
             * 第三方用户id
             */
            thirdId: string;

            /**
             * 第三方父部门id
             */
            deptThirdId: string;
        }

        /**
         * 第三方组织单位信息
         */
        type ncTUsrmThirdPartyOU = {
            /**
             * 组织名称
             */
            name: string,

            /**
             * 第三方部门id
             */
            thirdId: string;

            /**
             * 第三方父部门id
             */
            parentThirdId: string;

            /**
             * 是否导入组织下的所有子组织及用户，True--导入，False--只导入此组织
             */
            importAll: boolean;
        }

        /**
         * 用户导入的配置选项
         */
        type ncTUsrmImportOption = {
            /**
             * 是否导入用户邮箱
             */
            userEmail: boolean;

            /**
             * 是否导入用户显示名
             */
            userDisplayName: boolean;

            /**
             * 是否覆盖已有用户
             */
            userCover: boolean;

            /**
             * 导入目的地
             */
            departmentId: string;

            /**
             * 用户的配额空间
             */
            spaceSize: number;
        }

        type ncTUsrmImportResult = {

            /**
             * 需要导入的总数
             */
            totalNum: number;

            /**
             * 已导入的总数
             */
            successNum: number;

            /**
             * 出错总数
             */
            failNum: number;
            /**
             * 出错内容
             */
            failInfos: ReadonlyArray<string>
        }




        /********************************** 函数声明*****************************/

        /**
         * 获取登录验证码配置信息
         */
        type GetVcodeConfig = Core.APIs.ThriftAPI<
            void,
            ncTVcodeConfig
            >

        /**
         * 设置登录验证码配置
         */
        type SetVcodeConfig = Core.APIs.ThriftAPI<
            [{ 'ncTVcodeConfig': ncTVcodeConfig }],
            void
            >

        /**
         * 生成验证码
         */
        type CreateVcodeInfo = Core.APIs.ThriftAPI<
            [string],
            ncTVcodeCreateInfo
            >

        /**
         * 获取日志导出加密开关状态
         */
        type GetExportWithPassWordStatus = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 添加导出活跃日志文件任务
         */
        type ExportActiveLog = Core.APIs.ThriftAPI<
            [string, string, boolean, ncTExportLogParam],
            string
            >

        /**
         * 添加导出历史日志文件任务
         */
        type ExportHistoryLog = Core.APIs.ThriftAPI<
            [string, number, string],
            string
            >

        /**
         * 获取日志文件信息
         */
        type GetCompressFileInfo = Core.APIs.ThriftAPI<
            [string],
            string
            >

        type GetGenCompressFileStatus = Core.APIs.ThriftAPI<
            [string],
            boolean
            >

        /**
         * 设置告警邮箱
         */
        type SMTPAlarmSetConfig = Core.APIs.ThriftAPI<
            Array<string>,
            void
            >

        /**
         * 登录认证
         */
        type Login = Core.APIs.ThriftAPI<
            [string, string, number, { 'ncTUserLoginOption': ncTUserLoginOption }], // ncTUserLoginOption
            string
            >

        /**
         * 编辑内置管理员账号
         */
        type EditAdminAccount = Core.APIs.ThriftAPI<
            [string, string],
            void
            >

        /**
         * 设置管理员邮箱
         */
        type SetAdminMailList = Core.APIs.ThriftAPI<
            [string, Array<string>],
            void
            >

        /**
         * 获取所有文档审核员信息
         */
        type GetAllAuditorInfos = Core.APIs.ThriftAPI<
            void,
            ncTSimpleUserInfo
            >

        /**
         * 根据管理员id获取所有文档流程信息, admin获取所有
         */
        type GetAllProcessInfo = Core.APIs.ThriftAPI<
            [string],
            ncTDocAuditInfo
            >

        /**
         * 搜索文档审核员信息
         */
        type SearchAuditor = Core.APIs.ThriftAPI<
            [string],
            ncTSimpleUserInfo
            >

        /**
         *  创建审核流程，返回流程唯一标识id
         */
        type CreateProcess = Core.APIs.ThriftAPI<
            [{ 'ncTDocAuditInfo': ncTDocAuditInfo }],
            void
            >

        /**
         * 编辑审核流程
         */
        type EditProcess = Core.APIs.ThriftAPI<
            [{ 'ncTDocAuditInfo': ncTDocAuditInfo }, string],
            void
            >

        /**
         * 转换文档名称
         */
        type ConvertDocName = Core.APIs.ThriftAPI<
            [string],
            string
            >

        /**
         *  获取用户根节点
         */
        type GetDiskRootData = Core.APIs.ThriftAPI<
            ReadonlyArray<string>,
            ReadonlyArray<any>
            >

        /**
         * 获取组织列表
         */
        type GetDepartmentUser = Core.APIs.ThriftAPI<
            [string, number, number],
            ReadonlyArray<any>
            >

        /**
         * 获取所有用户
         */
        type GetALlUser = Core.APIs.ThriftAPI<
            [number, number],
            ReadonlyArray<any>
            >

        /**
         * 获取子部门列表
         */
        type GetSubDepartments = Core.APIs.ThriftAPI<
            [string],
            ReadonlyArray<any>
            >

        // /**
        // * 获取 EACP HTTPS 端口
        // */
        // type GetEACPHttpsPort = Core.APIs.ThriftAPI<
        //     void,
        //     number
        //     >

        // /**
        //  * 获取 EFAST HTTPS 端口
        //  */
        // type GetEFASTHttpsPort = Core.APIs.ThriftAPI<
        //     void,
        //     number
        //     >

        /**
         * 设置短信配置
         */
        type SMSSetConfig = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 短信配置测试
         */
        type SMSTest = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 获取短信配置
         */
        type SMSGetConfig = Core.APIs.ThriftAPI<
            void,
            string
            >

        /**
         * 获取月度活跃报表
         */
        type GetActiveReportMonth = Core.APIs.ThriftAPI<
            /**
             * 形如：2018-03
             */
            [string],
            ActiveReportInfo
            >
        /**
         * 获取年度活跃报表
         */
        type GetActiveReportYear = Core.APIs.ThriftAPI<
            /**
             * 形如：2018
             */
            [string],
            ActiveReportInfo
            >

        /**
         * 导出月度活跃报表
         */
        type ExportActiveReportMonth = Core.APIs.ThriftAPI<
            [string, string],
            string
            >

        /**
         * 导出年度活跃报表
         */
        type ExportActiveReportYear = Core.APIs.ThriftAPI<
            [string, string],
            string
            >

        /**
         * 获取最早统计时间
         */
        type OpermGetEarliestTime = Core.APIs.ThriftAPI<
            void,
            string
            >

        /**
         * 获取生成活跃报表状态
         */
        type GetGenActiveReportStatus = Core.APIs.ThriftAPI<
            [string],
            boolean
            >

        /**
         * 获取告警邮箱
         */
        type SMTPAlarmGetConfig = Core.APIs.ThriftAPI<
            void,
            [string]
            >

        /**
         * 获取运维助手开关状态
         */
        type GetActiveReportNotifyStatus = Core.APIs.ThriftAPI<
            void,
            boolean
            >
        /**
         * 设置运维助手开关状态
         */
        type SetActiveReportNotifyStatus = Core.APIs.ThriftAPI<
            [boolean],
            void
            >

        /**
         * 获取部门管理员
         */
        type UsrmGetDepartResponsiblePerson = Core.APIs.ThriftAPI<
            [string],
            ReadonlyArray<ncTUsrmGetUserInfo>
            >

        /**
         * 添加部门负责人
         */
        type UsrmAddResponsiblePerson = Core.APIs.ThriftAPI<
            [string, string],
            void
            >

        /**
         * 设置组织管理员限额
         */
        type UsrmEditLimitSpace = Core.APIs.ThriftAPI<
            [string, number, number],
            void
            >

        /**
         * 删除组织管理员
         */
        type UsrmDeleteResponsiblePerson = Core.APIs.ThriftAPI<
            [string, string],
            void
            >

        /**
         * 获取个人文档状态
         */
        type UsrmGetUserDocStatus = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 获取个人文档大小
         */
        type UsrmGetDefaulSpaceSize = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 获取第三方根组织节点
         */
        type UsrmGetThirdPartyRootNode = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTThirdPartyRootNodeInfo>
            >

        /**
         * 展开第三方节点
         */
        type UsrmExpandThirdPartyNode = Core.APIs.ThriftAPI<
            void,
            ncTUsrmThirdPartyNode
            >

        /**
         * 导入第三方组织结构和用户
         */
        type UsrmImportThirdPartyOUs = Core.APIs.ThriftAPI<
            [ReadonlyArray<ncTUsrmThirdPartyOU>, ReadonlyArray<ncTUsrmThirdPartyUser>, ncTUsrmImportOption, string],
            void
            >

        /**
         * 清除导入进度
         */
        type UsrmClearImportProgress = Core.APIs.ThriftAPI<
            void,
            void
            >

        /**
         * 获取导入进度
         */
        type UsrmGetImportProgress = Core.APIs.ThriftAPI<
            void,
            ncTUsrmImportResult
            >
    }
}