import * as React from 'react';
import WebComponent from '../../../webcomponent';
import * as _ from 'lodash';
import { load, isDir, docname } from '../../../../core/docs/docs';
import { DocType, getTopEntriesByType as getTopEntries } from '../../../../core/entrydoc/entrydoc';
import { EXTENSIONS } from '../../../../core/extension/extension';
import { DateType, TimeType } from '../helper';
import __ from './locale';

export default class ConditionBoxBase extends WebComponent<Components.FullSearch.FullTextSearch.ConditionBox.Props, Components.FullSearch.FullTextSearch.ConditionBox.State> {
    static defaultProps = {
        maxTextLength: 20
    }

    state = {
        otherTypeKeys: [],
        typeSelection: [],
        isOtherType: false,
        tagKeys: [],
        dateRange: [0, 0],
        dateType: DateType.MODIFIED,
        sizeRangeInfo: {
            rangeLeftValue: '',
            rangeRightValue: '',
            rangeLeftType: 'MB',
            rangeRightType: 'MB'
        },
        contentRange: ['basename', 'content'],
        customAttributes: this.props.customAttributes,
        isLoading: this.props.isLoading,
        enableMoreCondition: this.props.enableMoreCondition,
        reset: false,

    }


    /**
     * 自定义属性数组
     * {
     *    attr: 7, condition: "=", level: 1, value: 1
     * } 
     */
    customattr = [];

    /**
     * 大小范围
     */
    sizeRange = {};

    /**
     * 搜索匹配后缀，以点开头
     * ```ts
     * ['.exe', '.bat']
     * ```
     */
    ext = [];

    /**
     * 其他类型
     */
    otherTypeInputValue = '';

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.customAttributes, nextProps.customAttributes)) {
            this.setState({
                customAttributes: nextProps.customAttributes
            })
        }

        if (!_.isEqual(this.props.isLoading, nextProps.isLoading)) {
            this.setState({
                isLoading: nextProps.isLoading
            })
        }

        if (!_.isEqual(this.props.enableMoreCondition, nextProps.enableMoreCondition)) {
            this.setState({
                enableMoreCondition: nextProps.enableMoreCondition
            })
        }

        if (!_.isEqual(this.props.searchTags, nextProps.searchTags)) {
            this.setState({
                tagKeys: nextProps.searchTags
            })
        }

        if (!_.isEqual(this.props.isSearching, nextProps.isSearching)) {
            this.otherTypeInputValue.trim() ?
                this.setState({
                    otherTypeKeys: _.uniq(this.state.otherTypeKeys.concat(this.otherTypeInputValue))
                }, () => {
                    this.props.onExtChange([...this.ext, ...this.state.otherTypeKeys]);
                    this.refs.typeKeys.clearInput();
                    this.handleOtherTypeInputChange('')
                })
                :
                null
        }

    }

    /**
     * 重置方法
     */
    resetState() {
        this.setState({
            otherTypeKeys: [],
            typeSelection: [],
            isOtherType: false,
            tagKeys: [],
            dateRange: [0, 0],
            dateType: DateType.MODIFIED,
            sizeRangeInfo: {
                rangeLeftValue: '',
                rangeRightValue: '',
                rangeLeftType: 'MB',
                rangeRightType: 'MB'
            },
            contentRange: ['basename', 'content'],
            customAttributes: this.props.customAttributes,
            reset: true
        }, () => {
            this.customattr = [];
            this.sizeRange = {};
            this.ext = [];
            this.otherTypeInputValue = '';
            this.refs.tagComboArea.resetState();
            this.refs.rangeTree.resetState();
            this.setState({
                reset: false
            })
        })


    }

    /**
     * 自动定位滚动条问题
     */
    autoLocate() {
        this.refs.moreContainer.scrollTop = this.refs.moreContainer.scrollHeight - this.refs.moreContainer.clientHeight - 60 * Math.floor(this.props.customAttributes.length / 4);
    }

    /**
     * 点击更多筛选项按钮
     */
    protected handleClickSearchMoreConditionBtn() {
        this.props.onMoreConditionChange()

    }

    /**
     * 点击类型按钮
     */
    protected handleChangeType(checked, value) {
        value === 'OTHER' ?
            this.setState({
                isOtherType: checked,
                otherTypeKeys: checked ? this.state.otherTypeKeys : [],
                reset: false
            })
            : null;

        let { typeSelection } = this.state;
        checked ?
            typeSelection = [...typeSelection, value]
            :
            typeSelection.splice(typeSelection.indexOf(value), 1)

        this.setState({
            typeSelection
        }, () => {
            let { typeSelection } = this.state;
            let tmpExt = [];
            typeSelection.map((type) => {
                type === 'OTHER' ?
                    null
                    :
                    tmpExt = tmpExt.concat(EXTENSIONS[type])
            })
            this.ext = tmpExt;
            this.props.onExtChange([...this.ext, ...this.state.otherTypeKeys]);
        })

    }

    /**
     * 其他类型 移除类型块
     */
    protected handleRemoveTypeChip(data) {
        let { otherTypeKeys } = this.state;
        if (!data && otherTypeKeys.length !== 0) {
            this.setState({
                otherTypeKeys: otherTypeKeys.slice(0, otherTypeKeys.length - 1)
            }, () => {
                this.props.onExtChange([...this.ext, ...this.state.otherTypeKeys]);
            });
        } else {
            this.setState({
                otherTypeKeys: _.filter(otherTypeKeys, o => o !== data)
            }, () => {
                this.props.onExtChange([...this.ext, ...this.state.otherTypeKeys]);
            });
        }


    }

    /**
     * 其他类型 添加类型块
     */
    protected handleAddTypeChip(data) {
        this.setState({
            otherTypeKeys: _.uniq(this.state.otherTypeKeys.concat(data))
        }, () => {
            this.props.onExtChange([...this.ext, ...this.state.otherTypeKeys]);
            this.handleOtherTypeInputChange('')

        })

    }

    /**
     * 其他类型 输入验证函数
     */
    protected handleValidatorTypeInput(data) {
        if (data.trim().length === 0 || this.state.otherTypeKeys.length >= 30) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 文档标签 输入变动
     */
    protected handleChangeTagKeys(tagKeys) {
        this.setState({
            tagKeys
        }, () => {
            this.props.onTagKeysChange(tagKeys)

        })
    }

    /**
     * 监听大小范围菜单变化
     */
    protected handleSizeRangeMenu(rangeInfo) {

        this.setState({
            sizeRangeInfo: rangeInfo
        }, () => {
            let { rangeLeftValue, rangeRightValue, rangeLeftType, rangeRightType } = rangeInfo;
            let rangeTypes = ['KB', 'MB', 'GB', 'TB'];
            // 根据数值 + 进制计算出当前输入框的数据大小
            let leftValue = parseInt(rangeLeftValue) * Math.pow(1024, (rangeTypes.indexOf(rangeLeftType)))
            let rightValue = parseInt(rangeRightValue) * Math.pow(1024, (rangeTypes.indexOf(rangeRightType)))

            let binary = 1024;
            if (rangeLeftValue && rangeRightValue) {
                this.sizeRange = leftValue > rightValue ?
                    { 'condition': '[]', lvalue: rightValue * binary, rvalue: leftValue * binary }
                    :
                    { 'condition': '[]', lvalue: leftValue * binary, rvalue: rightValue * binary }
            } else if (rangeRightValue) {
                this.sizeRange = { 'condition': '<', value: rightValue * binary }
            } else if (rangeLeftValue) {
                this.sizeRange = { 'condition': '>', value: leftValue * binary }
            } else {
                this.sizeRange = {}
            }
            this.props.onSizeRangeChange(this.sizeRange);

        })

    }

    /**
     * 监听自定义属性范围菜单变化
     */
    protected handleCustomRangeMenu(attr, rangeInfo, enableTime?) {
        let { customAttributes } = this.state;
        let index = _.findIndex(customAttributes, (customAttr) => { return customAttr.id === attr.id })
        customAttributes[index].rangeInfo = rangeInfo;
        this.setState({
            customAttributes
        }, () => {
            let { rangeLeftValue, rangeRightValue, rangeLeftType, rangeRightType } = rangeInfo;
            rangeLeftType = rangeLeftType === '' ? 0 : rangeLeftType
            rangeRightType = rangeRightType === '' ? 0 : rangeRightType
            let rangeTypes = [TimeType.SECONDS, TimeType.MINUTES, TimeType.HOURS];
            // 根据数值 + 进制计算出当前输入框的数据大小
            let leftValue = enableTime ? parseInt(rangeLeftValue) * Math.pow(60, (rangeTypes.indexOf(rangeLeftType))) : parseInt(rangeLeftValue)
            let rightValue = enableTime ? parseInt(rangeRightValue) * Math.pow(60, (rangeTypes.indexOf(rangeRightType))) : parseInt(rangeRightValue)

            // 构造自定义属性的搜索参数格式
            let index = _.findIndex(this.customattr, (o) => o['attr'] && o['attr'] === attr['id']);

            let newAttr = {};
            if (isFinite(leftValue) && isFinite(rightValue)) {
                newAttr = { attr: attr.id, condition: '[]', level: 0, lvalue: leftValue, rvalue: rightValue }
            } else if (isFinite(leftValue)) {
                newAttr = { attr: attr.id, condition: '>', level: 0, value: leftValue }
            } else if (isFinite(rightValue)) {
                newAttr = { attr: attr.id, condition: '<', level: 0, value: rightValue }
            }

            if (newAttr.hasOwnProperty('attr')) {
                if (index === -1) {
                    this.customattr = [...this.customattr, newAttr]
                } else {
                    this.customattr = this.customattr.map((attr, i) => i === index ? newAttr : attr)
                }
            } else {
                if (index !== -1) {
                    this.customattr = [...this.customattr.slice(0, index), ...this.customattr.slice(index + 1)]
                }
            }



            this.props.onCustomAttrChange(this.customattr);

        })
    }

    /**
     * 监听所有下拉菜单变化
     */
    protected handleSelectMenu(item, attr?) {
        if (!attr) { // 匹配内容菜单
            this.setState({
                contentRange: item.key
            }, () => {
                this.props.onKeysFieldsChange(item.key);
            });

        } else { // 匹配自定义下拉菜单
            let { customAttributes } = this.state;
            let index = _.findIndex(customAttributes, (customAttr) => { return customAttr.id === attr.id })
            customAttributes[index].selectValue = item;
            this.setState({
                customAttributes
            }, () => {
                let index = _.findIndex(this.customattr, (o) => o['attr'] && o['attr'] === attr['id']);
                if (item.unlimited) { // 如果是不限，清除customattr内指定attr.id的属性对象
                    index !== -1 ? this.customattr = [...this.customattr.slice(0, index), ...this.customattr.slice(index + 1)] : null
                } else { // 否则更新指定attr.id的属性对象
                    this.customattr = index !== -1 ?
                        this.customattr.map((attr, i) => i === index ? { attr: attr.id, condition: '=', level: item.level, value: item.id } : attr)
                        :
                        [...this.customattr, { attr: attr.id, condition: '=', level: item.level, value: item.id }]
                }
                this.props.onCustomAttrChange(this.customattr);
            });


        }


    }

    /**
     * 监听所有层级目录菜单变化
     */
    protected handleChangeLevelMenu(item, attr) {
        let { customAttributes } = this.state;
        let index = _.findIndex(customAttributes, (customAttr) => { return customAttr.id === attr.id })
        customAttributes[index].titleNode = item;
        this.setState({
            customAttributes
        }, () => {
            let index = _.findIndex(this.customattr, (o) => o['attr'] && o['attr'] === attr['id']);
            if (item.unlimited) { // 如果是不限，清除customattr内指定attr.id的属性对象
                index !== -1 ? this.customattr = [...this.customattr.slice(0, index), ...this.customattr.slice(index + 1)] : null
            } else { // 否则更新指定attr.id的属性对象
                this.customattr = index !== -1 ?
                    this.customattr.map((attr, i) => i === index ? { attr: attr.id, condition: '=', level: item.level, value: item.id } : attr)
                    :
                    [...this.customattr, { attr: attr.id, condition: '=', level: item.level, value: item.id }]
            }
            this.props.onCustomAttrChange(this.customattr);

        });
    }

    /**
     * 监听时间类型变化
     */
    protected handleChangeDateType(dateType) {
        this.setState({
            dateType
        }, () => {
            this.props.onDateChange(this.state.dateRange, this.state.dateType)

        })
    }

    /**
     * 监听时间范围变化
     */
    protected handleChangeDateMenu(dateRange) {

        dateRange.length === 0 ?
            // 如果为空数组，代表是清空操作，时间类型置为不限
            this.setState({
                dateRange: [0, 0],
            }, () => {
                this.props.onDateChange(this.state.dateRange, this.state.dateType)
            })
            :
            this.setState({
                dateRange: dateRange
            }, () => {
                this.props.onDateChange(this.state.dateRange, this.state.dateType)
            })



    }

    timeout = null;
    /**
     * 点击弹出框外时触发
     */
    protected handleCloseMenu(close) {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
            close();
        }, 150)


    }

    /**
     * 其他类型输入框值变动
     */
    protected handleOtherTypeInputChange(input) {
        this.otherTypeInputValue = input;
        this.props.onOtherTypeInputChange(input)

    }
}