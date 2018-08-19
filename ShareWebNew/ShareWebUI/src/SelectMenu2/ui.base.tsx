import * as React from 'react';
import * as _ from 'lodash';

export default class SelectMenuBase extends React.Component<UI.SelectMenu2.Props, UI.SelectMenu2.State> {
    static defaultProps = {
        label: '',
        candidateItems: [{ name: '' }],
        selectValue: ''
    }

    state = {
        selectValue: this.props.selectValue ? this.props.selectValue : this.props.candidateItems[0],
        hover: true
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.selectValue, nextProps.selectValue)) {
            this.setState({
                selectValue: nextProps.selectValue
            })
        }

    }

    /**
     * 选择候选菜单项
     */
    protected handleClickCandidateItem(e, item) {
        this.setState({
            hover: true
        }, () => {
            this.props.onSelect(item);
        })

    }

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
            close();
            this.setState({
                hover: true
            })
        }, 150)
    }

    /**
     * 鼠标进入任意选项时触发
     */
    protected handleMouseEnter() {
        this.setState({
            hover: false
        })
    }


}