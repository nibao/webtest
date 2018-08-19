import * as React from 'react'
import * as classnames from 'classnames'
import FoldBase from './ui.base'
import UIIcon from '../UIIcon/ui.mobile'
import Expand from '../Expand/ui.mobile'
import * as styles from './styles.mobile.css'

export default class Fold extends FoldBase {
    render() {
        const { label, children, className } = this.props
        const { open } = this.state
        return (
            <div className={classnames(styles['container'], className)}>
                <div
                    className={styles['label']}
                    onClick={this.toggle.bind(this)}
                >
                    {label}
                    <UIIcon
                        className={styles['fold-icon']}
                        code={open ? '\uf04c' : '\uf04e'}
                        size={24}
                        color="#9e9e9e"
                    />
                </div>
                <Expand open={open}>
                    {children}
                </Expand>
            </div>
        )
    }
}