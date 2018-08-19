import * as React from 'react'
import * as classnames from 'classnames'
import PickerBase from './component.base'
import * as styles from './styles.desktop.css'

export default class Picker extends PickerBase {
    render() {
        const { style = {}, className, children, ...otherProps } = this.props
        const { runtime, clearing } = this.state
        return (
            <label
                className={classnames(styles['label'], className)}
                style={style}
                onMouseEnter={this.handleMouseEnter}
                onClick={this.handleClick}
            >
                {
                    runtime === 'html5' && !clearing ?
                        <input
                            {...otherProps}
                            type="file"
                            multiple
                            className={styles['input']}
                            ref={this.setDirectoryPicker}
                            onChange={this.handleChange}
                        /> :
                        null
                }
                {children}
            </label>
        )
    }
}