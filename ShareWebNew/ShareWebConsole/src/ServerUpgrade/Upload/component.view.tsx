import * as React from 'react'
import * as classnames from 'classnames'
import { ErrorCode } from '../../../core/siteupgrade/siteupgrade'
import { Form, Text, Button, MessageDialog } from '../../../ui/ui.desktop'
import UploadBase from './component.base'
import __ from './locale'
import * as styles from './styles.view'

export default class Upload extends UploadBase {
    render() {
        const { packageFile, errorCode } = this.state
        const packageName = packageFile ? packageFile.name : ''

        return (
            <Form className={classnames(
                styles['form'],
                { [styles['hide']]: this.props.hide }
            )}>
                <Form.Row>
                    <Form.Label>
                        <div className={styles['text-height']}>
                            {__('上传升级包：')}
                        </div>
                    </Form.Label>
                    <Form.Field>
                        <Text className={styles['text-input']}>
                            {packageName}
                        </Text>
                    </Form.Field>
                    <Form.Field>
                        <div
                            className={classnames(
                                styles['btn-uploader-picker'],
                                styles['btn']
                            )}
                            ref="select"
                        >
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <Button
                            className={styles['upload-btn']}
                            disabled={!packageFile}
                            onClick={this.upload.bind(this)}
                        >
                            {__('上传')}
                        </Button>
                    </Form.Field>
                </Form.Row>
                {
                    errorCode ?
                        <MessageDialog onConfirm={() => this.setState({ errorCode: ErrorCode.None })}>
                            {__('当前站点未配置存储设备')}
                        </MessageDialog>
                        : null
                }
            </Form>
        )
    }
}