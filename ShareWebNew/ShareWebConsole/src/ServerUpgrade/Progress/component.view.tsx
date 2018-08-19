import * as React from 'react'
import { Form, ProgressBar } from '../../../ui/ui.desktop'
import __ from './locale'
import * as styles from './styles.view'

const Progress: React.StatelessComponent<Console.ServerUpgrade.Progress.Props> = ({
    progress = 0,
}) => {
    return (
        <div className={styles['container']}>
            <Form>
                <Form.Row>
                    <Form.Label>
                        <div className={styles['label-area']}>
                            {
                                parseFloat(progress) === 1 ? __('正在发送到存储：') : __('正在上传升级包：')
                            }
                        </div>
                    </Form.Label>
                    <Form.Field>
                        <div className={styles['progress-bar']}>
                            <ProgressBar value={progress} />
                        </div>
                    </Form.Field>
                    {
                        parseFloat(progress) === 1 && (
                            <Form.Field>
                                <div className={styles['warning-text']}>{__('发送过程中切换页面可能导致上传结果获取延迟，请谨慎操作。')}</div>
                            </Form.Field>
                        )
                    }
                </Form.Row>
            </Form>
        </div>
    )
}

export default Progress