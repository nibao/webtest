import * as React from 'react';
import * as _ from 'lodash';
import WebComponent from '../../../../webcomponent';
import __ from './locale';
import { TimeType } from '../../helper';

export default class RangeMenuBase extends WebComponent<Components.FullSearch.FullTextSearch.RangeMenu.Props, Components.FullSearch.FullTextSearch.RangeMenu.State> {

    static defaultProps = {
        enableType: true,
        rangeInfo: {
            rangeLeftValue: '',
            rangeRightValue: '',
            rangeLeftType: '',
            rangeRightType: ''
        }

    }


    state = {
        rangeInfo: this.props.rangeInfo,
        clickStatus: false,
    }


    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.rangeInfo, nextProps.rangeInfo)) {

            this.setState({
                rangeInfo: nextProps.rangeInfo
            })
        }

    }


    /**
     * 点击范围菜单按钮
     */
    protected handleClickRangeMenuBtn(e) {
        this.setState({
            clickStatus: true
        })
    }

    /**
     * 范围菜单变化
     */
    protected handleRangeInputChange(e, which) {
        let value = e.target.value;

        let { rangeInfo } = this.state;


        // 输入必须为非负整数
        if (value.search(/^\d+$/g) === -1 && value !== '') {
            return;
        }

        // 有单位的统一限制为6位，纯数值限制为15位
        if (this.props.hex && value.toString().length > 6) {
            return;
        } else if (value.toString().length > 15) {
            return
        }

        // 首位为0时，第二次输入的数字为非0数字时，覆盖掉0，否则不可输入
        if (value[0] === '0' && value.length === 2 && value[1] !== '0') {
            which === 'left' ?
                rangeInfo.rangeLeftValue = value[1]
                :
                rangeInfo.rangeRightValue = value[1]

        } else if (value[0] === '0' && value.length === 2 && value[1] === '0') {
            return;

        } else {
            which === 'left' ?
                rangeInfo.rangeLeftValue = e.target.value
                :
                rangeInfo.rangeRightValue = e.target.value
        }




        this.props.onChange(rangeInfo);
    }


    /**
     * 选择范围类型
     */
    protected handleClickRangeTypeSelection(e, which, type) {

        let value = which === 'left' ? this.state.rangeInfo.rangeLeftValue : this.state.rangeInfo.rangeRightValue;

        // 如果为时长范围菜单，需要转换成秒进行限制19位
        if (this.props.hex === 60) {
            switch (which === 'left' ? this.state.rangeInfo.rangeLeftType : this.state.rangeInfo.rangeRightType) {
                case TimeType.SECONDS:
                    break;
                case TimeType.MINUTES:
                    value = parseInt(value) * 60
                    break;
                case TimeType.HOURS:
                    value = parseInt(value) * 60 * 60
                    break;
                default:
                    break;
            }

        }

        if (value.toString().length > 19) {
            return;
        }

        let { rangeInfo } = this.state;
        which === 'left' ?
            rangeInfo.rangeLeftType = type
            :
            rangeInfo.rangeRightType = type


        this.props.onChange(rangeInfo);

    }

    /**
     * 清空范围菜单
     */
    protected handleClickEmptyRangeMenu(e) {

        let { rangeInfo } = this.state;
        rangeInfo.rangeLeftValue = '';
        rangeInfo.rangeRightValue = '';

        this.props.onChange(rangeInfo);
    }

    shouldOutMenuClose = true;

    // 延迟定时器
    timeout: number | null = null;

    /**
     * 点击弹出框外时触发
     */
    protected handleCloseMenu(close) {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
            if (this.shouldOutMenuClose) {
                close();
                this.setState({
                    clickStatus: false
                })
            } else {
                this.shouldOutMenuClose = true
            }
        }, 150)
    }


    /**
     * 点击子菜单内部或者外部
     */
    protected handleClickOrCloseChildMenu(close) {
        this.shouldOutMenuClose = false;
        close();
    }

    /**
     * 点击子菜单内部
     */
    protected handleClickOrCloseChildMenu2(close) {
        this.shouldOutMenuClose = false;
        close();
    }



}