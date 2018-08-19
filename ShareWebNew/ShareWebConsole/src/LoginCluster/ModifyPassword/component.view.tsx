import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import { AuthResults } from '../helper';
import __ from './locale';

const ModifyPassword: React.StatelessComponent<Components.LoginCluster.ModifyPassword.Props> = function ModifyPassword({
    onModifyConfirm = noop,
    onModifyCancel = noop,
    errorCode
}) {
    switch (errorCode) {
        case AuthResults.PwdInValid:
            return (
                <ConfirmDialog
                    onConfirm={onModifyConfirm}
                    onCancel={onModifyCancel}
                >
                    {__('您的登录密码已失效，是否立即修改密码？')}
                </ConfirmDialog >
            )
        case AuthResults.PwdUnSafe:
            return (
                <ConfirmDialog
                    onConfirm={onModifyConfirm}
                    onCancel={onModifyCancel}
                >
                    {__('您的密码安全系数过低，是否立即修改密码？')}
                </ConfirmDialog >
            )
    }
}

export default ModifyPassword