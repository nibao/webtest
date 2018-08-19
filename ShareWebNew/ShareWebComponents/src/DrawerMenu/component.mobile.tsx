import * as React from 'react'
import { noop } from 'lodash'
import * as styles from './styles.mobile.css'
import __ from './locale'

const DrawerMenu: React.StatelessComponent<Components.DrawerMenu.Props> = ({
    message,
    doConfirm = noop,
    doCancel = noop,
}) => (
        <div>
            <div
                className={styles['file-detail']}
            >

                <div
                    className={styles['file-info']}
                >
                    {message}
                </div>

                <div
                    className={styles['confirm-button']}
                    onClick={doConfirm.bind(this)}
                >
                    {__('确认删除')}
                </div>

            </div>

            <div
                className={styles['cancel-button']}
                onClick={doCancel.bind(this)}
            >
                {__('取消')}
            </div>
        </div>
    )

export default DrawerMenu