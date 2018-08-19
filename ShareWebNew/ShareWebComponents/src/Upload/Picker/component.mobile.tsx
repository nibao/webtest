import * as React from 'react'
import * as classnames from 'classnames'
import PickerBase from './component.base'
import * as styles from './styles.mobile.css'

export default class Picker extends PickerBase {
    render() {
        const { style = {}, className, children, ...otherProps } = this.props
        const { runtime, clearing } = this.state
        return (
            <label
                className={classnames(styles['label'], className)}
                style={style}
                onMouseEnter={this.handleMouseEnter.bind(this)}
            >
                {
                    runtime === 'html5' && !clearing ?
                        <input
                            {...otherProps}
                            type="file"
                            className={styles['input']}
                            ref={this.setDirectoryPicker}
                            onChange={this.handleChange.bind(this)}
                        /> :
                        null
                }
                {children}
            </label>
        )
    }
}