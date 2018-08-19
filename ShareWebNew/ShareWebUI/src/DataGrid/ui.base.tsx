import * as React from 'react';
import { isEqual, isFunction, map, assign, noop, without, union, get, find, findIndex, includes, intersection, some } from 'lodash';
import { PureComponent } from '../decorators';

const DefaultRecordStatus = {
    disabled: false,
    selected: false,
}

@PureComponent
export default class DataGridBase extends React.Component<UI.DataGrid.Props, any> {

    static defaultProps = {
        data: [],

        height: 'auto',

        onClickRow: noop,

        onDblClickRow: noop,

        onSelectionChange: noop,

        getDefaultSelection: noop,

        getRecordStatus: () => DefaultRecordStatus,

        onPageChange: noop,

        select: false,

        locator: (data) => -1,

        paginator: false,

        lazyLoad: false,

        strap: false,

        getKey: noop,

        className: '',

        rowHoverClass: '',

        EmtpyComponent: null,
    }


    constructor(props, context) {
        super(props, context);
        this.toggleSelected = this.toggleSelected.bind(this);
    }

    state: UI.DataGrid.State = {
        // 用来保存选中项
        selection: get(this.props.select, 'multi') === true ? [] : null
    }

    // 是否是多选
    isMultiSelect: boolean = get(this.props.select, 'multi') === true

    // 使用shift复选时，需要根据lastSelectIndex与当前点击的行的index，确定选中范围
    lastSelectedIndex: number = 0;

    // 滚动加载配置
    // 如果是true，则应用默认配置，否则应用false或自定义配置
    lazyLoad = this.props.lazyLoad === true ? { limit: 200 } : this.props.lazyLoad

    private componentWillMount() {
        this.updateSelection(this.props.data);
    }

    private componentDidUpdate(preProps, preState) {
        let preData = preProps.data;
        let nextData = this.props.data;
        if (nextData && nextData.length !== 0 && !isEqual(nextData, preData)) {
            const locatedIndex = this.props.locator(nextData);
            if (locatedIndex !== -1) {
                // 渲染完DOM后，获取LazyLoad列表的scrollHeight，按照索引比例设置scroll
                if (this.lazyLoadList) {
                    this.setState({ scroll: (locatedIndex / nextData.length) * this.lazyLoadList.scrollView.scrollHeight });
                }

            }
        }
    }

    private componentWillReceiveProps({ data }) {
        if (data && data !== this.props.data) {
            const locatedIndex = this.props.locator(data);

            if (locatedIndex !== -1) {
                // TODO 需要将Index转为scroll
                // this.setState({ scroll: locatedIndex });
            }
            this.updateSelection(data, this.props.data);
        }
    }

    private updateSelection(nextData: Array<any>, prevData?) {
        if (this.props.select !== false) {
            const defaultSelection = this.props.getDefaultSelection(nextData, prevData) || this.state.selection;
            if (defaultSelection || (this.isMultiSelect && defaultSelection.length)) {
                if (get(this.props.select, 'multi') === true) {
                    this.state.selection = intersection([].concat(defaultSelection), nextData);
                } else {
                    this.state.selection = find(nextData, record => record === defaultSelection) || null;
                }
            }
            else if (get(this.props.select, 'required') && nextData.length) {
                if (get(this.props.select, 'multi')) {
                    this.state.selection = [].concat(nextData[0]);
                } else {
                    this.state.selection = nextData[0];
                }
            }
        }
        this.props.onSelectionChange(this.state.selection);
    }

    toggleSelectAll() {
        this.rangeSelect(this.state.selection.length === this.props.data.length ? [] : this.props.data.concat());
    }

    isSelected(record) {
        return this.isMultiSelect ? includes(this.state.selection, record) : this.state.selection === record
    }

    onDblClickRow(e, record) {
        if (isFunction(this.props.onDblClickRow)) {
            this.props.onDblClickRow(record);
        }
    }

    /**
     * 点击行触发
     * @param e MouseEvent
     * @param record 点击的行
     * @param index 点击的行的索引
     */
    protected onClickRow(e: React.MouseEvent<any>, record: Object, index: number) {

        switch (true) {
            case e.shiftKey:
                const range = this.lastSelectedIndex < index ? [this.lastSelectedIndex, index + 1] : [index, this.lastSelectedIndex + 1]
                const nextSelection = this.props.data.slice.apply(this.props.data, range);
                this.rangeSelect(nextSelection);
                break;

            case e.ctrlKey:
                if (this.isSelected(record)) {
                    this.multiUnselect(record);
                } else {
                    this.multiSelect(record);
                }
                break;

            default:
                this.lastSelectedIndex = index;
                this.toggleSelected(record);
                break;
        }

        this.props.onClickRow(record);

        e.stopPropagation();
    }

    /**
     * 选中数据对象
     * @param record 数据对象
     */
    private getMultiSelection(records: Object | Array<Object>) {
        return union(this.state.selection, Array.isArray(records) ? records : [records])
    }

    /**
     * 取消选中数据对象
     * @param record 数据对象
     */
    private getUnselectSelection(records: Object | Array<Object>): Array<Object> {
        return Array.isArray(records) ? without(this.state.selection, ...records) : without(this.state.selection, records);
    }

    /**
     * 单项选择
     */
    private singleSelect(record: Object) {
        if (record === this.state.selection && get(this.props.select, 'required') && !this.isMultiSelect) {
            return;
        }
        this.setState({ selection: this.isMultiSelect ? [record] : record }, () => this.fireSelectionChangeEvent(this.state.selection));
    }

    /**
     * 单项取消选中
     */
    private singleUnselect(record: Object) {
        this.setState({ selection: this.isMultiSelect ? this.getUnselectSelection(record) : null }, () => this.fireSelectionChangeEvent(this.state.selection));
    }


    private multiUnselect(records) {
        this.setState({ selection: this.getUnselectSelection(records) }, () => this.fireSelectionChangeEvent(this.state.selection));
    }


    private multiSelect(records) {
        this.setState({ selection: this.getMultiSelection(records) }, () => this.fireSelectionChangeEvent(this.state.selection));
    }

    /**
     * 选择范围内的文档
     * @param records 选择范围
     */
    private rangeSelect(records) {
        this.setState({ selection: records }, () => this.fireSelectionChangeEvent(this.state.selection));
    }

    protected toggleSelected(record, { multi = false } = {}) {
        // 单选模式
        if (this.props.select === true || (get(this.props.select, 'multi') !== undefined && !this.isMultiSelect)) {
            if (this.state.selection === record && !get(this.props.select, 'required')) {
                this.singleUnselect(record);
            } else {
                this.singleSelect(record);
            }
        }
        else if (this.isMultiSelect) {
            if (multi) {
                if (this.isSelected(record)) {
                    this.multiUnselect(record)
                } else {
                    this.multiSelect(record)
                }
            } else {
                if (this.state.selection.length === 1 && this.state.selection[0] === record) {
                    this.singleUnselect(record);
                } else {
                    this.singleSelect(record)
                }
            }
        }
    }

    protected handleScroll(scroll) {
        this.setState({ scroll })
    }

    /**
     * 翻页
     * @param page 页码
     * @param limit 每页条数
     */
    protected changePage(page: number, limit: number) {
        this.firePageChangeEvent(page, limit);
    }


    /**
     * 选中项改变时触发
     */
    private fireSelectionChangeEvent(selection) {
        this.props.onSelectionChange(selection);
    }


    /**
     * 翻页时触发
     * @param page 页码
     * @param limit 每页条数
     */
    private firePageChangeEvent(page: number, limit: number) {
        this.props.onPageChange(page, limit);
    }

    lazyLoadList = null;
    resetState() {
        if (this.lazyLoadList) {
            this.lazyLoadList.reset();
        }
    }
}