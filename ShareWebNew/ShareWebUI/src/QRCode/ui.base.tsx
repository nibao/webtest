import * as React from 'react';
import * as qrcode from 'qr.js';
import { PureComponent } from '../decorators';

@PureComponent
export default class QRCodeBase extends React.Component<any, any> {
    static defaultProps = {
        cellSize: 4
    }

    state = {
        modules: []
    }

    componentWillMount() {
        this.updateQR(this.props.text);
    }

    componentWillReceiveProps({ text }) {
        if (text !== this.props.text) {
            this.updateQR(text);
        }
    }

    /**
     * 重新生成二维码
     * @param text 文本
     */
    updateQR(text: string) {
        const modules = qrcode(text, { errorCorrectLevel: qrcode.ErrorCorrectLevel.L }).modules
        this.setState({
            modules
        })
    }
}