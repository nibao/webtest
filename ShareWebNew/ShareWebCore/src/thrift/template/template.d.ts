declare namespace Core {
    namespace Template {
        // 模板类型
        enum TemplateType {
            // 内链
            INTERNAL_LINK = 0,
            // 外链
            EXTERNAL_LINK = 1
        }

        //共享者类型
        enum SharerType {
            //用户
            USER = 1,
            //部门
            DEPT = 2
        }

        //模板
        type ncTLinkTemplateInfo = {
            // 模板策略ID（添加接口传空）
            templateId?: string;
            // 模板类型
            templateType: TemplateType;
            // 共享者信息
            sharerInfos: Array<ncTLinkShareInfo>;
            // 模板配置信息
            config: string;
        }

        //共享者
        type ncTLinkShareInfo = {
            sharerId: string;
            sharerType: SharerType,
            sharerName: string;
        }

        //内链模板配置信息
        type InternalConfig = {
            // 可设定的访问权限
            allowPerm: number;
            // 默认访问权限
            defaultPerm: number;
            // 可设定所有者
            allowowner: boolean;
            // 默认可设定所有者
            defaultOwner: boolean;
            // 有效期限制
            limitExpireDays: boolean;
            // 限制时表示最大有效期，不限制时表示默认有效期
            allowexpireDays: number;
        }
    }
}