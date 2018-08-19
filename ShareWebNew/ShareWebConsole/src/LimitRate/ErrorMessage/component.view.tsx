import * as React from 'react';
import { noop } from 'lodash';
import { ErrorCode } from '../../../core/thrift/sharemgnt/errcode';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import __ from './locale';

const ErrorTitle = {
    [ErrorCode.LimitRateNotExist]: __('该条限速配置不存在。'),
    [ErrorCode.LimitUserExist]: __('用户已存在于列表中'),
    [ErrorCode.LimitDepartExist]: __('部门已存在于列表中')
}

/**
 * 显示错误弹窗
 */
const ErrorMsg: React.StatelessComponent<Components.LimitRate.ErrorMsg.Props> = function ErrorMsg({
    errorInfo,
    onConfirmErrMsg = noop
}) {
    return (
        <ErrorDialog onConfirm={onConfirmErrMsg}>
            {
                errorInfo.errCode ?
                    <ErrorDialog.Title>
                        {ErrorTitle[errorInfo.errCode]}
                    </ErrorDialog.Title>
                    : null
            }
            <ErrorDialog.Detail>
                {errorInfo.errMsg}
            </ErrorDialog.Detail>
        </ErrorDialog>

    )
}

export default ErrorMsg