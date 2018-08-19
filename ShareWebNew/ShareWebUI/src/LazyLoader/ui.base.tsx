import * as React from 'react';
import { isFunction, isBoolean, noop } from 'lodash';

export default class LazyLoaderBase extends React.Component<UI.LazyLoader.Props, any> {

    static defaultProps = {
        limit: 200,

        trigger: 0.75,

        onScroll: noop,

        onChange: noop,
    }

    state: UI.LazyLoader.State = {
        page: 1,
    }

    componentDidMount() {
        if (this.props.scroll) {
            this.scrollTo(this.props.scroll);
        }
    }

    componentWillReceiveProps({ scroll }) {
        // 通过 props.scroll 来改变滚动位置
        if (scroll !== undefined && scroll !== this.scrollTop) {
            this.scrollTo(scroll);
        }
    }

    /**
     * 滚动位置
     */
    scrollTop: number;

    /**
     * 滚动容器的引用
     */
    scrollView: HTMLDivElement;

    /**
     * 仅向下滚动时递增记录.
     * 如果页面向上滚动，则有效滚动范围为上一次的记录位置而＊不是＊本次向上滚动的停止位置
     */
    lastValidScrollTop: number = 0;

    /**
     * 滚动到顶部
     */
    private scrollTo(scroll: number): void {
        if (scroll !== undefined) {
            this.scrollTop = this.scrollView.scrollTop = scroll;
        }
    }

    /**
     * 计算滚动位置并触发懒加载
     */
    protected handleScroll(event: Event): void {
        const { scrollTop, clientHeight, scrollHeight } = event.target;
        const triggerTop = this.props.trigger * scrollHeight;
        const nextTop = clientHeight + scrollTop;
        this.props.onScroll(scrollTop);

        if (nextTop > this.lastValidScrollTop) {
            // 正好滚动跨过加载点
            if (this.lastValidScrollTop < triggerTop && nextTop > triggerTop) {
                this.setState({ page: this.state.page + 1 }, () => {
                    this.props.onChange(this.state.page, this.props.limit)
                })
            }
            // 记录最靠下的一次滚动记录，之后如果在此位置之上滚动＊不触发＊onChange
            this.lastValidScrollTop = nextTop;
        }
    }

    reset() {
        this.setState({
            page: 1,
            scroll: 0
        })
        this.scrollTo(0)
        this.lastValidScrollTop = 0;
    }
}