import * as React from 'react'
import { include } from 'lodash'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { CsfStatus, getCSFErrorMessage } from '../../core/csf/csf'
import { ProgressCircle, MessageDialog } from '../../ui/ui.desktop'
import ApprovalMessage from './ApprovalMessage/component.desktop'
import EditCSF from './EditCSF/component.desktop'
import NoAuditorMessage from './NoAuditorMessage/component.desktop'
import CSFEditorBase from './component.base'
import __ from './locale'

export default class CSFEditor extends CSFEditorBase {
    render() {
        const {csfStatus, showLoading} = this.state

        return (
            <div>
                {
                    csfStatus === CsfStatus.OK ?
                        <EditCSF
                            docs={this.props.docs}
                            csfOptions={this.csfOptions}
                            defaultValue={this.defaultValue}
                            onCancel={this.props.onCloseDialog}
                            onConfirm={(selectedCSF, selectedDocs) => {
                                this.selectedLevel = selectedCSF
                                this.setCsflevel(selectedCSF, selectedDocs)
                            } }
                            />
                        :
                        null
                }
                {
                    showLoading ?
                        <ProgressCircle detail={__('正在提交审核……')} />
                        : null
                }
                {
                    csfStatus === ErrorCode.AuditCSFMismatch ?
                        <NoAuditorMessage
                            docs={this.props.docs}
                            currentDoc={this.currentDoc}
                            onChange={(checked) => this.skipAuditorMissingError = checked}
                            onConfirm={this.closeSkipErrorDialog.bind(this)}
                            />
                        : null
                }
                {
                    csfStatus === CsfStatus.Approval ?
                        <ApprovalMessage
                            onConfirm={this.props.onCloseDialog}
                            doApprovalCheck={this.jumpApprovalCheck.bind(this, 'desktop')}
                            />
                        : null
                }
                {
                    include([CsfStatus.OK, CsfStatus.Loading, ErrorCode.AuditCSFMismatch, CsfStatus.Approval, CsfStatus.None], csfStatus) ?
                        null
                        :
                        <MessageDialog onConfirm={this.props.onCloseDialog}>
                            {
                                getCSFErrorMessage(csfStatus)
                            }
                        </MessageDialog>
                }
            </div>
        )
    }
}