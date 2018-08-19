declare namespace Core {
    namespace ShareSite {

        /******************************数据类型定义********************************/

        /**
         * 站点详细信息
         */
        type SiteInfo = {
            id: string;              //站点ID
            ip: string;               //站点访问地址
            name: string;             //站点名称
            type: number;        //站点类型
            linkStatus: number;          //站点连接状态(0: 离线， 1:在线)
            usedSpace: number;           //站点已使用存储空间
            totalSpace: number;          //站点总存储空间
            siteKey: string;          //站点秘钥
            eossHTTPPort: number;        //站点存储服务器http端口
            eossHTTPSPort: number;      //站点存储服务器https端口
            masterIp: string;        //主站点访问地址（用于分站点更新时通知主站点更新）
            isSync: number;             //是否同步
            siteStatus: number;         //站点状态(0: 禁用， 1:启用)
            heartRate: number;          //站点心率值(0: 禁用， 1:启用)
        }

        /**
         * 添加或编辑上传站点数据类型
         */
        type ncTAddSiteParam = {
            ip: string,
            name: string,
            siteKey: string
        }

        /********************************** 函数声明*****************************/

        /**
         * 获取本地站点信息
         */
        type GetLocalSiteInfo = Core.APIs.ThriftAPI<
            void,
            SiteInfo
            >

        /**
         * 获取站点信息
         */
        type GetSiteInfo = Core.APIs.ThriftAPI<
            void,

            /**
             * 站点集合
             */
            Array<SiteInfo>
            >

        /**
         * 获取站点状态
         */
        type GetMultSiteStatus = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 设置站点状态
         */
        type SetMultSiteStatus = Core.APIs.ThriftAPI<
            boolean,
            void
            >

        /**
         * 添加站点
         */
        type AddSite = Core.APIs.ThriftAPI<
            /**
             * 添加时站点数据类型
             */
            ncTAddSiteParam,
            void
            >

        /**
         * 编辑站点
         */
        type EditSite = Core.APIs.ThriftAPI<
            /**
             * 编辑时站点数据类型
             */
            ncTAddSiteParam,
            void
            >

        /**
         * 删除站点
         */
        type DeleteSite = Core.APIs.ThriftAPI<
            string,
            void
            >
    }
}