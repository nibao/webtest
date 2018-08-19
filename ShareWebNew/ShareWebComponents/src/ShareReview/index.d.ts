declare namespace Components {
    namespace ShareReview {

        interface Props extends React.Props<any> {
            /**
             * 路由
             */
            location: any;

            /**
             * 当前打开的文档
             */
            doc: any;

            /**
             * 文档路径发生变化
             */
            onPathChange: (applyid?: string, doc?: Core.APIs.EACHTTP.ApplyApproval | Core.Docs.Doc ) => void;

        }

        interface State {
            /**
             * 审核信息
             */
            applyInfos: {
                /**
                 * 待审核 + 审核历史
                 */
                all: ReadonlyArray<Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory>;

                /**
                 * 待审核
                 */
                pending: ReadonlyArray<Core.APIs.EACHTTP.ApplyApproval>;

                /**
                 * 审核历史
                 */
                history: ReadonlyArray<Core.APIs.EACHTTP.ShareApproveHistory>;
            };

            /**
             * 当前选择的审核信息类型
             */
            selectedReviewType: number;

            /**
             * 系统密级枚举
             */
            csfTextArray: Array<string>;

            /**
             * 是否正在审核
             */
            inReview: boolean;

            /**
             * 审核异常
             */
            approveException: object;

            /**
             * 列举目录异常
             */
            errors: Array<object>;

            /**
             * 列举目录异常确认事件
             */
            confirmError: () => void;

            /**
             *  文件夹列表
             */
            list: ReadonlyArray<Core.Docs.Doc>;

            /**
             * 正在加载
             */
            loading: boolean;

            /**
             * 加载打开目录
             */
            loadingDir: boolean;

            /**
             * 文档路径数组
             */
            crumbs: ReadonlyArray<any>;

            /**
             * 审核列表选中项
             */
            reviewSelection: Core.APIs.EACHTTP.ApplyApproval;

            /**
             * 打开目录选中项
             */
            docSelection: Core.Docs.Doc;
        }
    }
}