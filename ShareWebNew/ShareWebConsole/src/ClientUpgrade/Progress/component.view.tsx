import * as React from 'react'
import * as classnames from 'classnames'
import { clients } from '../../../core/siteupgrade/siteupgrade'
import { Form, ProgressBar, UIIcon } from '../../../ui/ui.desktop'
import __ from './locale'
import * as styles from './styles.view'

const Progress: React.StatelessComponent<Console.ClientUpgrade.Progress.Props> = ({
    progress = 0,
    osType
}) => {
    const client = clients[osType]

    return (
        <div className={styles['container']}>
            <div className={styles['icon-area']}>
                <UIIcon
                    code={client.code}
                    fallback={client.fallback}
                    color={client.color}
                    size={64}
                />
                <div className={styles['message']}>
                    {client.text}
                </div>
                {
                    !!client.winTip && (
                        <div className={styles['ex-area']}>
                            <div className={styles['second-message']}>
                                {client.exText}
                            </div>
                            <div className={classnames(styles['tip-icon'], { [styles['icon-margin']]: !!client.exText })}>
                                <UIIcon
                                    code={'\uf055'}
                                    title={client.winTip}
                                    size={16}
                                />
                            </div>
                        </div>
                    )
                }
            </div>
            <div className={styles['right-area']}>
                <Form className={styles['form-container']}>
                    <Form.Row>
                        <Form.Label>
                            {__('正在上传升级包：')}
                        </Form.Label>
                        <Form.Field>
                            <div className={styles['progress-bar']}>
                                <ProgressBar value={progress} />
                            </div>
                        </Form.Field>
                    </Form.Row>
                </Form>
            </div>
        </div>
    )
}

export default Progress