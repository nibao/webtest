import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { getErrorTemplate } from '../../../core/errcode/errcode';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import __ from './locale'

export default function ChangePassword({ errcode, extraMsg, onConfirm = noop }) {
    return (
        function () {
            switch (errcode) {
                case ErrorCode.PersonalQuotaZero:
                    return (
                        <MessageDialog onConfirm={onConfirm}>
                            <p>{__('无法将所有个人配额都分配给群组，请重新输入。')}</p>
                        </MessageDialog>
                    );

                case ErrorCode.QuotaExhausted:
                    return (
                        <MessageDialog onConfirm={onConfirm}>
                            <p>{__('配额空间不足，请重新输入。')}</p>
                        </MessageDialog>
                    );

                default:
                    return (
                        <MessageDialog onConfirm={onConfirm}>
                            <p>
                                {
                                    extraMsg ?
                                        getErrorTemplate(errcode)(extraMsg)
                                        :
                                        getErrorMessage(errcode)
                                }
                            </p>
                        </MessageDialog>
                    );
            }
        }()
    )
}