import * as React from 'react';
import { isFunction } from 'lodash';
import { restoreRevision } from '../../core/apis/efshttp/file/file';
import { getInfoByPath } from '../../core/apis/client/cache/cache';
import { requestDownloadFile, requestLocalCleanFile } from '../../core/apis/client/sync/sync';

export default class RestoreRevisionsBase extends React.Component<Components.RestoreRevisions.Props, Components.RestoreRevisions.State>{

    state = {
        errorCode: 0,
        showError: false,
        restoreNewName: ''
    }

    async restore() {
        try {
            await restoreRevision({ docid: this.props.doc.docid, rev: this.props.revision.rev });
            const { cacheInfo } = await getInfoByPath({ relPath: [this.props.doc.relPath] })
            const { state } = cacheInfo[0]
            if (state === 2 || state === 3) {
                await requestDownloadFile({ relPath: this.props.doc.relPath });
            }
            isFunction(this.props.onRevisionRestoreSuccess) && this.props.onRevisionRestoreSuccess(this.props.doc, this.props.revision);
        } catch (ex) {
            this.setState({
                errorCode: ex.errcode,
                showError: true
            })
        }
    }

    confirmError() {
        if (this.state.errorCode === 403070) {
            requestLocalCleanFile({ relPath: this.props.doc.relPath })
        }

        if (this.nwWindow) {
            this.nwWindow.close();
        }

        isFunction(this.props.onConfirmError) && this.props.onConfirmError()
    }
}