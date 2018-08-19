import * as React from 'react';
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import __ from '../locale';

export default class LinkShareCsfIsNull extends React.Component<any, any> {

    render() {
        return (
            <MessageDialog
                onResize={ this.props.onResize }
                onConfirm={ () => this.props.onCloseDialog() }
            >
                <p>{ __('当前文件未定密，不允许开启访问链接。') }</p>
            </MessageDialog>
        )
    }
}
