import * as React from 'react';
import * as _ from 'lodash';
import WebComponent from '../../../../webcomponent';
import { servertime } from '../../../../../core/apis/eachttp/auth/auth';
import { DateType } from '../../helper';
import __ from './locale'

export default class DateMenuBase extends WebComponent<Components.FullSearch.FullTextSearch.DateMenu.Props, Components.FullSearch.FullTextSearch.DateMenu.State> {

    static defaultProps = {
        enableDateSelect: true,
        dateRange: [0, 0],
        dateType: DateType.UNLIMITED
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {

        /**
         * 时间范围类型 ： 创建 | 修改 | 不限
         */
        dateType: DateType.MODIFIED,

        /**
         * 开始、结束时间范围
         */
        dateRange: [0, 0],

        /**
         * 点击状态
         */
        clickStatus: false
    }

    shouldOutMenuClose = true;

    today = null;

    async componentWillMount() {
        let { time } = await servertime();
        this.today = new Date(time / 1000);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.dateRange, nextProps.dateRange)) {
            this.setState({
                dateRange: nextProps.dateRange
            })
        }
        if (this.props.dateType !== nextProps.dateType) {
            this.setState({
                dateType: nextProps.dateType
            })
        }

    }

    /**
     * 点击范围菜单按钮
     */
    protected handleClickSearchDateBtn(e) {
        this.setState({
            clickStatus: true
        })
    }

    /**
     * 改变时间范围的类型
     */
    protected handleDateBoxRadioChange(checked, value) {
        this.props.onTypeChange(value)
    }

    /**
     * 时间菜单变化
     */
    protected handleChangeDate(which, date) {
        this.shouldOutMenuClose = true;

        if (which === 'begin') {
            // 若结束日期已选定，则起始日期必须小于结束日期
            if (this.state.dateRange[1] !== 0 && date.getTime() > this.state.dateRange[1].getTime()) {
                this.context.toast(__('起始时间不能晚于结束时间'));
                return;
            }

            this.props.onDateChange([date, this.state.dateRange[1]])
        } else {
            // 若起始日期已选定，则结束日期必须大于起始日期
            if (this.state.dateRange[0] !== 0 && date.getTime() < this.state.dateRange[0].getTime()) {
                this.context.toast(__('结束时间不能早于起始时间'));
                return;
            }
            this.props.onDateChange([this.state.dateRange[0], date])
        }

    }

    /**
     * 清空范围菜单
     */
    protected handleClickEmptyDateMenu(e) {
        this.props.onDateChange([])
    }

    /**
     * 点击弹出框外时触发
     */
    protected handleCloseOuterMenu(close) {
        if (this.shouldOutMenuClose) {
            close();
            this.setState({
                clickStatus: false
            })
        }

    }

    handleDatePickerClick(active) {
        this.shouldOutMenuClose = !active
    }

    /**
     * 监听到日历控件打开状态
     */
    handleDateBoxActive(active) {
        // 如果日历控件被点击或被打开，则不对父面板的失焦做任何处理
        this.shouldOutMenuClose = !active
    }

}