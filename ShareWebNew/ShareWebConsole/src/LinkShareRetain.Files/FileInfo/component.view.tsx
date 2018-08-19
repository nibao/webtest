import * as React from 'react'
import * as classnames from 'classnames'
import { formatTime } from '../../../util/formatters/formatters'
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Form from '../../../ui/Form/ui.desktop'
import Text from '../../../ui/Text/ui.desktop'
import * as styles from './styles.view.css'
import __ from './locale'

export default function FileInfo({fileInfo, onClose}: Console.FileInfo.Props) {
    return (
        <Dialog
            title={__('查看详情')}
            onClose={onClose}
        >
            <Panel>
                <Panel.Main>
                    <Form>
                        <Form.Row>
                            <Form.Label>
                                <label className={styles['detail-message']}>{__('创建者：')}</label>
                            </Form.Label>
                            <Form.Field>
                                <Text className={classnames(styles['detail-message'], styles['detail-width'])}>{fileInfo.creator}</Text>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <label className={styles['detail-message']}>{__('修改者：')}</label>
                            </Form.Label>
                            <Form.Field>
                                <Text className={classnames(styles['detail-message'], styles['detail-width'])}>{fileInfo.editor}</Text>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <label className={styles['detail-message']}>{__('修改时间：')}</label>
                            </Form.Label>
                            <Form.Field>
                                <label className={styles['detail-message']}>{formatTime(fileInfo.modified / 1000, 'yyyy/MM/dd HH:mm:ss')}</label>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <label className={styles['detail-message']}>{__('共享者：')}</label>
                            </Form.Label>
                            <Form.Field>
                                <Text className={classnames(styles['detail-message'], styles['detail-width'])}>{fileInfo.sharer}</Text>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <label className={styles['detail-message']}>{__('共享文档：')}</label>
                            </Form.Label>
                            <Form.Field>
                                <Text className={classnames(styles['detail-message'], styles['detail-width'])}>{fileInfo.sharedObj}</Text>
                            </Form.Field>
                        </Form.Row>
                    </Form>
                </Panel.Main>
            </Panel>
        </Dialog>
    )
}