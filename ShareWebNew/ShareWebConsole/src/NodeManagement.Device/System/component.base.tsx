import * as React from 'react'
import * as Highcharts from 'highcharts'

export default class SystemBase extends React.Component<Console.NodeManagementDevice.System.Props> {

    static defaultProps = {
        cpuUsage: 0,
        memoryInfo: {},
        networkOutgoingRate: 0,
        networkIncomingRate: 0,
        sysVolume: {},
        cacheVolume: {},
    }

    /**
     * 页面渲染完成之后，绘制饼图
     */
    componentDidMount() {
        const { sysVolume, cacheVolume } = this.props

        this.drawPie('systemDisk', ['#00a1e9', '#dedede'], sysVolume)
        if (cacheVolume['capacity_gb'] !== 0 && cacheVolume['used_size_gb'] !== -1) {
            this.drawPie('cacheDisk', ['#4cb76f', '#dedede'], cacheVolume)
        }
    }

    /**
     * 绘制饼图
     * @param {string} elementID 绘制区域的元素id
     * @param {ReadonlyArray<string>} color 绘制pie的颜色数组
     * @param {Core.ECMSManager.ncTVolume} diskInfo 磁盘信息（用于提取使用容量和总容量信息）
     */
    private drawPie(elementID: string, color: ReadonlyArray<string>, diskInfo: Core.ECMSManager.ncTVolume) {
        const usage = [
            [
                diskInfo['used_size_gb']
            ],
            [
                diskInfo['capacity_gb'] - diskInfo['used_size_gb']
            ]
        ]
        Highcharts.chart(elementID, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 150,
                width: 150,
                backgroundColor: '#fff'
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            },
            colors: color,
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                data: usage
            }]
        });
    }
}



