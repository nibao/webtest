import * as React from 'react';
import { pick } from 'lodash';
import { buildInvitationHref } from '../../core/invitationconfig/invitationconfig';
import { buildQRCodeHref, buildLinkHref } from '../../core/linkconfig/linkconfig';
import { Format } from './helper';

export default class QrCodeLinkBase extends React.Component<Components.QrCodeLink.Props, Components.QrCodeLink.State> implements Components.QrCodeLink.Component {
    state = {
        address: '',

        viewFullImage: false,

        showDownloadDialog: false,

        qrcodeFormat: Format.PNG,

        qrcodeURL: ''
    }

    componentWillMount() {
        this.updateQRCode(pick(this.props, ['link', 'invitationid']))
    }

    componentWillReceiveProps({ link, invitationid }) {
        if (link !== this.props.link) {
            this.updateQRCode({ link })
        }

        if (invitationid !== this.props.invitationid) {
            this.updateQRCode({ invitationid })
        }
    }

    /**
     * 构造下载地址
     * @param param0 
     */
    private async updateQRCode({ link, invitationid }: { link?: string, invitationid?: string }) {
        if (link) {
            this.setState({
                address: await buildLinkHref(link)
            })
        } else if (invitationid) {
            this.setState({
                address: await buildInvitationHref(invitationid)
            })
        }
    }

    /**
     * 查看原图
     */
    viewFullImage() {
        this.setState({ viewFullImage: true });
    }

    /**
     * 关闭查看原图
     */
    closeViewFullImage() {
        this.setState({ viewFullImage: false });
    }

    /**
    * 显示二维码下载对话框
    */
    showDownloadDialog() {
        this.selectDownloadFormat(Format.PNG);
        this.setState({ showDownloadDialog: true });
    }

    /**
     * 关闭二维码下载对话框
     */
    closeDownloadDialog() {
        this.setState({ showDownloadDialog: false });
    }

    /**
     * 选择二维码下载格式
     */
    selectDownloadFormat(qrcodeFormat: Format): void {
        const name = (this.state.address.match(/\/([\w\-]+)$/) || [])[1];

        if (name) {
            buildQRCodeHref(encodeURIComponent(this.state.address), qrcodeFormat, encodeURIComponent(name)).then(url => {
                this.setState({ qrcodeFormat, qrcodeURL: url })
            })
        }
    }

    /**
     * 下载二维码
     */
    downloadQRCode() {
        location.assign(this.state.qrcodeURL)
    }
}