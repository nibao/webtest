declare namespace Console {
    namespace MonthActivity {
        interface Props extends React.Props<void> {
            /**
             * 导出报表成功
             */
            onExportComplete: (url) => any
        }

        interface State {
            activeReportInfo: Core.ShareMgnt.ActiveReportInfo;

            /**
             * 当前选中年份
             */
            selectedYear: number;

            /**
             * 当前选中月份
             */
            selectedMonth: number;

            /**
             * 加载状态
             */
            loading: boolean;

            /**
             * 月份的总数据
             */
            monthData: ReadonlyArray<[any, number, number]>

        }
    }
}