import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import Button from '../../../../../ui/Button/ui.desktop';
import LinkButton from '../../../../../ui/LinkButton/ui.desktop';
import TriggerPopMenu from '../../../../../ui/TriggerPopMenu/ui.desktop';
import PopMenu from '../../../../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../../../../ui/PopMenu.Item/ui.desktop';
import UIIcon from '../../../../../ui/UIIcon/ui.desktop';
import { decorateText, shrinkText } from '../../../../../util/formatters/formatters';
import RangeMenuBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';
import { TimeType } from '../../helper';

export default class RangeMenu extends RangeMenuBase {

    render() {

        let { hex, enableType, label, rangeTypes, className } = this.props;
        let { rangeInfo } = this.state;

        return (
            <div className={classnames(styles['range-menu'], className)}>
                <span className={styles['attr-title']}>{label}{__('：')}</span>

                <TriggerPopMenu
                    popMenuClassName={styles['condition-range-menu']}
                    title={this.renderRangeMenuTitle2(rangeInfo, enableType)}
                    label={this.renderRangeMenuTitle(rangeInfo, enableType)}
                    onRequestCloseWhenBlur={close => this.handleCloseMenu(close)}
                    timeout={150}
                >
                    <div className={styles['inline-rangebox']}>
                        <input
                            className={styles['range-input']}
                            type="text"
                            value={rangeInfo.rangeLeftValue}
                            onChange={(e) => { this.handleRangeInputChange(e, 'left') }}
                        />

                        <PopMenu
                            anchorOrigin={['left', 'bottom']}
                            targetOrigin={['left', 'top']}
                            className={classnames(styles['condition-rangetype-menu'])}
                            freezable={false}
                            trigger={
                                enableType ?
                                    <Button
                                        className={classnames(styles['range-type-button'])}
                                    >
                                        <div className={classnames(styles['button-box'])}>
                                            <span className={classnames(styles['button-text-type'])} >
                                                {this.renderTypeName(hex, rangeInfo.rangeLeftType ? rangeInfo.rangeLeftType : rangeTypes[0])}
                                            </span>
                                            <UIIcon
                                                className={classnames(styles['expand-icon'])}
                                                code={'\uF04C'}
                                                size="16px"
                                            >
                                            </UIIcon>
                                        </div>
                                    </Button>
                                    :
                                    null
                            }
                            triggerEvent={'click'}
                            onRequestCloseWhenClick={close => this.handleClickOrCloseChildMenu(close)}
                            onRequestCloseWhenBlur={close => this.handleClickOrCloseChildMenu(close)}
                        >
                            {
                                enableType && rangeTypes.map((type) =>
                                    <PopMenuItem
                                        className={styles['rangetype-menu-item']}
                                        label={this.renderTypeName(hex, type)}
                                        onClick={(e) => { this.handleClickRangeTypeSelection(e, 'left', type) }}
                                    >
                                    </PopMenuItem>
                                )
                            }

                        </PopMenu>

                        <UIIcon
                            className={styles['short-line-icon']}
                            code={'\uF071'}
                            size="17px"
                        >
                        </UIIcon>

                        <input
                            className={styles['range-input']}
                            type="text"
                            value={rangeInfo.rangeRightValue}
                            onChange={(e) => { this.handleRangeInputChange(e, 'right') }}
                        />

                        <PopMenu
                            anchorOrigin={['left', 'bottom']}
                            targetOrigin={['left', 'top']}
                            className={classnames(styles['condition-rangetype-menu'])}
                            freezable={false}
                            trigger={
                                enableType ?
                                    <Button
                                        className={classnames(styles['range-type-button'])}
                                    >
                                        <div className={classnames(styles['button-box'])}>
                                            <span className={classnames(styles['button-text-type'])} >
                                                {this.renderTypeName(hex, rangeInfo.rangeRightType ? rangeInfo.rangeRightType : rangeTypes[0])}
                                            </span>
                                            <UIIcon
                                                className={classnames(styles['expand-icon'])}
                                                code={'\uF04C'}
                                                size="17px"
                                            >
                                            </UIIcon>
                                        </div>
                                    </Button>
                                    :
                                    null
                            }
                            triggerEvent={'click'}
                            onRequestCloseWhenClick={close => this.handleClickOrCloseChildMenu2(close)}
                            onRequestCloseWhenBlur={close => this.handleClickOrCloseChildMenu2(close)}
                        >
                            {
                                enableType && rangeTypes.map((type) =>
                                    <PopMenuItem
                                        className={styles['rangetype-menu-item']}
                                        label={this.renderTypeName(hex, type)}
                                        onClick={(e) => { this.handleClickRangeTypeSelection(e, 'right', type) }}
                                    >
                                    </PopMenuItem>
                                )
                            }

                        </PopMenu>
                        <LinkButton
                            onClick={this.handleClickEmptyRangeMenu.bind(this)}
                            disabled={rangeInfo.rangeLeftValue === '' && rangeInfo.rangeRightValue === ''}
                        >
                            {__('清空')}
                        </LinkButton>
                    </div>
                </TriggerPopMenu>


            </div >
        )
    }

    /**
     * 渲染范围菜单的标题
     */
    renderRangeMenuTitle(rangeInfo, enableType) {
        let rangeValue = '';
        let rangeLeftValue = rangeInfo.rangeLeftValue;
        let rangeRightValue = rangeInfo.rangeRightValue;
        let rangeLeftType = rangeInfo.rangeLeftType;
        let rangeRightType = rangeInfo.rangeRightType;

        // 根据数值 + 进制计算出当前输入框的数据大小
        let leftValue = enableType ? parseInt(rangeLeftValue) * Math.pow(this.props.hex, (this.props.rangeTypes.indexOf(rangeLeftType))) : parseInt(rangeLeftValue);
        let rightValue = enableType ? parseInt(rangeRightValue) * Math.pow(this.props.hex, (this.props.rangeTypes.indexOf(rangeRightType))) : parseInt(rangeRightValue);

        rangeLeftType = this.renderTypeName(this.props.hex, rangeLeftType)
        rangeRightType = this.renderTypeName(this.props.hex, rangeRightType)

        if (leftValue === rightValue) {
            rangeValue = shrinkText(rangeLeftValue, { limit: 4, indicator: '..' }) + rangeLeftType;
        } else if (!_.isFinite(leftValue)) {
            // rangeValue = decorateText(rangeRightValue, { limit: 8 }) + rangeRightType + __('以下');
            rangeValue = __('${value}以下', { value: shrinkText(rangeRightValue, { limit: 4, indicator: '..' }) + rangeRightType });
        } else if (!_.isFinite(rightValue)) {
            // rangeValue = decorateText(rangeLeftValue, { limit: 8 }) + rangeLeftType + __('以上');
            rangeValue = __('${value}以上', { value: shrinkText(rangeLeftValue, { limit: 4, indicator: '..' }) + rangeLeftType });
        } else {
            rangeValue = leftValue > rightValue ?
                shrinkText(rangeRightValue, { limit: 4, indicator: '..' }) + rangeRightType + '-' + shrinkText(rangeLeftValue, { limit: 4, indicator: '..' }) + rangeLeftType
                :
                shrinkText(rangeLeftValue, { limit: 4, indicator: '..' }) + rangeLeftType + '-' + shrinkText(rangeRightValue, { limit: 4, indicator: '..' }) + rangeRightType
        }

        // this.props.onChange(leftValue, rightValue)
        return (!rangeLeftValue && !rangeRightValue) ? __('不限') : rangeValue

    }

    /**
     * 渲染范围菜单的标题,用于title显示
     */
    renderRangeMenuTitle2(rangeInfo, enableType) {

        let rangeValue = '';
        let rangeLeftValue = rangeInfo.rangeLeftValue;
        let rangeRightValue = rangeInfo.rangeRightValue;
        let rangeLeftType = rangeInfo.rangeLeftType;
        let rangeRightType = rangeInfo.rangeRightType;

        // 根据数值 + 进制计算出当前输入框的数据大小
        let leftValue = enableType ? parseInt(rangeLeftValue) * Math.pow(this.props.hex, (this.props.rangeTypes.indexOf(rangeLeftType))) : parseInt(rangeLeftValue);
        let rightValue = enableType ? parseInt(rangeRightValue) * Math.pow(this.props.hex, (this.props.rangeTypes.indexOf(rangeRightType))) : parseInt(rangeRightValue);

        if (leftValue === rightValue) {
            rangeValue = rangeLeftValue + rangeLeftType;
        } else if (!_.isFinite(leftValue)) {
            // rangeValue = rangeRightValue + rangeRightType + __('以下');
            rangeValue = __('${value}以下', { value: rangeRightValue + rangeRightType });
        } else if (!_.isFinite(rightValue)) {
            // rangeValue = rangeLeftValue + rangeLeftType + __('以上');
            rangeValue = __('${value}以上', { value: rangeLeftValue + rangeLeftType });
        } else {
            rangeValue = leftValue > rightValue ?
                `${rangeRightValue}${rangeRightType}-${rangeLeftValue}${rangeLeftType}`
                :
                `${rangeLeftValue}${rangeLeftType}-${rangeRightValue}${rangeRightType}`
        }

        // this.props.onChange(leftValue, rightValue)
        return (!rangeLeftValue && !rangeRightValue) ? __('不限') : rangeValue

    }

    /**
     * 渲染类型
     */
    renderTypeName(hex, type) {
        if (hex === 60) {
            switch (type) {
                case TimeType.SECONDS:
                    return __('秒')
                case TimeType.MINUTES:
                    return __('分钟')
                case TimeType.HOURS:
                    return __('小时')
                default:
                    return __('秒')
            }
        } else {
            return type;
        }


    }




}