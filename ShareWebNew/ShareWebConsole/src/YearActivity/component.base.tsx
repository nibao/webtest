import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { timer } from '../../util/timer/timer';
import { getActiveReportYear, exportActiveReportYear, opermGetEarliestTime, getGenActiveReportStatus } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import * as Highcharts from 'highcharts';
import __ from './locale';

export default class YearActivitybase extends WebComponent<Console.YearActivity.Props, Console.YearActivity.State> {

    static defaultProps = {
        onExportComplete: noop
    }

    state = {
        activeReportInfo: {
            /**
             * 平均用户数
             */
            avgCount: 0,

            /**
             * 平均活跃度
             */
            avgActivity: 0,

            /**
             * 活跃用户数信息
             */
            userInfos: [],

            /**
             * 完整年数据
             */
            yearData: [],
        },

        /**
         * 当前选择年份
         */
        selectedYear: new Date().getFullYear(),

        /**
         * 加载状态
         */
        loading: true,

        /**
         * 年的完整数据
         */
        yearData: []


    }
    minTime: Date = new Date()
    chart

    async componentWillMount() {
        const [year, month] = (await opermGetEarliestTime()).split('-');
        this.minTime = new Date(year, Number(month) - 1)
    }

    componentDidMount() {
        this.updateCharts(String(this.state.selectedYear));

    }

    /**
     * 选择年份
     * @param year 
     */
    protected onSelectedYear(year: number) {
        this.setState({
            selectedYear: year,
            loading: true
        })

        this.updateCharts(String(year));
    }

    /**
     * 初始化折线图
     */
    private renderActiveChart() {
        let { yearData } = this.state
        this.chart = Highcharts.chart('year-active', {
            chart: {
                renderTo: 'daily-chart',
                type: 'spline'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            legend: {
                align: 'center',
                itemStyle: {
                    fontWeight: 'normal'
                }
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%Y-%m',
                },
                tickInterval: 24 * 3600 * 1000 * 30,
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: __('活跃人数'),
                    rotation: 270,
                    margin: 20,
                    style: {
                        color: '#4d759e'
                    }
                },
                labels: {
                    formatter: function () {
                        return this.value + __('人')
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                xDateFormat: '%Y-%m',
                pointFormatter: function () {

                    return `<div><span style="color: rgb(47, 126, 216)">${__('当月活跃人数')}</span>:${yearData[this.index][2] === null ? '---' : this.options.y} </div> <br/><div><span style="color: rgb(47, 126, 216)">${__('当月活跃度')}</span>:${yearData[this.index][2] === null ? '---' : (yearData[this.index][2] * 100).toFixed(2) + '%'} </div>`
                }
            },

            plotOptions: {
                spline: {
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: false
                    },
                    enableMouseTracking: true
                },
                series: {
                    events: {
                        legendItemClick: function (e) {
                            return false
                        }
                    }
                }

            },

            series: [{
                name: `${__('月活跃数')}`,
            }]
        })
    }

    /**
     * 更新折线图
     */
    private async updateCharts(date: string) {
        try {
            const activeReportInfo = await getActiveReportYear([date])
            this.setState({
                activeReportInfo: activeReportInfo,
                loading: false,
                yearData: this.buidYearsData(activeReportInfo.userInfos ? activeReportInfo.userInfos : [])
            }, () => {
                this.renderActiveChart();
                this.chart.series[0].setData(this.state.yearData.map(([time, activeCount]) => {
                    return [time, activeCount]
                }))
            })
        }
        catch (ex) {
            this.setState({
                loading: false
            })
            this.buidYearsData([])
        }
    }

    /**
     * 导出报表
     */
    protected async exportActivity() {
        let taskId = await exportActiveReportYear([__('${time}年度活跃报表.csv', {
            time: this.state.selectedYear
        }), String(this.state.selectedYear)])
        this.getCompressProgress(taskId)
        manageLog(
            ManagementOps.EXPORT,
            __('导出 年度活跃报表 成功'),
            null,
            Level.INFO
        )
    }

    /**
     * 获取进度
     */
    private getCompressProgress(taskId) {
        let time = timer(() => {
            return getGenActiveReportStatus([taskId]).then(compressStatus => {
                if (compressStatus) {
                    time();
                    this.props.onExportComplete(`/interface/onlinestatistics/downloadActivity?taskId=${taskId}`)
                }
            })
        }, 1000)
    }

    /**
     * 构造年数据
     */
    private buidYearsData(data) {
        const maxYear = new Date().getFullYear(),
            maxMonth = new Date().getMonth() + 1;
        let { selectedYear } = this.state;

        return Array.from({ length: maxYear === selectedYear ? maxMonth : 12 }, (value, index) => {
            let currentValue;
            for (let v of data) {
                const [year, month] = v.time.split('-');
                if ((Number(month) - 1) === index) {
                    currentValue = [Date.UTC(year, index), v.activeCount, v.userActivity];
                    break;
                }
            }

            if (currentValue) {
                return currentValue
            } else {
                return currentValue = [Date.UTC(selectedYear, index), 0, null]
            }
        })
    }

}


