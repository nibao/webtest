declare namespace Console {
    namespace YearActivity {
        interface Props extends React.Props<void> {
            /**
             * 导出报表成功
             */
            onExportComplete: (url) => any
        }

        interface State {
            /**
             * 活跃数据
             */
            activeReportInfo: Core.ShareMgnt.ActiveReportInfo;

            /**
             * 当前选中年份
             */
            selectedYear: number;

            /**
             * 加载状态
             */
            loading: boolean;

            /**
             * 年份中数据
             */
            yearData: Array<[any, number, number]>
        }
    }
}