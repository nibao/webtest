import * as React from 'react';
import ScrollBar from './ScrollBar/ui.desktop';
import ScrollViewBase from './ui.base';
import * as classnames from 'classnames'
import * as styles from './styles.desktop.css';

export default class ScrollView extends ScrollViewBase {
    render() {
        return (
            <div
                style={{ width: this.props.width, height: this.props.height }}
                ref="container"
                className={classnames(styles['container'], this.props.className)}
            >
                <div
                    ref="content"
                    className={styles['content']}
                    style={{ top: -this.state.scrollViewTop, left: -this.state.scrollViewLeft }}
                    onMouseDown={this.handleDragContent.bind(this)}
                >
                    {this.props.children}
                </div>
                {
                    this.state.scrollY ? (
                        < ScrollBar
                            ref="scrollY"
                            className={styles['scroll-y']}
                            axis="y"
                            length={this.state.barHeight}
                            offsetValue={this.state.scrollBarTop}
                            onDrag={this.handleDragY}
                        />
                    ) : null
                }
                {
                    this.state.scrollX ? (
                        < ScrollBar
                            ref="scrollX"
                            className={styles['scroll-x']}
                            axis="x"
                            length={this.state.barWidth}
                            offsetValue={this.state.scrollBarLeft}
                            onDrag={this.handleDragX}
                        />
                    ) : null
                }
            </div >
        )
    }
}