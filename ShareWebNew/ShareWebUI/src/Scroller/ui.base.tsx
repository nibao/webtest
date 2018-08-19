import * as React from 'react'
import { noop } from 'lodash'

export default class Scroller extends React.Component<any, any>{
    defaultProps = {
        scrollTop: 0,
        scrollLeft: 0
    }

    componentWillReceiveProps(nextProps) {
        this.refs.container.scrollTop = nextProps.scrollTop
        this.refs.container.scrollLeft = nextProps.scrollLeft
    }

    componentDidMount() {
        const {container} = this.refs
        container.addEventListener('touchstart', () => {
            let {scrollTop, scrollHeight, offsetHeight} = container
            if (scrollTop === 0) {
                container.scrollTop = 1
            } else if (scrollTop + offsetHeight === scrollHeight) {
                container.scrollTop = scrollTop - 1
            }
        });

        container.addEventListener('touchmove', e => {
            if (container.offsetHeight < container.scrollHeight) {
                e._isScroller = true
            }
        })
    }

    scrollHandler(e) {
        if (typeof this.props.onScroll == 'function') {
            this.props.onScroll(e)
        }
    }
}