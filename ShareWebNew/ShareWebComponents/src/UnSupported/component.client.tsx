import * as React from 'react';
import MessageDialog from '../../ui/MessageDialog/ui.client';
import __ from './locale';

export default class UnSupported extends React.Component<any, any> {

    render() {
        return (
            <MessageDialog
                onResize={this.props.onResize}
                onConfirm={() => this.props.onCloseDialog()}
            >
                <p>{__('暂不支持此功能')}</p>
            </MessageDialog>
        )
    }

}