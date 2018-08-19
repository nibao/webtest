import * as React from 'react';
import TextBox from '../../ui/TextBox/ui.desktop';
import PDF from '../../ui/PDF/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import { getErrorMessage } from '../../core/errcode/errcode';
import Form from '../../ui/Form/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Viewer from '../Viewer/component.desktop';
import CADPreview from '../CADPreview/component.desktop'
import UIIcon from '../../ui/UIIcon/ui.desktop'
import { Status } from './helper';
import PreviewBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Preview extends PreviewBase {

    render() {
        return (
            <Viewer
                doc={this.props.doc}
                link={this.props.link}
                skipPermissionCheck={this.props.skipPermissionCheck}
                onCheckLogin={this.props.onCheckLogin}
                onLoginSuccess={(info) => { this.props.onLoginSuccess(info) }}
                onRedirect={(url) => { this.props.onRedirect(url) }}
                onPasswordChange={(account) => { this.props.onPasswordChange(account) }}
                illegalContentQuarantine={this.props.illegalContentQuarantine}
            >
                {
                    this.switchContent()
                }
            </Viewer>
        )
    }

    switchContent() {
        switch (this.state.status) {
            case Status.PENDING:
                return null

            case Status.BROWSER_INCOMPATIABLE:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{__('不支持IE8及其更早版本的浏览器')}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.FETCHING:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{__('正在加载...')}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.INVALID_FORMAT:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles['warning-icon']}>
                                <UIIcon size={'60px'} code={'\uf021'} color="#bdbdbd" />
                            </div>
                            <div className={styles.message}>{__('当前格式不支持预览或文件内容已加密')}</div>
                            {this.state.downloadEnabled ? <div>{__('您可以选择')}&nbsp;<a href="javascript:;" className={styles['download-link']} onClick={this.handleDownload.bind(this)}>{__('下载查看')}</a></div> : null}
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.FAILED:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{__('加载失败')}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.NO_PERMISSION:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{getErrorMessage(Status.NO_PERMISSION)}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.WATERMARKING_FAILED:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{__('无法预览文件“${filename}”，水印制作失败', { filename: this.props.doc.name })}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.MAKING_WATERMARK:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{getErrorMessage(Status.MAKING_WATERMARK)}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.LINK_PWD_ERROR:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{getErrorMessage(Status.LINK_PWD_ERROR)}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.PASSWORD_REQUIRED:
                return this.queryPassword();

            case Status.OK:
                return (
                    <PDF
                        pdf={this.state.pdf}
                        width={800}
                        watermark={this.state.watermark}
                    />
                )

            case Status.GNS_NOT_EXIST:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{__('文件或文件夹“${filename}”不存在, 可能其所在路径发生变更。', { filename: this.props.doc.name })}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )

            case Status.CADPreview:
                return (
                    <CADPreview
                        doc={this.props.doc}
                        link={this.props.link}
                        illegalContentQuarantine={this.props.illegalContentQuarantine}
                        skipPermissionCheck={this.props.skipPermissionCheck}
                        onCADPreviewError={() => this.setState({ status: Status.FAILED })}
                    />
                )

            default:
                return (
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <div className={styles.message}>{getErrorMessage(this.state.status) || __('加载失败')}</div>
                        </FlexBox.Item>
                    </FlexBox>
                )
        }
    }

    queryPassword() {
        return (
            <Dialog
                title={__('密码')}
                buttons={[]}
            >
                <Panel>
                    <Panel.Main>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <label htmlFor="password">{__('打开密码：')}</label>
                                </Form.Label>
                                <Form.Field>
                                    <TextBox type="password" id="password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
                                </Form.Field>
                            </Form.Row>
                        </Form>
                        <div className={styles['password-error']}>{this.state.showPasswordError ? '密码不正确' : ''}</div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button onClick={() => this.tryPassword(this.state.password)}>{__('确定')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }
}