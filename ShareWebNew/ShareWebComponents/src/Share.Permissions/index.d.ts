declare namespace Components {
    namespace SharePermissions {
        interface Props extends React.Props<any> {
            /**
             * 显示的permConfig
             */
            permConfigs: ReadonlyArray<Core.Permission.PermConfig>;

            /**
             * 删除一条权限
             */
            onRemove(key: string): void;

            /**
             * 禁止显示的权限
             */
            disabledOptions: number;

            /**
             * 允许显示的权限
             */
            allowPerms: number;

            /**
             * 是否出现所有者权限
             */
            allowOwner: boolean;

            /**
             * 权限发生变化或者有效期发生变化
             */
            onChange(key, permConfig: Core.Permission.PermConfig): void;

            /**
             * 当前所在文档类型
             */
            doctype: string;

            /**
             * 在权限配置页面中间显示的错误，包括 没有所有者权限，账户被冻结，个人文档禁止权限配置，群组文档禁止权限配置，8511未标密文件不允许开启权限配置
             */
            displayErrCode?: number;

            /**
             * mobile 点击详情配置
             */
            onViewPermDetail: (config: any) => any;

            /**
             *  707 权限配置 -是否后台开启开关-涉密模式 用户名后加密级
             */
            showCSF: boolean;

            /**
             *  707 权限配置 -密级数组
             */
            csfTextArray: ReadonlyArray<string>;
        }

        interface State {
            /**
             * 显示的permConfig（mobile）
             */
            permConfigs: ReadonlyArray<Core.Permission.PermConfig>;
        }
    }
}