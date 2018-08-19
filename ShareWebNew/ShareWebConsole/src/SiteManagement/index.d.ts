declare namespace Components {
    namespace SiteManagement {

        type Props = {
            /**
             * 更新左侧边栏站点
             */
            onSiteConfigSuccess: () => void;

            /**
             * 跳转到应用节点界面
             */
            doRedirectServers: () => void;
        }

        type State = {

            /**
             * 站点集合
             */
            sites: ncTSiteInfo[],

            /**
             * 当前站点
             */
            localSite: Core.ShareSite.SiteInfo,

            /**
             * 多站点模式开启状态
             */
            multisiteEnabled: boolean;

            /**
           * 是否添加站点
           */
            addingSite: boolean;

            /**
             * 编辑的站点对象
             */
            editingSite: Core.ShareSite.SiteInfo | null;

            /**
              *删除的站点对象
              */
            removingSite: Core.ShareSite.SiteInfo | null;

            /**
             * 开启/关闭多站点模式时出现的提示框
             */
            showToggleSiteDialog: boolean;

            /**
             * 节点数据库
             */
            dbNodeInfos: ReadonlyArray<Core.ECMSManager.ncTNodeInfo>

            /**
             * 当前应用服务的ip
             */
            appIp: string;

            /**
             * 第三方存储服务
             */
            OSSInfo: ncTEVFSOSSInfo;

            /**
             * 正在关闭分站点
             */
            isClosing: boolean;

            /**
             * 正在加载
             */
            isLoading: boolean;

            /**
             * 正在移除分站点
             */
            removing: boolean;

            selection: ncTSiteInfo;

            /**
             * 当前站点的授权信息
             */
            devinfo: ncTDeviceInfo;

            /**
             * 型号错误
             */
            errorHardwareType: boolean;
        }
    }
}



