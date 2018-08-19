import * as React from 'react';
import * as classnames from 'classnames'
import { padLeft } from 'lodash';
import { Select, UIIcon, PlainButton, ProgressCircle } from '../../ui/ui.desktop';
import MonthActivityBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';


export default class MonthActivity extends MonthActivityBase {

    render() {
        const { activeReportInfo } = this.state
        return (
            <div className={styles['contain']}>
                <div className={styles['head-bar']}>
                    <div className={styles['bar-icon']}>
                        <UIIcon code="\uf016" size={20} />
                    </div>
                    <span>
                        {
                            __('查询月份：')
                        }
                    </span>

                    <div className={styles['time-select']}>
                        <span>
                            {
                                this.getYearsOptions()
                            }
                        </span>
                        <span className={styles['time-label']}>
                            {
                                __('年')
                            }
                        </span>
                    </div>
                    <div className={styles['time-select']}>
                        <span>
                            {
                                this.getMonthsOptions()
                            }
                        </span>
                        <span className={styles['time-label']}>
                            {
                                __('月')
                            }
                        </span>

                    </div>
                    <div className={styles['export-btn']}>
                        <PlainButton
                            icon={'\uf0a5'}
                            disabled={!(activeReportInfo && activeReportInfo.userInfos && activeReportInfo.userInfos.length)}
                            size={16}
                            onClick={this.exportActivity.bind(this)}
                        >
                            {
                                __('导出活跃报表')
                            }
                        </PlainButton>
                    </div>

                </div>
                {

                    (
                        <div>
                            <div className={styles['active-tip']}>

                                <div className={styles['active-lab']}>
                                    <label>
                                        {__('平均活跃人数：')}
                                    </label>
                                    <span>
                                        {
                                            activeReportInfo.avgCount + __('人')
                                        }
                                    </span>
                                </div>
                                <div className={styles['active-lab']}>
                                    <label>
                                        {__('平均活跃度：')}
                                    </label>
                                    <span>
                                        {
                                            `${(activeReportInfo.avgActivity * 100).toFixed(2)}%`
                                        }
                                    </span>
                                </div>
                            </div>
                            <p
                                id="month-active"
                                className={styles['chart']}
                            >

                            </p>

                        </div>

                    )

                }

                {
                    this.state.loading ?
                        (
                            <ProgressCircle detail={__('正在加载，请稍候...')} />
                        ) :
                        null
                }


            </div>
        )
    }


    getYearsOptions() {
        const min = this.minTime.getFullYear(),
            max = new Date().getFullYear(),
            { selectedYear } = this.state
        return (
            <Select
                value={selectedYear}
                width={100}
                menu={{
                    width: 100
                }}
                onChange={(value) => { this.onSelectYear(value) }}
            >
                {
                    Array.from({ length: max - min + 1 }, (value, index) => {
                        let year = max - index;
                        return (

                            <Select.Option
                                value={year}
                                selected={(year) === selectedYear}
                            >
                                {
                                    String(year)
                                }
                            </Select.Option>
                        )
                    })
                }
            </Select>
        )
    }


    getMonthsOptions() {
        const maxMonth = new Date().getMonth() + 1,
            minMonth = this.minTime.getMonth() + 1,
            minYear = this.minTime.getFullYear(),
            maxYear = new Date().getFullYear(),
            { selectedYear, selectedMonth } = this.state

        return (
            <Select
                value={selectedMonth}
                width={100}
                menu={{
                    width: 100
                }}
                onChange={(value) => { this.onSelectMonth(value) }}
            >
                {
                    this.getOptions()
                }
            </Select>
        )

    }


    getOptions() {
        const maxMonth = new Date().getMonth() + 1,
            minMonth = this.minTime.getMonth() + 1,
            minYear = this.minTime.getFullYear(),
            maxYear = new Date().getFullYear(),
            { selectedYear, selectedMonth } = this.state
        switch (true) {
            case (maxYear === minYear):
                return Array.from({ length: maxMonth - minMonth + 1 }, (value, index) => {
                    let month = maxMonth - index
                    return (
                        <Select.Option
                            value={month}
                            selected={(month) === selectedMonth}
                        >
                            {
                                padLeft(String(month), 2, '0')
                            }
                        </Select.Option>
                    )
                })
            case (selectedYear === minYear):
                return Array.from({ length: 12 - minMonth + 1 }, (value, index) => {
                    let month = 12 - index
                    return (
                        <Select.Option
                            value={month}
                            selected={(month) === selectedMonth}
                        >
                            {
                                padLeft(String(month), 2, '0')
                            }
                        </Select.Option>
                    )
                })
            case (selectedYear === maxYear):
                return Array.from({ length: maxMonth }, (value, index) => {
                    let month = maxMonth - index
                    return (
                        <Select.Option
                            value={month}
                            selected={(month) === selectedMonth}
                        >
                            {
                                padLeft(String(month), 2, '0')
                            }
                        </Select.Option>
                    )
                }
                )
            default:
                return Array.from({ length: 12 }, (value, index) => {
                    let month = 12 - index
                    return (
                        <Select.Option
                            value={month}
                            selected={(month) === selectedMonth}
                        >
                            {
                                padLeft(String(month), 2, '0')
                            }
                        </Select.Option>
                    )
                })
        }
    }
}