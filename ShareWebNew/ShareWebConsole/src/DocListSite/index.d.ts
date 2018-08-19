declare namespace Console {
    namespace DocListSite {

        interface Props extends React.Props<void> {
            /**
             * 选中的文档库
             */
            libraries: Array<any>

            /**
             * 设置类型
             * 文档库:library，归档库:archive
             */
            type: string;

            /**
            * 用户信息
            */
            userInfo: Core.ShareMgnt.ncTUsrmGetUserInfo;

            /**
             * 完成事件
             */
            onSiteSetComplete: () => void;

            /**
             * 设置成功
             */
            onSiteSetSuccess: () => void;

        }

        interface State {
            /**
             * 所有站点信息
             */
            siteInfos: Array<SiteInfo>;

            /**
             * 已选站点
             */
            selectedSite: SiteInfo;

            /**
            * 处理数据的状态
            */
            status: number;

            /**
             * 设置进度
             */
            progress: number;

            /**
             * 错误信息
             */
            errorStatus: number;
        }

        interface SiteInfo {
            /**
             * 站点id
             */
            id: string;

            /**
             * 站点名
             */
            name: string;
        }
    }
}