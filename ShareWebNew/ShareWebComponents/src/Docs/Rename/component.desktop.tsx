import * as React from 'react'
import RenameBase from './component.base'
import PopOver from '../../../ui/PopOver/ui.desktop'
import RenameForm from '../../Rename/Form/component.desktop'
import * as styles from './styles.desktop.css'

export default class Rename extends RenameBase {
    render() {
        const { anchor } = this.state
        return (
            <div ref={this.ref} className={styles['container']}>
                <PopOver
                    open={!!anchor}
                    anchor={anchor}
                    freezable={false}
                    autoFix={false}
                    watch={true}
                    anchorOrigin={['left', 'middle']}
                    targetOrigin={['left', 'middle']}
                    style={{zIndex: 10}}
                >
                    <RenameForm {...this.props} />
                </PopOver>
            </div>
        )
    }
}