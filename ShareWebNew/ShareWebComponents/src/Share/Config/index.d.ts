declare namespace Components {
    namespace Share {
        namespace Config {
            interface Props extends React.Props<void> {
                /**
                 * 文档
                 */
                doc: Core.Docs.Doc;

                /**
                 * 路径
                 */
                filePath: string;

                /**
                 * 权限数据
                 */
                permConfigs: ReadonlyArray<any>;

                /**
                 * 禁止配置的权限
                 */
                disabledOptions: number;

                /**
                 * 文档类型
                 */
                doctype: string;

                /**
                 * 模板
                 */
                template: Core.Permission.Template;

                /**
                 * ZeroClipboard.swf位置
                 */
                swf: string;

                /**
                 * 复制链接成功
                 */
                onCopyLinkSuccess: () => void;

                /**
                 * 点击“添加更多”
                 */
                onClickMoreVisitors: () => void;

                /**
                 * 添加
                 */
                onAddPermConfigs: (permConfigs: ReadonlyArray<any>) => void;

                /**
                 * 在权限配置页面中间显示的错误，包括 没有所有者权限，账户被冻结，个人文档禁止权限配置，群组文档禁止权限配置，8511未标密文件不允许开启权限配置
                 */
                displayErrCode: number;

                /**
                 * 移除权限
                 */
                onRemoveConfig: (key: string) => void;

                /**
                 * 编辑权限
                 */
                onEditConfig: (key: string, config: any) => void;

                /**
                 * 取消
                 */
                onCancel: () => void;

                /**
                 * 点击“确定”
                 */
                onConfirm: () => void;

                /**
                 * 复制链接地址
                 */
                doCopyLink?: (filePath: string) => void;
            }
        }
    }
}