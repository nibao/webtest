import * as React from 'react'
import * as classnames from 'classnames'
import TitleBase from './ui.base'
import PopOver from '../PopOver/ui.desktop'
import * as styles from './styles.desktop.css'

export default class Title extends TitleBase {

    /**
     * title限制宽度
     * @param ref 
     */
    setTitleSize(ref) {
        if (ref) {
            const window = this.getContextWindow()
            const maxWidth = Math.min(window.innerWidth, 612)
            if (ref.offsetWidth > maxWidth) {
                this.setState({
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                    width: maxWidth - 12
                })
            }
            const [x, y] = this.state.position
            if (y + ref.offsetHeight + 1 > window.innerHeight) {
                this.setState({
                    position: [x, y - ref.offsetHeight - 20]
                })
            }
        }
    }

    render() {
        return (
            <div
                className={classnames(styles['container'], { [styles['inline']]: this.props.inline })}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {
                    this.props.children
                }
                <PopOver
                    open={this.state.open}
                    anchorOrigin={this.state.position}
                    freezable={false}
                    watch={true}
                >
                    {
                        typeof this.props.content === 'string' ?
                            <div
                                className={classnames(styles['title'], this.props.className)}
                                style={{
                                    width: this.state.width,
                                    whiteSpace: this.state.whiteSpace,
                                    wordBreak: this.state.wordBreak
                                }}
                                ref={this.setTitleSize.bind(this)}
                            >
                                {this.props.content}
                            </div> :
                            this.props.content
                    }
                </PopOver>
            </div>
        )
    }
}