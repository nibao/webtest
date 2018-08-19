declare namespace Components {
    namespace QuickSearch {
        interface Props extends React.Props<any> {
            /**
             * 从外部传入的文档对象
             */
            range: RangeInfos;

            /**
             * 请求返回的查询记录条数
             */
            rows: number;

            /**
             * 点击选择一条搜索结果
             */
            onSelectItem: (doc: Core.APIs.EFSHTTP.SearchedDoc) => any;

            /**
             * 跳转至高级搜索
             */
            onRequestGlobalSearch: (key: string, range?: string) => any;

            /**
             * 点击文档所在路径事件
             */
            onRequestOpenDir: (doc: Core.APIs.EFSHTTP.SearchedDoc) => any;
            
            /**
             * 组件挂载平台
             */
            platform?: string;
        }

        interface State {
            /**
             * 搜索关键字
             */
            searchKey: string;

            /**
             * 搜索范围
             */
            range: Range;

            /**
             * 搜索状态
             */
            status: number;

            /**
             * 搜索结果
             */
            results: any;

            /**
             * 当前选中结果索引值
             */
            selectIndex: number;

            /**
             * 错误场景
             */
            errorCase: {
                errCode: number;
                errMsg: string;
            };
        }

        /**
         * 搜索目录信息
         */
        type RangeInfos = {
            /**
             * 文档gns路径
             */
            docid: '',

            /**
             * 文档分类类型
             */
            viewType: 0
        }

        enum SearchStatus {

            Pending, // 无操作

            Fetching, // 正在搜索

            SearchInError, // 搜索出错

            Ok, // 完成搜索
        }

        enum Range {
            // 当前目录
            Current = 0,

            // 仅当前目录
            CurrentOnly = 1,

            // 所有目录
            All = 2
        }
    }
}