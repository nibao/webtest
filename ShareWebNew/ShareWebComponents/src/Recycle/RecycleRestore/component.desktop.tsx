import * as React from 'react';
import * as classnames from 'classnames';
import { docname } from '../../../core/docs/docs';
import ProgressDialog from '../../../ui/ProgressDialog/ui.desktop';
import RecycleRestoreBase from './component.base';
import RestoreConfirm from './RestoreConfirm/component.desktop';
import DuplicateConfirm from './DuplicateConfirm/component.desktop';
import InvalidTipMessage from '../../InvalidTipMessage/component.desktop';
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
                        ? <ProgressDialog
                            title={__('正在还原')}
                            detailTemplate={(item) => __('正在还原：') + docname(item)}
                            data={recycleRestoreDocs}
                            loader={this.loader.bind(this)}
                            onSuccess={() => this.handleRestoreSuccess()}
                            onError={(err, item) => this.handleError(err, item)}
                            onSingleSuccess={(item) => this.onSingleSuccess(item)}
                        />
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

