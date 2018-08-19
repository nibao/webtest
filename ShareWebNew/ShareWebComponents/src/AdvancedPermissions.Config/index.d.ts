declare namespace Components {
    namespace AdvancedPermissionsConfig {
        interface Props extends React.Props<any> {
            /**
             * 允许权限
             */
            allow: number;

            /**
             * 拒绝权限
             */
            deny: number;

            /**
             * 所有者权限是否勾选
             */
            isowner: boolean;

            /**
             * 是否显示拒绝权限
             */
            showDeny: boolean;

            /**
             * 是否显示所有者权限
             */
            allowOwner: boolean;

            /**
             * 禁止显示的权限
             */
            disabledOptions: number;

            /**
             * 权限发生变化
             */
            onChange(perm: Core.Permission.Perm, endtime?: number): void;

            /**
             * 访问者名字
             */
            accessorName: string;

            /**
             * 允许显示的权限
             */
            allowPerms: number;

            /**
             * 有效期（mobile）
             */
            endtime?: number;

            /**
             * 内链模板(mobile)
             */
            template?: Core.Permission.Template;

            /**
             * 涉密模式(mobile)
             */
            secretMode?: boolean;

            /**
             * 点击“取消按钮”
             */
            onCancel(): void;
        }

        interface State {
            /**
             * 允许权限
             */
            allow: number;

            /**
             * 拒绝权限
             */
            deny: number;

            /**
             * 所有者权限是否勾选
             */
            isowner: boolean;

            /**
             * 有效期(mobile)
             */
            endtime?: number;

            /**
             * 改动了权限和有效期(mobile)
             */
            changed?: boolean;

            /**
             * 是否允许永久有效(mobile)
             */
            allowPermanent?: boolean;
        }
    }
}