import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import Button from '../../../../ui/Button/ui.desktop';
import CheckBoxOption from '../../../../ui/CheckBoxOption/ui.desktop';
import ComboArea from '../../../../ui/ComboArea2/ui.desktop';
import UIIcon from '../../../../ui/UIIcon/ui.desktop';
import Expand from '../../../../ui/Expand/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import { decorateText } from '../../../../util/formatters/formatters';
import DateMenu from './DateMenu/component.desktop';
import LevelMenu from './LevelsMenu/component.desktop';
import RangeMenu from './RangeMenu/component.desktop';
import SelectMenu2 from '../../../../ui/SelectMenu2/ui.desktop';
import TagComboArea from './TagComboArea/component.desktop';
import RangeTree from './RangeTree/component.desktop';
import ConditionBoxBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';
import { TimeType } from '../helper';

export default class ConditionBox extends ConditionBoxBase {

    render() {
        let fileType = [
            { name: 'WORD', value: 'WORD' },
            { name: 'EXCEL', value: 'EXCEL' },
            { name: 'PPT', value: 'PPT' },
            { name: 'PDF', value: 'PDF' },
            { name: 'TXT', value: __('文本') },
            { name: 'IMG', value: __('图片') },
            { name: 'ARCHIVE', value: __('压缩包') },
            { name: 'VIDEO', value: __('视频') },
            { name: 'AUDIO', value: __('音频') },
        ]

        let contentChildren = [{ name: __('全文'), key: ['basename', 'content'] }, { name: __('仅文件名'), key: ['basename'] }, { name: __('仅文件内容'), key: ['content'] }]

        let { isLoading, customAttributes, otherTypeKeys, typeSelection, enableMoreCondition,
            isOtherType, dateRange, dateType, sizeRangeInfo, contentRange, reset } = this.state;

        return (
            <div onClick={() => this.props.onWarningChange()}>
                <div className={classnames(styles['simple-condition-bar'], { [styles['simple-condition-bar-expand']]: enableMoreCondition })}>

                    <div className={classnames(styles['simple-condition-table-box'])}>
                        <div className={classnames(styles['simple-condition-table'])}>
                            <RangeTree
                                searchRange={this.props.searchRange}
                                numberOfChars={this.props.numberOfChars}
                                onSearchRangeChange={this.props.onSearchRangeChange}
                                ref="rangeTree"
                            />

                            <SelectMenu2
                                label={__('匹配内容')}
                                candidateItems={contentChildren}
                                selectValue={contentChildren[_.findIndex(contentChildren, function (content) { return _.isEqual(content.key, contentRange); })]}
                                className={styles['simple-condition-box']}
                                onSelect={(item) => { this.handleSelectMenu(item) }}
                            />

                            <DateMenu
                                label={__('时间范围')}
                                className={styles['simple-condition-box']}
                                dateRange={dateRange}
                                dateType={dateType}
                                onDateChange={(dateRange) => { this.handleChangeDateMenu(dateRange) }}
                                onTypeChange={(dateType) => { this.handleChangeDateType(dateType) }}
                            />

                            <RangeMenu
                                label={__('文件大小')}
                                rangeTypes={['KB', 'MB', 'GB', 'TB']}
                                className={classnames(styles['simple-condition-box'])}
                                hex={1024}
                                rangeInfo={sizeRangeInfo}
                                onChange={(rangeInfo) => { this.handleSizeRangeMenu(rangeInfo) }}
                            />
                        </div>
                    </div>
                    <div className={styles['more-condition-box']}>
                        <Button
                            disabled={isLoading}
                            className={classnames(styles['more-condition-button'])}
                            onClick={this.handleClickSearchMoreConditionBtn.bind(this)}
                        >
                            <div className={classnames(styles['button-box'])}>
                                <UIIcon
                                    className={classnames(styles['more-expand-icon'])}
                                    code={enableMoreCondition ? '\uF04b' : '\uf0aa'}
                                    size="16px"
                                >
                                </UIIcon>
                                <span className={classnames(styles['button-text'])} >
                                    {enableMoreCondition ? __('收起筛选项') : __('更多筛选项')}
                                </span>

                            </div>
                        </Button>
                    </div>


                </div>

                {
                    isLoading ?
                        null
                        :
                        <div className={classnames(styles['more-condition'])}>
                            <Expand
                                open={enableMoreCondition}
                            >
                                <div
                                    className={classnames(styles['more-condition-container'], { [styles['more-condition-container-simple']]: customAttributes.length === 0 })}
                                    ref="moreContainer"
                                >
                                    <div className={styles['more-condition-type']}>
                                        <span className={styles['condition-type-title']}>{__('文件类型：')}</span>
                                        <div className={styles['more-condition-type-container']}>
                                            {
                                                fileType.map((type) => (
                                                    <CheckBoxOption
                                                        checked={typeSelection.indexOf(type.name) !== -1}
                                                        value={type.name}
                                                        onChange={(checked, value) => { this.handleChangeType(checked, value) }}
                                                        className={styles['checkbox']}
                                                    >
                                                        <span className={styles['condition-type-name']}>{type.value}</span>
                                                    </CheckBoxOption>

                                                ))
                                            }

                                            <div className={styles['condition-typename-container']}>
                                                <div className={styles['condition-typename-title']}>
                                                    <CheckBoxOption
                                                        checked={typeSelection.indexOf('OTHER') !== -1}
                                                        value={'OTHER'}
                                                        className={styles['checkbox']}
                                                        onChange={(checked, value) => { this.handleChangeType(checked, value) }}
                                                    >
                                                        <span className={styles['condition-type-name']}>{__('其他')}</span>
                                                    </CheckBoxOption>
                                                </div>

                                                {
                                                    reset ?
                                                        null
                                                        :
                                                        <ComboArea
                                                            ref="typeKeys"
                                                            removeChip={this.handleRemoveTypeChip.bind(this)}
                                                            addChip={this.handleAddTypeChip.bind(this)}
                                                            className={classnames(styles['other-type-content'], { [styles['hidden']]: !isOtherType })}
                                                            validator={(input) => this.handleValidatorTypeInput(input)}
                                                            onChange={(input) => { this.handleOtherTypeInputChange(input) }}
                                                            minHeight={30}
                                                            maxHeight={400}
                                                            spliter={[' ']}
                                                            placeholder={otherTypeKeys.length === 0 ? __('输入扩展名（如.doc），多个请用空格分隔') : ''}
                                                        >
                                                            {
                                                                otherTypeKeys.map((key) =>
                                                                    <ComboArea.Item
                                                                        className={styles['other-type-item']}
                                                                        chipClassName={styles['other-type-chip']}
                                                                        data={key}
                                                                    >
                                                                        <Title content={key}>
                                                                            {decorateText(key, { limit: 30 })}
                                                                        </Title>

                                                                    </ComboArea.Item>
                                                                )
                                                            }
                                                        </ComboArea>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles['more-condition-tag']}>
                                        <span className={styles['condition-tag-title']}>{__('文档标签：')}</span>
                                        <TagComboArea
                                            ref="tagComboArea"
                                            searchTags={this.props.searchTags}
                                            onChange={(tagKeys) => { this.handleChangeTagKeys(tagKeys) }}
                                            onTagInputStatusChange={this.props.onTagInputStatusChange}
                                        />
                                    </div>
                                    <div className={styles['more-condition-customAttrs']}>
                                        {
                                            _.chunk(customAttributes, 4).map((attrs) =>
                                                <div className={styles['condition-row-attrs']}>
                                                    {
                                                        attrs.map(attr =>
                                                            this.renderCustomAttributeMenu(attr)
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>

                                </div>
                            </Expand>
                        </div>
                }
            </div>
        )
    }

    /**
     * 渲染指定类型的自定义属性菜单
     */
    renderCustomAttributeMenu(attr) {
        switch (attr.type) {
            case 0:
                // 层级菜单
                return (
                    <LevelMenu
                        label={attr.name}
                        candidateItems={attr}
                        titleNode={attr.titleNode}
                        className={styles['condition-customAttrs']}
                        onChange={(node) => { this.handleChangeLevelMenu(node, attr) }}
                    />
                )
            case 1:
                // 枚举菜单
                return (
                    <SelectMenu2
                        label={attr.name}
                        candidateItems={attr.child}
                        selectValue={attr.selectValue}
                        className={styles['condition-customAttrs']}
                        onSelect={(item) => { this.handleSelectMenu(item, attr) }}
                    />
                )
            case 4:
                // 时长菜单
                return (
                    <RangeMenu
                        label={attr.name}
                        rangeTypes={[TimeType.SECONDS, TimeType.MINUTES, TimeType.HOURS]}
                        className={styles['condition-customAttrs']}
                        hex={60}
                        rangeInfo={attr.rangeInfo}
                        onChange={(rangeInfo) => { this.handleCustomRangeMenu(attr, rangeInfo, true) }}
                    />
                )
            case 2:
                // 数值菜单
                return (
                    <RangeMenu
                        label={attr.name}
                        className={styles['condition-customAttrs']}
                        enableType={false}
                        rangeInfo={attr.rangeInfo}
                        onChange={(rangeInfo) => { this.handleCustomRangeMenu(attr, rangeInfo) }}
                    />
                )

            default:
                break;
        }
    }

}