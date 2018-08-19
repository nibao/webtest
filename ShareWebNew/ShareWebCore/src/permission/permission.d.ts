declare namespace Core {
    namespace Permission {

        interface PermConfig {
            allow: number;
            deny: number;
            isowner: boolean;
            accessorid: string;
            accessorname: string;
            accessortype: string;
            endtime: number;
            inheritpath: string;
            allowOwner: boolean;
            timeRange: Array<Date>;
            namepath?: string;
            defaultSelectDays?: number;
            allowPermanent: boolean;
            csflevel: number;
        }

        interface Template {
            allowPerms: number;
            defaultPerms: number;
            allowOwner: boolean;
            defaultOwner: boolean;
            validExpireDays: boolean;
            defaultExpireDays: number;
            maxExpireDays: number;
        }

        interface Perm {
            allow: number;
            deny?: number;
            isowner?: boolean;
        }

        /**
         * 外链模板
         */
        interface externalinkTemp {

            // 可设定的访问权限
            allowPerms: number;
            // 默认访问权限
            defaultPerms: number;
            // 限制外链有效期
            validExpireDays: boolean;
            // 默认有效期
            defaultExpireDays: number;
            // 最大有效期
            maxExpireDays: number;
            // 强制使用访问密码
            enforceUseLinkPwd: boolean;
            // 限制外链打开次数
            limitAccessTime: boolean;
            // 默认打开次数
            defaultLimitTimes: number;
            // 最多打开次数
            maxLimitTimes: number;
        }
    }
}