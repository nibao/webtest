declare namespace Component {
    namespace LinkShare {
        namespace Confirguration {
            interface ViewProps extends React.Props<void> {
                /**
                 * 外链id
                 */
                link?: string;

                /**
                 * 提取码
                 */
                accesscode?: string;

                /**
                 * 外链密码
                 */
                password?: string;

                /**
                 * 外链权限
                 */
                perm: number;

                /**
                 * 外链开启／关闭状态
                 */
                status: number;

                /**
                 * 外链访问地址
                 */
                address: string;

                enableLinkAccessCode;

                endtime;

                limited;

                limitation;

                template;

                mailto;

                showButtons;

                doSave;

                doCancel;

                /**
                * 禁用开启按钮
                */
                opening: boolean;

                /**
                 * 禁用关闭按钮
                 */
                closing: boolean;

                onPermChange;

                onPasswordChange;

                onEndtimeChange;

                onLimitedChange;

                onLimitationChange;

                onMailsChange;

                onMailSendSuccess;

                onMailSendError;

                onSwitchStatus;

                /**
                 * 复制
                 */
                doCopy;
            }

            interface ClientProps extends ViewProps {
                /**
                 * 窗口尺寸发生变化时触发
                 */
                onResize: ({ width, height }: { width: string | number, height: string | number }) => any;
            }

            interface DesktopProps extends ViewProps {
            }

            interface View extends React.StatelessComponent<ViewProps> {
            }

            interface ClientComponent extends React.StatelessComponent<ClientProps> {
            }

            interface DesktopComponent extends React.StatelessComponent<ClientProps> {
            }
        }
    }
}