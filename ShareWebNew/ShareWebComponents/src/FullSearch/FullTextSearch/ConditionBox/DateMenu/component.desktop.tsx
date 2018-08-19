import * as React from 'react';
import * as classnames from 'classnames';
import Button from '../../../../../ui/Button/ui.desktop';
import LinkButton from '../../../../../ui/LinkButton/ui.desktop';
import DateBox from '../../../../../ui/DateBox/ui.desktop';
import TriggerPopMenu from '../../../../../ui/TriggerPopMenu/ui.desktop';
import RadioBoxOption from '../../../../../ui/RadioBoxOption/ui.desktop';
import UIIcon from '../../../../../ui/UIIcon/ui.desktop';
import { formatTime } from '../../../../../util/formatters/formatters';
import { DateType } from '../../helper';
import DateMenuBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class DateMenu extends DateMenuBase {

    render() {

        const selectRange = [new Date(-28801000), this.today];
        let { enableDateSelect, label, className } = this.props;
        let { dateType, dateRange } = this.state;

        return (
            <div className={classnames(styles['date-menu'], className)}>
                <span className={styles['attr-title']}>{label}{__('：')}</span>

                <TriggerPopMenu
                    popMenuClassName={styles['condition-modified-menu']}
                    label={this.renderDateBoxTitle(dateType, dateRange)}
                    onRequestCloseWhenBlur={close => this.handleCloseOuterMenu(close)}
                    timeout={150}
                >
                    {
                        enableDateSelect ?
                            <div className={styles['inline-title']}>
                                <RadioBoxOption
                                    checked={dateType === DateType.CREATED}
                                    onChange={this.handleDateBoxRadioChange.bind(this)}
                                    className={styles['inline-radio']}
                                    value={DateType.CREATED}

                                >
                                    <span className={styles['datebox-type']}>
                                        {__('创建时间')}
                                    </span>
                                </RadioBoxOption>
                                <RadioBoxOption
                                    checked={dateType === DateType.MODIFIED}
                                    onChange={this.handleDateBoxRadioChange.bind(this)}
                                    className={styles['inline-radio']}
                                    value={DateType.MODIFIED}

                                >
                                    <span className={styles['datebox-type']}>
                                        {__('修改时间')}
                                    </span>
                                </RadioBoxOption>


                            </div>
                            :
                            null
                    }

                    <div className={styles['inline-datebox']} >
                        <DateBox
                            format="yyyy/MM/dd"
                            width={120}
                            value={dateRange[0]}
                            startsFromZero={true}
                            selectRange={selectRange}
                            shouldShowblankStatus={dateRange[0] === 0}
                            onChange={(date) => { this.handleChangeDate('begin', date); }}
                            onActive={(active) => { this.handleDateBoxActive(active); }}
                            onDatePickerClick={(active) => {this.handleDatePickerClick(active)}}
                        />
                    </div>
                    <UIIcon
                        className={styles['short-line-icon']}
                        code={'\uF071'}
                        size="16px"
                    >
                    </UIIcon>
                    <div className={styles['inline-datebox']}>
                        <DateBox
                            format="yyyy/MM/dd"
                            width={120}
                            value={dateRange[1]}
                            selectRange={selectRange}
                            shouldShowblankStatus={dateRange[1] === 0}
                            onChange={(date) => { this.handleChangeDate('end', date); }}
                            onActive={(active) => { this.handleDateBoxActive(active); }}
                            onDatePickerClick={(active) => {this.handleDatePickerClick(active)}}
                        />

                    </div>

                    <LinkButton
                        onClick={this.handleClickEmptyDateMenu.bind(this)}
                        disabled={dateRange[0] === 0 && dateRange[1] === 0}
                    >
                        {__('清空')}
                    </LinkButton>
                </TriggerPopMenu>


            </div >
        )
    }

    /**
     * 九种时间范围标题： 不限 | 创建(修改)于 YYYY/MM/DD | 创建(修改)于 YYYY/MM/DD 以前 | 
     *                      创建(修改)于 YYYY/MM/DD 以后 | 创建(修改)于 YYYY/MM/DD（小） - YYYY/MM/DD（大）
     */
    renderDateBoxTitle(dateType, dateRange) {
        let [beginDate, endDate] = dateRange;
        let begindate = this.chargeDate(beginDate)
        let enddate = this.chargeDate(endDate)
        let rangedate = '';

        if (dateType === DateType.UNLIMITED || (beginDate === 0 && endDate === 0)) {
            return __('不限')
        }

        if (begindate === enddate) {
            rangedate = enddate
            return dateType === DateType.CREATED ?
                __('创建于') + rangedate
                :
                __('修改于') + rangedate
        } else if (begindate === 0) {
            return dateType === DateType.CREATED ?
                __('创建于${value}以前', { value: enddate })
                :
                __('修改于${value}以前', { value: enddate })

        } else if (enddate === 0) {
            return dateType === DateType.CREATED ?
                __('创建于${value}以后', { value: begindate })
                :
                __('修改于${value}以后', { value: begindate })
        } else {
            rangedate = endDate.getTime() > beginDate.getTime() ? begindate + '-' + enddate : enddate + '-' + begindate
            return dateType === DateType.CREATED ?
                __('创建于') + rangedate
                :
                __('修改于') + rangedate
        }


    }

    /**
     * 返回日期字符串
     * @param date Date
     * @return yyyy/MM/dd
     */
    chargeDate(date) {
        const todayStart = new Date(new Date().toLocaleDateString()).getTime();
        const todayEnd = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;

        const yesterDayStart = new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000;
        const yesterDayEnd = new Date(new Date().toLocaleDateString()).getTime() - 1;

        if (date === 0) {
            return date;
        } else {
            return formatTime(parseInt(date.getTime().toString().slice(0, 13)), 'yyyy/MM/dd');
        }


    }

}