declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            namespace DateMenu {
                interface Props extends React.Props<any> {

                    /**
                     * 是否显示时间控件面板
                     */
                    enableDateSelect?: boolean;

                    /**
                     * 标题文字
                     */
                    label: string;

                    /**
                     * 样式
                     */
                    className?: string;

                    /**
                     * 开始、结束时间范围
                     */
                    dateRange: Array<number>;

                    /**
                     * 日期类型： 不限 0 | 创建时期 1  | 修改日期 2
                     */
                    dateType: number;

                    /**
                     * 时间数值变动时触发
                     */
                    onDateChange: (dateRange: Array<number>) => void;

                    /**
                     * 时间类型变动时触发
                     */
                    onTypeChange: (dateType: number) => void;

                }

                interface State {
                    /**
                     * 开始、结束时间范围
                     */
                    dateRange: Array<number>;

                    /**
                     * 日期类型： 不限 0 | 创建时期 1  | 修改日期 2
                     */
                    dateType: number;

                    /**
                     * 点击状态
                     */
                    clickStatus: boolean;
                }
            }

        }
    }

}