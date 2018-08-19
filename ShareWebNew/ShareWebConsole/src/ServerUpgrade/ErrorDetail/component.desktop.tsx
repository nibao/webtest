import * as React from 'react'
import { noop } from 'lodash'
import { Dialog2 as Dialog, Panel } from '../../../ui/ui.desktop'
import __ from './locale'
import * as styles from './styles.view'

const ErrorDetail: React.StatelessComponent<Console.ServerUpgrade.ErrorDetail.Props> = ({
    node = {},
    onClose = noop
}) => {
    return (
        <Dialog
            title={__('异常记录')}
            onClose={onClose}
        >
            <Panel>
                <Panel.Main>
                    <div className={styles['container']}>
                        <div className={styles['node-area']}>
                            {__('节点IP：${ip}', { ip: node.node_ip })}
                        </div>
                        <div className={styles['error-area']}>
                            {__('异常描述：')}
                        </div>
                        {
                            node.errors.map((error, index) => (
                                <div className={styles['error-area']}>
                                    {`${index + 1}. ${error}`}
                                </div>
                            ))
                        }
                    </div>
                </Panel.Main>
            </Panel>
        </Dialog>
    )
}

export default ErrorDetail