import * as React from 'react'
import * as classnames from 'classnames'
import FoldBase from './ui.base'
import UIIcon from '../UIIcon/ui.desktop'
import Expand from '../Expand/ui.desktop'
import * as styles from './styles.desktop.css'

export default class Fold extends FoldBase {
    render() {
        const { label, children, className, labelProps: { className: labelClassName } } = this.props
        const { open } = this.state

        return (
            <div className={classnames(styles['container'], className)}>
                <div
                    className={classnames(styles['label'], labelClassName)}
                    onClick={this.toggle.bind(this)}
                >
                    {label}
                    <UIIcon className={styles['fold-icon']} code={open ? '\uf04c' : '\uf04e'} size={16} color='#9e9e9e' />
                </div>
                <Expand open={open}>
                    {children}
                </Expand>
            </div>
        )
    }
}