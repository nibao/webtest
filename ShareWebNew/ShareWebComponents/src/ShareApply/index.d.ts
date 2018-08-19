declare namespace Components {
    namespace ShareApply {
        interface Props extends React.Props<any> {
            /**
             * 打开文件所在位置
             */
            doDirOpen?: (doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;

            /**
             * 打开文件
             */
            doFilePreview?: (doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;

            /**
             * 下载文件
             */
            doDownload?: (doc: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys) => any;
        }

        interface State {
            /**
             * 选择的权限申请类型（全部申请|待审核|已审核）
             */
            type: number;

            /**
             * 待审核的申请列表
             */
            unauditedDocs: Array<Core.APIs.EACHTTP.MyApplys>;

            /**
             * 已审核的申请列表
             */
            auditedDocs: Array<Core.APIs.EACHTTP.ShareApplyHistorys>;

            /** 
             * 全部申请列表 
             */
            allAppplications: Array<Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys>;

            /**
             * 搜索结果
             */
            filterResults: Array<Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys>;

            /**
             * 选中的文件
             */
            selection: Core.APIs.EACHTTP.MyApplys | Core.APIs.EACHTTP.ShareApplyHistorys;

            /**
             * 输入的搜索关键字
             */
            searchKey: string;

            /**
             * 拼接后的搜索关键字
             */
            searchValue: Array<object>;

            /**
             * 密级枚举数组
             */
            csfTextArray: ReadonlyArray<any>;
        }
    }
}