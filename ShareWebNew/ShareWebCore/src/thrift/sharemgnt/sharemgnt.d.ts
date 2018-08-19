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
            directDeptInfo: ncTUsrmDirectDeptInfo;
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
         * 限速配置管理信息
         */
        type ncTLimitRateInfo = {
            /**
             * 限速配置唯一标识
             */
            id: string;

            /**
             * 最大上传速度
             */
            uploadRate: number;

            /**
             * 最大下载速度
             */
            downloadRate: number;

            /**
             * 用户列表
             */
            userInfos: ReadonlyArray<ncTLimitRateObject>;

            /**
             * 部门列表
             */
            depInfos: ReadonlyArray<ncTLimitRateObject>;

            /**
             * 限速配置类型
             */
            limitType: number;
        }

        /**
         *  限速配置管理对象
         */

        type ncTLimitRateObject = {
            /**
             * 限速对象id
             */
            objectId: string;

            /**
             * 限速对象名称
             */
            objectName: string;
        }
    }
}