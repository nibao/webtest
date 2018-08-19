import * as React from 'react';
import { docname } from '../../../core/docs/docs';
import ProgressDialog from '../../../ui/ProgressDialog/ui.desktop';
import RecycleDeleterBase from './component.base';
import DeleteConfirm from './DeleteConfirm/component.desktop';
import InvalidTipMessage from '../../InvalidTipMessage/component.desktop';
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
                        <ProgressDialog
                            title={__('正在删除')}
                            detailTemplate={(item) => __('正在删除：') + docname(item)}
                            data={this.props.docs}
                            loader={this.loader.bind(this)}
                            onSuccess={() => this.handleDeleteSuccess()}
                            onError={this.handleError.bind(this)}
                            onSingleSuccess={(item) => this.props.onSingleSuccess(item)}
                        />
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

