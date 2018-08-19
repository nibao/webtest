declare namespace Core {
    namespace IllegalControl {
        /**
         * 隔离区文件类型
         */
        type IllegalFileInfo = {
            /**
             * 文件gns路径
             */
            docid: string;

            /**
             * 文件版本号
             */
            versionId: string;

            /**
             * 文件名称
             */
            name: string;

            /**
             * 修改者
             */
            modifier: string;

            /**
             * 修改时间
             */
            modifie_time: number;

            /**
             * 文件路径
             */
            parentPath: string;

            /**
             * 隔离原因
             */
            reason: string;

            /**
             * 申诉有效期
             */
            appealExpiredTime: number;

            /**
             * 申诉信息
             */
            appeal: AppealInfo;

            /**
             * 服务器时间
             */
            serverTime: number;
        }

        type AppealInfo = {
            /**
             * 是否需要审核
             */
            needReview: boolean;

            /**
             * 申诉人
             */
            appellant: string;

            /**
             * 申诉理由
             */
            appealReason: string;
        }

        /**
         * 隔离区文件类型
         */
        enum QuarantineState {
            /**
             * 所有文件
             */
            ALL = 1,
            /**
             * 只看申诉文件
             */
            APPEAL = 2,
        }

        /**
         * 获取隔离区文件参数
         */
        type FiltrationParam = {
            //'ncTFiltrationParam'
            /**
             * 搜索关键字
             */
            key: string;

            /**
             * 隔离区文件类型
             */
            appeal: QuarantineState;
        }

        /**
         * 下载隔离区文件返回参数
         */
        type OSDowndloadRetParam = {
            /**
             * 文件版本号
             */
            rev: string;

            /**
             * 文件的当前名称
             */
            name: string;

            /**
             * 编辑者名称
             */
            editor: string;

            /**
             * 上传时间，UTC时间，此为上传版本时的服务器时间
             */
            modified: number;

            /**
             * 当前下载版本的总大小
             */
            size: number;

            /**
             * 由客户端设置的文件本地修改时间
             */
            client_mtime: number;

            /**
             * 包括：
             * method: 请求方法（必需）
             * url: 待上传的资源URL（必需）
             * authorization: 鉴权信息（非必需）
             * date: 服务器GMT格式时间（非必需）
             */
            auth_request: Array<string>;
        }
    }
}