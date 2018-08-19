import * as React from 'react'
import * as classnames from 'classnames'
import { clients, Mode, ErrorCode } from '../../../core/siteupgrade/siteupgrade'
import { Form, Text, Button, UIIcon, RadioBoxOption, MessageDialog } from '../../../ui/ui.desktop'
import UploadBase from './component.base'
import __ from './locale'
import * as styles from './styles.view'

export default class Upload extends UploadBase {
    render() {
        const { packageFile, mode, errorCode } = this.state
        const packageName = packageFile ? packageFile.name : ''
        const { osType } = this.props
        const client = clients[osType]

        return (
            <div className={classnames(
                styles['container'],
                { [styles['hide']]: this.props.hide }
            )}>
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
                    <Form className={styles['form']}>
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
                        </Form.Row>
                    </Form>
                    <div className={styles['tip-text']}>
                        {client.tip}
                    </div>
                    <Form>
                        <Form.Row>
                            <Form.Label>
                                <div className={styles['text-height']}>
                                    {__('选择升级模式：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <div className={styles['radio-box']}>
                                    <RadioBoxOption
                                        name={'1'}
                                        value={Mode.Force}
                                        onCheck={() => this.changeMode(Mode.Force)}
                                        checked={mode === Mode.Force}
                                    >
                                        {__('强制升级')}
                                    </RadioBoxOption>
                                </div>
                            </Form.Field>
                            <Form.Field>
                                <div className={styles['another-radio-box']}>
                                    <RadioBoxOption
                                        name={'2'}
                                        value={Mode.NoForce}
                                        onCheck={() => this.changeMode(Mode.NoForce)}
                                        checked={mode === Mode.NoForce}
                                    >
                                        {__('非强制升级')}
                                    </RadioBoxOption>
                                </div>
                            </Form.Field>
                        </Form.Row>
                    </Form>
                    <Button
                        className={styles['upload-btn']}
                        disabled={this.checkBtnDisable()}
                        onClick={this.upload.bind(this)}
                    >
                        {__('上传')}
                    </Button>
                </div>
                {
                    errorCode ?
                        <MessageDialog onConfirm={() => this.setState({ errorCode: ErrorCode.None })}>
                            {__('当前站点未配置存储设备')}
                        </MessageDialog>
                        :
                        null
                }
            </div>
        )
    }
}