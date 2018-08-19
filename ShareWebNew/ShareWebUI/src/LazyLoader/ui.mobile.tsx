import * as React from 'react';
import LazyLoaderBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class LazyLoader extends LazyLoaderBase {
    render() {
        return (
            <div
                className={styles['container']}
                onScroll={this.handleScroll.bind(this)}
                ref={scrollView => this.scrollView = scrollView}
            >
                {
                    this.props.children
                }
            </div>
        )
    }
}