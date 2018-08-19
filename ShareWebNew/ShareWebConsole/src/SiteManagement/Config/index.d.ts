declare namespace Components {

    namespace SiteManagement {

        namespace Config {

            type Props = {
                /**
                 * 编辑的site对象
                 */
                site?: Core.ShareSite.SiteInfo | null;

                /**
                 * 当前主应用服务节点的ip
                 */
                appIp: string;

                /**
                 * 请求成功回调
                 */
                onSiteConfigSuccess: () => void;

                /**
                 * 关闭当前窗口
                 */
                onSiteConfigCancel: () => void;
            }

            type State = {

                site: Core.ShareSite.SiteInfo;

                /**
                 * 错误码
                 */
                errorID: number | null;

                /**
                 * 默认的站点名称验证规则
                 */
                defaultNameValidateState: number;

                /**
                 * 默认的站点ip验证规则
                 */
                defaultIpValidateState: number;

                /**
                 * 默认的站点密钥验证规则
                 */
                defaultKeyValidateState: number;

                /**
                 * 正在处理
                 */
                loading: boolean;
            }

        }

    }
}



