import * as React from 'react';
import { Select, PlainButton, UIIcon, ProgressCircle } from '../../ui/ui.desktop';
import YearActivityBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';


export default class YearActivity extends YearActivityBase {
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
                            __('查询年份：')
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
                                            ` ${(activeReportInfo.avgActivity * 100).toFixed(2)}% `
                                        }
                                    </span>
                                </div>
                            </div>

                            <div
                                id="year-active"
                            >
                            </div>

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
        const min = this.minTime.getFullYear(), max = new Date().getFullYear()

        return (<Select
            value={this.state.selectedYear}
            width={100}
            menu={{
                width: 100
            }}
            onChange={(value) => { this.onSelectedYear(value) }}
        >
            {
                Array.from({ length: max - min + 1 }, (value, index) => {
                    let year = max - index
                    return (
                        <Select.Option
                            value={year}
                            selected={(year) === this.state.selectedYear}
                        >
                            {
                                String(year)
                            }
                        </Select.Option>
                    )
                })
            }
        </Select>)
    }
}