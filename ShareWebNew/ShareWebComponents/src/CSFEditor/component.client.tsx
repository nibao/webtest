import * as React from 'react'
import { include } from 'lodash'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { CsfStatus, getCSFErrorMessage } from '../../core/csf/csf'
import { MessageDialog, NWWindow } from '../../ui/ui.client'
import { Icon } from '../../ui/ui.desktop'
import { ClientComponentContext } from '../helper'
import Mounting from '../Mounting/component.client'
import ApprovalMessage from './ApprovalMessage/component.client'
import EditCSF from './EditCSF/component.client'
import NoAuditorMessage from './NoAuditorMessage/component.client'
import CSFEditorBase from './component.base'
import __ from './locale'

export default class CSFEditor extends CSFEditorBase {
    render() {
        const { onOpenCSFEditorDialog, onCloseDialog, fields, id } = this.props
        const { csfStatus } = this.state

        return (
            <NWWindow
                id={id}
                title={__('密级设置')}
                onOpen={onOpenCSFEditorDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
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
                                    }}
                                />
                                :
                                null
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
                                    doApprovalCheck={this.jumpApprovalCheck.bind(this, 'client')}
                                />
                                : null
                        }
                        {
                            include([CsfStatus.OK, CsfStatus.Loading, ErrorCode.AuditCSFMismatch, CsfStatus.Approval, CsfStatus.None], csfStatus) ?
                                null
                                :
                                <MessageDialog onConfirm={this.props.onCloseDialog}>
                                    {
                                        csfStatus ?
                                            getCSFErrorMessage(csfStatus)
                                            :
                                            __('网络连接失败')
                                    }
                                </MessageDialog>
                        }
                        {
                            csfStatus === CsfStatus.None ?
                                <Mounting />
                                : null
                        }
                    </div>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }
}