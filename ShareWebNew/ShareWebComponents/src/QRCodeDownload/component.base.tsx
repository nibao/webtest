import * as React from 'react';
import { Format } from './helper';
import { buildQRCodeHref } from '../../core/linkconfig/linkconfig';

export default class extends React.Component<Component.QRCodeDownload.Props, Component.QRCodeDownload.State> {
    state = {
        format: Format.PNG,

        url: ''
    }

    componentWillMount() {
        this.updateUrl();
    }

    /**
     * 更新二维码下载地址
     */
    private async updateUrl() {
        if (this.state.format !== undefined) {
            const [, name = ''] = this.props.text.match(/\/([\w\-]+)$/) || [];

            if (name) {
                const url = await buildQRCodeHref(encodeURIComponent(this.props.text), this.state.format, encodeURIComponent(name));

                this.setState({ url })
            }
        }
    }

    /**
     * 选择二维码下载格式
     */
    protected selectDownloadFormat(format: Format) {
        this.setState({
            format,
            url: '',
        }, this.updateUrl)
    }

    /**
     * 下载二维码
     */
    protected downloadQRCode() {
        this.props.doDownload(this.state.url);
    }
}