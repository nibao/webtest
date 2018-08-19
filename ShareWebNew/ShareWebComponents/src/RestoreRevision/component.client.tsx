import * as React from 'react';
import NWWindow from '../../ui/NWWindow/ui.client';
import { ClientComponentContext } from '../helper';
import ConfirmRestore from './ConfirmRestore/component.client';
import ErrorMessage from './ErrorMessage/component.client'
import RestoreRevisionsBase from './component.base';
import __ from './locale';

export default class RestoreRevisions extends RestoreRevisionsBase {
    render() {
        const { onOpenRestoreRevisionDialog, onCloseRestoreRevisionDialog, fields, id } = this.props
        return (
            <NWWindow
                title={__('还原历史版本')}
                id={id}
                onOpen={onOpenRestoreRevisionDialog}
                onClose={onCloseRestoreRevisionDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div>
                        {
                            !!this.state.showError && (
                                this.renderError(this.props.doc.name, this.state.errorCode)
                            )
                        }
                        <ConfirmRestore
                            revision={this.props.revision}
                            onConfirm={this.restore.bind(this)}
                            onCancel={this.props.onRevisionRestoreCancel}
                        />
                    </div>
                </ClientComponentContext.Consumer>

            </NWWindow>
        )
    }

    renderError(name, errorCode) {
        return (
            <NWWindow
                onOpen={nwWindow => this.nwWindow = nwWindow}
                onClose={() => this.setState({ showError: false })}
                title={__('提示')}
            >
                <ErrorMessage
                    onConfirm={this.confirmError.bind(this)}
                    name={name}
                    errorCode={errorCode}
                />
            </NWWindow >
        )
    }
}