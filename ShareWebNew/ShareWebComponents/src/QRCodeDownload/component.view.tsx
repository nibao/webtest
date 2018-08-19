import * as React from 'react';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import { Format } from './helper';
import QRCodeDownloadBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class QRCodeDownload extends QRCodeDownloadBase {
    render() {
        return (
            <Panel>
                <Panel.Main>
                    <Form>
                        <Form.Row>
                            <Form.Label>{ __('格式：') }</Form.Label>
                            <Form.Field>
                                <div className={ styles['selectFormat'] }>
                                    <Select
                                        value={ this.state.format }
                                        onChange={ this.selectDownloadFormat.bind(this) }
                                    >
                                        <Select.Option value={ Format.PNG } selected={ true }>{ __('PNG') }</Select.Option>
                                        <Select.Option value={ Format.SVG }>{ __('SVG') }</Select.Option>
                                    </Select>
                                </div>
                            </Form.Field>
                        </Form.Row>
                    </Form>
                </Panel.Main>
                <Panel.Footer>
                    <Panel.Button disabled={ !this.state.url } onClick={ this.downloadQRCode.bind(this) }>{ __('确定') }</Panel.Button>
                    <Panel.Button onClick={ this.props.doCancel }>{ __('取消') }</Panel.Button>
                </Panel.Footer>
            </Panel >
        )
    }
}