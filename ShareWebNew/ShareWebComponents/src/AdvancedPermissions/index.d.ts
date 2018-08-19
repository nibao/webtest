declare namespace Components {
    namespace AdvancedPermissions {
        interface Props extends React.Props<any> {
            /**
             * 是否显示拒绝权限
             */
            showDeny: boolean;

            /**
             * 是否显示所有者权限
             */
            allowOwner: boolean;

            /**
             * 不允许出现的权限
             */
            disabledOptions: number;

            /**
             * 允许权限值
             */
            allow: number;

            /**
             * 拒绝权限值
             */
            deny: number;

            /**
             * 是否勾选所有者
             */
            isowner: boolean;

            /**
             * 允许出现的权限
             */
            allowPerms: number;

            /**
             * 权限出现变化
             */
            onChange(perm: Core.Permission.Perm): void;
        }

        interface State {
            /**
             * 是否勾选所有者
             */
            isowner: boolean;

            /**
             * 允许权限值
             */
            allow: number;

            /**
             * 拒绝权限值
             */
            deny: number;
        }
    }
}