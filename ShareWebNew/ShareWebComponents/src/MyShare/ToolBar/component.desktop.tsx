import * as React from 'react'
import { noop } from 'lodash'
import { Button } from '../../../ui/ui.desktop'
import * as styles from './styles.desktop.css'
import __ from './locale'

const ToolBar: React.StatelessComponent<Components.MyShare.ToolBar.Props> = ({
    selection = [],
    doShareCancel = noop,
}) => (
        <div className={styles['container']}>
            <div
                className={styles['checkbox']}
            >
                {
                    selection.length === 0
                        ?
                        null
                        :
                        <Button
                            icon="\uf030"
                            onClick={doShareCancel.bind(this, selection)}
                        >
                            {__('取消共享')}
                        </Button>
                }
            </div>
        </div>
    )

export default ToolBar

