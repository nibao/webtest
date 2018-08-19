import * as React from 'react';
import { docname } from '../../../core/docs/docs';
import ProgressDialog from '../../../ui/ProgressDialog/ui.client';
import RecycleDeleterBase from './component.base';
import DeleteConfirm from './DeleteConfirm/component.client';
import NWWindow from '../../../ui/NWWindow/ui.client';
import InvalidTipMessage from '../../InvalidTipMessage/component.client';
import * as styles from './styles.desktop';
import __ from './locale';


export default class RecycleDeleter extends RecycleDeleterBase {
    render() {
        const { recycleDeleteShow, progressDialogShow, errorCode, errorDoc } = this.state;
        return (
            <div>
                {
                    recycleDeleteShow ?
                        <DeleteConfirm
                            docs={this.props.docs}
                            deleteFiles={this.deleteFiles.bind(this)}
                            onCancel={() => this.props.onCancel()}
                        />
                        :
                        null
                }
                {
                    progressDialogShow ?
                        <NWWindow
                            modal={true}
                            onOpen={nwWindow => this.progressDialogShowWindow = nwWindow}
                            title={__('正在删除')}
                            onClose={this.handleCloseProgressDialog.bind(this)}
                        >
                            <ProgressDialog
                                detailTemplate={(item) => __('正在删除：') + docname(item)}
                                data={this.props.docs}
                                loader={this.loader.bind(this)}
                                onSuccess={() => { this.progressDialogShowWindow.close(); this.handleDeleteSuccess() }}
                                onError={(err, data) => { this.progressDialogShowWindow.close(); this.handleError(err, data) }}
                                onSingleSuccess={(item) => { this.props.onSingleSuccess(item) }}
                            />
                        </NWWindow>
                        :
                        null
                }

                {
                    errorCode !== -1 ?
                        <InvalidTipMessage
                            onConfirm={() => this.props.onCancel()}
                            errorCode={errorCode}
                            errorDoc={errorDoc}
                        >
                        </InvalidTipMessage>
                        :
                        null
                }
            </div>
        )
    }



}

