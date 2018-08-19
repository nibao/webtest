import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash'
import { formatSize } from '../../../util/formatters/formatters'
import { clients } from '../../../core/siteupgrade/siteupgrade'
import { UIIcon, Text, Form, Button } from '../../../ui/ui.desktop'
import __ from './locale'
import * as styles from './styles.view'

const PackageDetail: React.StatelessComponent<Console.ClientUpgrade.PackageDetail.Props> = ({
    packageinfo = {
    mode: '',
    name: '',
    ostype: '',
    size: 0,
    time: '',
    version: ''
},
    osType,
    onDeletePackage = noop
}) => {

    const client = clients[osType]

    return (
        <div>
            <div className={styles['icon-area']}>
                <UIIcon
                    code={client.code}
                    fallback={client.fallback}
                    color={client.color}
                    size={64}
                />
                <div>
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
            </div>
            <div className={styles['package-area']}>
                <Form>
                    <Form.Row>
                        <Form.Label>
                            <div className={styles['text-height']}>
                                {__('升级包名称：')}
                            </div>
                        </Form.Label>
                        <Form.Field>
                            <Text className={classnames(styles['text'], styles['inline-block-style'])}>
                                {packageinfo.name}
                            </Text>
                            <Button
                                className={styles['delete-btn']}
                                onClick={onDeletePackage}
                            >
                                {__('删除')}
                            </Button>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <div className={styles['text-height']}>
                                {__('文件大小：')}
                            </div>
                        </Form.Label>
                        <Form.Field>
                            <Text className={styles['text']}>
                                {formatSize(packageinfo.size)}
                            </Text>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <div className={styles['text-height']}>
                                {__('升级版本：')}
                            </div>
                        </Form.Label>
                        <Form.Field>
                            <Text className={styles['text']}>
                                {packageinfo.version + (packageinfo.mode ? __('（强制）') : __('（非强制）'))}
                            </Text>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <div className={styles['text-height']}>
                                {__('上传时间：')}
                            </div>
                        </Form.Label>
                        <Form.Field>
                            <Text className={styles['text']}>
                                {packageinfo.time}
                            </Text>
                        </Form.Field>
                    </Form.Row>
                </Form>
            </div>
        </div>
    )
}

export default PackageDetail