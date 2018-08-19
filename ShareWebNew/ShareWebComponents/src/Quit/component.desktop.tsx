import * as React from 'react';
import ProgressDialog from '../../ui/ProgressDialog/ui.desktop';
import Comfirmation from './Confirmation/component.desktop'
import QuitBase from './component.base';
import __ from './locale';

export default class Quit extends QuitBase {

    render() {
        return (
            this.state.start ? (
                <ProgressDialog
                    data={this.props.docs}
                    title={__('屏蔽共享')}
                    detailTemplate={this.getDetailTemplate}
                    loader={this.getLoader}
                    onSuccess={this.props.onSuccess}
                    onSingleSuccess={this.props.onSingleSuccess}
                    onError={this.props.onError}
                />
            ) : (
                    <Comfirmation
                        onConfirm={this.confirm.bind(this)}
                        onCancel={() => this.props.onCancel()}
                    />
                )
        )
    }
}