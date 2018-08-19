declare namespace Components {
    namespace Quarantine {
        interface Props extends React.Props<void> {

        }

        interface State {
            /**
             * 非法文件
             */
            illegalFileList: Array<Core.IllegalControl.IllegalFileInfo>;

            /**
             * 结果总数
             */
            count: number;

            /**
             * 搜索关键字
             */
            searchKey: string;

            /**
             * 列表选中项
             */
            selections: Array<Core.IllegalControl.IllegalFileInfo>;

            /**
             * 默认操作
             */
            setDefault: boolean;

            /**
             * 还原错误信息
             */
            errMsg: string;

            /**
             * 文件被隔离的所有历史版本
             */
            historicalVersions: Array<Core.IllegalControl.IllegalFileInfo>;

            /**
             * 当前页
             */
            page: number;

            /**
             * 还原出错文件队列
             */
            errorQueue: Array<Errorcase>;

            /**
             * 是否只看申诉的文件
             */
            viewAppealedOnly: boolean;

            /**
             * 文件在申诉期
             */
            withinAppealValidity: boolean;

            /**
             * 是否显示审核申诉dialog
             */
            showAppealApproval: boolean;

            /**
             * 是否处于获取数据状态
             */
            inFetching: boolean;

            /**
             * 审核申诉窗口确定按钮禁用状态
             */
            disableApprovalConfirm: boolean;

            /**
             * 需审核的申诉文件
             */
            fileNeedReview: Array<Core.IllegalControl.IllegalFileInfo>;

        }

        interface Errorcase {
            file: object;

            errID: number;

            resolve: any;

            errStrategy: boolean;
        }
    }
}