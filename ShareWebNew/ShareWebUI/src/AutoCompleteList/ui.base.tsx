import * as React from 'react'
import { noop } from 'lodash'
import { KeyDown } from '../AutoComplete/ui.base'

const itemHeight = 30;

export default class AutoCompleteListBase extends React.Component<UI.AutoCompleteList.Props, UI.AutoCompleteList.State> {
    static defaultProps = {
        maxHeight: 200,

        selectIndex: -1,

        keyDown: KeyDown.NONE,

        onSelectionChange: noop
    }

    refs: {
        list: HTMLElement
    }

    state = {
        selectIndex: this.props.selectIndex
    }

    selectedByMouseOver: boolean = false;

    componentWillReceiveProps({ selectIndex, keyDown }) {
        this.selectedByMouseOver = false;

        if (selectIndex !== this.props.selectIndex && selectIndex !== -1) {
            if (selectIndex !== this.state.selectIndex) {
                this.setState({
                    selectIndex
                })
            }

            if (selectIndex === 0) {
                // 如果选中第一条，scrollTop为0
                this.refs.list.scrollTop = 0
            } else if (selectIndex === React.Children.count(this.props.children) - 1) {
                // 选中最后一条，scrollTop为超出的高度
                this.refs.list.scrollTop = itemHeight * (selectIndex + 1) - this.props.maxHeight
            } else {
                // 每次滑动，增加或者减少scrollTop
                const height = itemHeight * (selectIndex + 1);

                if ((height - this.refs.list.scrollTop) > this.props.maxHeight) {
                    this.refs.list.scrollTop = height - this.props.maxHeight
                }
                if ((height - this.refs.list.scrollTop) < itemHeight) {
                    this.refs.list.scrollTop = height - itemHeight
                }
            }
        }

        if (keyDown !== this.props.keyDown) {
            switch (keyDown) {
                case KeyDown.DOWNARROW: {
                    // 按下向下键
                    this.handleDownArrow()
                    break;
                }
                case KeyDown.UPARROW: {
                    // 按下向上键
                    this.handleUpArrow()
                }
            }
        }
    }

    /**
     * 处理鼠标移动到上面事件
     */
    handleMouseOver(e, selectIndex: number) {
        if (this.selectedByMouseOver) {
            this.setState({
                selectIndex
            }, () => this.props.onSelectionChange(selectIndex))
        }
    }

    setSelectByMouseMove() {
        this.selectedByMouseOver = true;
    }

    /**
     * 按向下键触发
     */
    handleDownArrow() {
        const count = React.Children.count(this.props.children)

        if (count) {
            if (this.props.selectIndex === -1) {
                // 没有选中项选择第一个
                this.setState({
                    selectIndex: 0
                }, () => this.props.onSelectionChange(0))
            } else if ((this.props.selectIndex + 1) < count) {
                // 有选中项且不是最后一个，选择下一个
                this.setState({
                    selectIndex: this.props.selectIndex + 1
                }, () => this.props.onSelectionChange(this.state.selectIndex))
            } else {
                // 有选择项且为最后一个，选择第一
                this.setState({
                    selectIndex: 0
                }, () => this.props.onSelectionChange(0))
            }
        }
    }

    /**
     * 按向上键触发
     */
    handleUpArrow() {
        const count = React.Children.count(this.props.children)

        if (count) {
            if (this.props.selectIndex === -1) {
                // 没有任何选中项选择最后一个
                this.setState({
                    selectIndex: count - 1
                }, () => this.props.onSelectionChange(count - 1))
            } else if (this.props.selectIndex > 0) {
                // 有选中项且不是第一项，选择其上一个
                this.setState({
                    selectIndex: this.props.selectIndex - 1
                }, () => this.props.onSelectionChange(this.state.selectIndex))
            } else {
                // 选择项是第一个的时候
                this.setState({
                    selectIndex: count - 1
                }, () => this.props.onSelectionChange(count - 1))
            }
        }
    }
}