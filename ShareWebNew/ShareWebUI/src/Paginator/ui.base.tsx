import * as React from 'react';
import { noop } from 'lodash';

export default class PaginatorBase extends React.Component<UI.Paginator.Props, any> {
    static defaultProps = {
        onChange: noop,

        page: 1,

        limit: 200,

        total: 0,
    }

    state: UI.Paginator.State = {
        page: this.props.page,

        pages: Math.ceil(this.props.total / this.props.limit),
    }

    componentWillReceiveProps({page, total, limit}) {
        this.setState({
            page,
            pages: Math.ceil(total / limit)
        })
    }

    /**
     * 跳转到指定页
     * @param n 指定页码
     */
    goto(n: number) {
        n = Number(n);
        const prevPage = this.state.page;
        const nextPage = n > 0 && n <= this.state.pages ? n : prevPage; // 如果页码越界，则取消跳转

        this.setState({
            page: nextPage
        }, () => {
            if (nextPage !== prevPage) {
                this.fireChangeEvent(nextPage);
            }
        })
    }

    /**
     * 翻页
     * @param delta 页面增量
     */
    navigate(delta: number) {
        this.goto(this.state.page + delta)
    }

    /**
     * 回到第一页
     */
    first() {
        this.goto(1)
    }

    /**
     * 前往最后一页
     */
    last() {
        this.goto(this.state.pages)
    }

    /**
     * 触发翻页事件
     * @param n 指定页码
     */
    fireChangeEvent(n: number) {
        this.props.onChange(n, this.props.limit);
    }
}