import * as React from 'react'
import * as classnames from 'classnames'
import ToolBarBase from './component.base'
import LinkButton from '../../../ui/LinkButton/ui.mobile'
import __ from './locale'
import * as styles from './styles.mobile.css'

export default class Toolbar extends ToolBarBase {
    render() {
        const { className, selections, onRequestDelete, onRequestMore } = this.props

        return (
            <div className={classnames(styles['container'], className)}>
                <LinkButton
                    className={classnames(styles['link-button'], selections.length ? styles['enabled'] : styles['disabled'])}
                    disabled={!selections.length}
                    onClick={() => onRequestMore(selections)}
                >
                    {__('更多操作...')}
                </LinkButton>
            </div>
        )
    }
}