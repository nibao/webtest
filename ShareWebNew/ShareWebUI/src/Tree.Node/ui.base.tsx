import * as React from 'react';
import { noop, isBoolean, isFunction } from 'lodash';
import * as classnames from 'classnames';
import { promisify } from '../../util/accessor/accessor';

enum LoadStatus {
    PENDING, // 未加载子节点

    LOADING, // 正在加载子节点

    LOADED, // 已加载子节点
}

interface Status {
    disabled: boolean
}

interface Props {

    onExpand?: (data) => void;

    _onSelect?: (data, select?) => void;

    onCollapse?: (data) => void;

    loader?: (data) => void;

    expanded?: boolean;

    selected?: boolean;

    formatter?: (data)  => void;

    getStatus?: (data) => Status;
}

interface State {
    loadStatus: LoadStatus;

    collapsed: boolean;

    selected: boolean;

    status: Status;

}

export default class TreeNodeBase extends React.Component<Props, any> {
    static defaultProps = {
        onExpand: noop,

        _onSelect: noop,

        onCollapse: noop,

        loader: noop,

        // 默认不展开子节点
        expanded: false,

        formatter: data => data.name,

        checkbox: false,    // 是否有复选框
        getStatus: (data) => ({
            disabled: false
        })
    };

    state: State = {
        loadStatus: LoadStatus.PENDING,

        collapsed: !this.props.expanded,

        selected: this.props.selected,

        status: this.props.getStatus(this.props.data)
    };

    /**
     * 选中节点
     */
    protected selectNode() {
        if (!this.state.status.disabled) {
            this.props._onSelect(this);
        }

    }

    /**
     * 展开／收起节点
     */
    protected toggleNode(node) {
        if (this.state.loadStatus === LoadStatus.PENDING) {
            this.setState({ loadStatus: LoadStatus.LOADING });
            promisify(this.props.loader(node)).then(() => {
                this.setState({ loadStatus: LoadStatus.LOADED })
            });
        }

        if (this.state.collapsed) {
            this.props.onExpand(node);
        } else {
            this.props.onCollapse(node);
        }

        this.setState({ collapsed: !this.state.collapsed });
    }

    /**
     * 复选框触发的变化
     */
    handleCheckBoxChange(target) {
        target.stopPropagation();
        this.props._onSelect(this, true)
    }
    protected getDisabledStatus(data): boolean {
       return this.props.getStatus(data).disabled
    }
}