import * as React from 'react'
import ScrollerBase from './ui.base'
import * as styles from './styles.mobile.css'

export default class Scroller extends ScrollerBase {
    render() {
        return (
            <div
                ref='container'
                className={styles['container']}
                style={{ scrollTop: this.props.scrollTop, scrollLeft: this.props.scrollLeft }}
                onScroll={this.scrollHandler.bind(this)}>
                {this.props.children}
            </div>
        )
    }
}