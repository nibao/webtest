import * as React from 'react';
import { docname } from '../../../core/docs/docs';
import ProgressDialog from '../../../ui/ProgressDialog/ui.client';
import RecycleRestoreBase from './component.base';
import NWWindow from '../../../ui/NWWindow/ui.client';
import RestoreConfirm from './RestoreConfirm/component.client';
import DuplicateConfirm from './DuplicateConfirm/component.client';
import InvalidTipMessage from '../../InvalidTipMessage/component.client';
import __ from './locale';
import * as styles from './styles.desktop';

export default class RecycleRestore extends RecycleRestoreBase {
    render() {
        const { errorCode, showRestoreConfirm, recycleRestoreDocs, recycleRestoreRename, progressDialogShow, renameDoc, suggestName, skipRenameError } = this.state;
        return (
            <div>
                {
                    showRestoreConfirm ?
                        <RestoreConfirm
                            recycleRestoreDocs={recycleRestoreDocs}
                            onConfirmRestore={this.onConfirmRestore.bind(this)}
                            onCancel={() => this.props.onCancel()}
                        />
                        :
                        null
                }
                {
                    recycleRestoreRename && !skipRenameError
                        ?
                        <DuplicateConfirm
                            renameDoc={renameDoc}
                            onCancel={() => this.props.onCancel()}
                            suggestName={suggestName}
                            handleCheckSkip={() => { this.handleCheckSkip(); }}
                            handleUnCheckSkip={() => { this.handleUnCheckSkip(); }}
                            onConfirmRename={() => this.onConfirmRename()}
                        />
                        : null
                }
                {
                    progressDialogShow

                        ?
                        <NWWindow
                            modal={true}
                            onOpen={nwWindow => this.progressDialogShowWindow = nwWindow}
                            title={__('正在还原')}
                            onClose={this.handleCloseProgressDialog.bind(this)}
                        >
                            <ProgressDialog
                                detailTemplate={(item) => __('正在还原：') + docname(item)}
                                data={recycleRestoreDocs}
                                loader={this.loader.bind(this)}
                                onSuccess={() => { this.progressDialogShowWindow.close(); this.handleRestoreSuccess() }}
                                onError={(err, item) => { this.progressDialogShowWindow.close(); this.handleError(err, item) }}
                                onSingleSuccess={(item) => this.onSingleSuccess(item)}

                            />
                        </NWWindow>
                        : null
                }

                {
                    errorCode !== -1 ?
                        <InvalidTipMessage
                            onConfirm={() => this.props.onCancel()}
                            errorCode={errorCode}
                            errorDoc={renameDoc}
                        >
                        </InvalidTipMessage>
                        :
                        null
                }
            </div>
        )
    }
}

