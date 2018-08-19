import * as React from 'react';
import { padLeft, noop } from 'lodash';
import { timer } from '../../util/timer/timer';
import { generateDaysOfMonth } from '../../util/date/date'
import WebComponent from '../webcomponent';
import { getActiveReportMonth, exportActiveReportMonth, opermGetEarliestTime, getGenActiveReportStatus } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import * as Highcharts from 'highcharts';
import __ from './locale';

export default class MonthActivitybase extends WebComponent<Console.MonthActivity.Props, Console.MonthActivity.State> {

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
            userInfos: []
        },
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth() + 1,
        loading: true,
        monthData: []
    }

    /**
     * 最小时间
     */
    minTime: Date = new Date()

    /**
     * 折线图对象
     */
    chart: any

    async componentWillMount() {
        const [year, month] = (await opermGetEarliestTime()).split('-');
        this.minTime = new Date(year, Number(month) - 1)
    }

    componentDidMount() {
        this.updateChart(`${this.state.selectedYear}-${padLeft(String(this.state.selectedMonth), 2, '0')}`)
    }

    /**
     * 选择月份
     * @param month 月份
     */
    protected onSelectMonth(month: number) {
        this.setState({
            selectedMonth: month,
            loading: true
        })
        this.updateChart(`${this.state.selectedYear}-${padLeft(String(month), 2, '0')}`)
    }

    /**
     * 选择年份
     */
    protected onSelectYear(year: number) {
        const maxYear = new Date().getFullYear(),
            maxMonth = year === maxYear ? new Date().getMonth() + 1 : 12;

        this.setState({
            selectedYear: year,
            selectedMonth: maxMonth,
            loading: true
        })
        this.updateChart(`${String(year)}-${padLeft(String(maxMonth), 2, '0')}`)
    }

    /**
     * 初始化折线图
     */
    private renderActiveChart() {
        let { monthData } = this.state

        this.chart = Highcharts.chart('month-active', {
            chart: {
                renderTo: 'daily-chart',
                type: 'spline',
                marginBottom: 90
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%m-%d',
                },
                tickInterval: 24 * 3600 * 1000

            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: __('活跃人数'),
                    rotation: 270,
                    margin: 20,
                    akign: 'middle',
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
            legend: {
                align: 'center',
                itemStyle: {
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                crosshairs: true,
                xDateFormat: '%Y-%m-%d',
                pointFormatter: function () {

                    return `<div><span style="color: rgb(47, 126, 216)">${__('当日活跃人数')}</span>:${monthData[this.index][2] === null ? '---' : this.options.y} </div> <br/><div><span style="color: rgb(47, 126, 216)">${__('当日活跃度')}</span>:${monthData[this.index][2] === null ? '---' : (monthData[this.index][2] * 100).toFixed(2) + '%'} </div>`
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
                    color: 'rgb(47, 126, 216)',
                    events: {
                        legendItemClick: function (e) {
                            return false
                        }
                    }
                }

            },

            series: [{
                name: `${__('日活跃数')}`
            }]
        })
    }

    /**
     * 更新折线图
     */
    private async updateChart(date: string) {
        try {
            const activeReportInfo = await getActiveReportMonth([date]);
            this.setState({
                activeReportInfo: activeReportInfo,
                loading: false,
                monthData: this.buildMonthData(activeReportInfo.userInfos ? activeReportInfo.userInfos : [])
            }, () => {
                this.renderActiveChart();
                this.chart.series[0].setData(this.state.monthData.map(([time, activeCount]) => {
                    return [time, activeCount]
                }))
            })
        } catch (ex) {
            this.setState({
                loading: false
            })
            this.buildMonthData([])
        }


    }

    /**
     * 导出报表
     */
    protected async exportActivity() {
        let date = `${String(this.state.selectedYear)}-${padLeft(String(this.state.selectedMonth), 2, '0')}`
        let taskId = await exportActiveReportMonth([__('${time}月度活跃报表.csv', {
            time: date
        }), date])
        this.getCompressProgress(taskId)
        manageLog(
            ManagementOps.EXPORT,
            __('导出 月度活跃报表 成功'),
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
     * 构造完整的数据
     */
    private buildMonthData(userInfos) {
        const maxDay = new Date().getDate(),
            maxMonth = new Date().getMonth() + 1,
            maxYear = new Date().getFullYear();
        const { selectedMonth, selectedYear } = this.state;
        let days = generateDaysOfMonth(Number(selectedYear), Number(selectedMonth));
        return days.reduce((monthData, value) => {
            let dayTime = value.getDate(),
                monthTime = value.getMonth() + 1,
                yearTime = value.getFullYear();
            let currentValue;
            if (yearTime === maxYear && maxMonth === monthTime && dayTime > maxDay) {
                return monthData
            } else {
                for (let v of userInfos) {
                    const [year, month, day] = v.time.split('-');
                    if (Number(day) === dayTime) {
                        currentValue = [Date.UTC(year, month - 1, day), v.activeCount, v.userActivity];
                        break;
                    }
                }
                if (currentValue) {
                    return [...monthData, currentValue];
                } else {
                    return [...monthData, [Date.UTC(yearTime, monthTime - 1, dayTime), 0, null]]
                }
            }

        }, [])
    }
}


