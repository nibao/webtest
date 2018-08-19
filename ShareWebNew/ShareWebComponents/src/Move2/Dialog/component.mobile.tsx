import * as React from 'react'
import Drawer from '../../../ui/Drawer/ui.mobile'
import DocSelector from '../../DocSelector2/component.mobile'
import DialogBase from './component.base'
import * as styles from './styles.mobile.css'
import __ from './locale'

export default class Dialog extends DialogBase {
    render() {
        const { events: [event] } = this.state

        if (event) {
            return (
                <Drawer
                    mask={true}
                    open={true}
                    className={styles['drawer']}
                >
                    <DocSelector
                        className={styles['selector']}
                        description={__('移动到此位置')}
                        onCancel={this.cancel}
                        onConfirm={this.move}
                    />
                </Drawer>
            )
        }

        return null
    }
}