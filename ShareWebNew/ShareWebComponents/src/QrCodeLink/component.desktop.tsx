import * as React from 'react';
import QRCode from '../../ui/QRCode/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import { Format } from './helper';
import QrCodeLinkBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class QrCodeLink extends QrCodeLinkBase {
    render() {
        return (
            <div className={styles['container']}>
                <QRCode text={this.state.address} cellSize={3} />
                <div>
                    <a href="javascript:void(0)" className={styles.link} onClick={this.viewFullImage.bind(this)}>{__('查看原图')}</a>
                    <a href="javascript:void(0)" className={styles.link} onClick={this.showDownloadDialog.bind(this)}>{__('下载二维码')}</a>
                </div>
                {
                    this.state.showDownloadDialog ? this.renderDownloadDialog() : null
                }
                {
                    this.state.viewFullImage ? this.renderFullImage() : null
                }
            </div>
        )
    }

    renderFullImage() {
        return (
            <Dialog
                title={__('二维码原图')}
                onClose={this.closeViewFullImage.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles.fullimage}>
                            <QRCode text={this.state.address} cellSize={8} />
                        </div>
                    </Panel.Main>
                </Panel>
            </Dialog>
        )
    }

    renderDownloadDialog() {
        return (
            <Dialog
                title={__('下载二维码')}
                onClose={this.closeDownloadDialog.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <Form>
                            <Form.Row>
                                <Form.Label>{__('格式：')}</Form.Label>
                                <Form.Field>
                                    <div className={styles.selectFormat}>
                                        <Select value={this.state.qrcodeFormat} onChange={this.selectDownloadFormat.bind(this)} >
                                            <Select.Option value={Format.PNG} selected={true}>{__('PNG')}</Select.Option>
                                            <Select.Option value={Format.SVG}>{__('SVG')}</Select.Option>
                                        </Select>
                                    </div>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button disabled={!this.state.qrcodeURL} onClick={this.downloadQRCode.bind(this)}>{__('确定')}</Panel.Button>
                        <Panel.Button onClick={this.closeDownloadDialog.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }
}