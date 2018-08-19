declare namespace Components {
    namespace ViewSize {
        interface Props extends React.Props<void> {

            /**
             * 选中的文件
             */
            docs: ReadonlyArray<Core.Docs.Docs>;

            /**
             * 是否是回收站
             */
            onlyrecycle: boolean;

            /**
             * 统计完成回调函数
             * @param docs
             */
            onStatisticsCompleted: (docs) => void;

            /**
             * 确认按钮
             * @param size:大小
             */
            onStaticsConfirm: () => void;

            /**
             * 取消按钮
             * goToEntry: 是否返回上级目录
             * shouldRefresh: 是否需要刷新
             */
            onStaticsCancel: (shouldRefresh?: boolean, goToEntry?: boolean) => void;

            /**
             * 打开窗口时触发
             */
            onOpenViewSizeDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 查询状态
             */
            isQuering: boolean,

            /**
             * 大小详情
             */
            size: Core.APIs.EFSHTTP.SizeResult,

            /**
             * 回调返回的数据
             */
            docs: Array<Core.Docs.Docs>;

            /**
             * 是否显示错误弹出框
             */
            showError: boolean;

            /**
             * 错误码
             */
            errorCode: number;

            /**
             * 错误对象
             */
            errorDoc: Core.Docs.Doc;
        }

    }
} 