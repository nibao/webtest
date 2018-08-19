import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../../ui/ConfirmDialog/ui.desktop';
import { Type } from '../helper';
import __ from './locale';

export default function DeleteConfig({ deleteLicense, onDeleteConfirm = noop, onDeleteCancel = noop }) {

    return (
        <ConfirmDialog
            title={__('删除授权码')}
            onConfirm={onDeleteConfirm}
            onCancel={onDeleteCancel}
        >
            {
                deleteLicense.type === Type.Test ?
                    __('删除该授权码将导致产品授权失效，您确定要执行此操作吗？')
                    :
                    deleteLicense.type === Type.Base ?
                        __('删除该授权码将导致产品授权全部失效，您确定要执行此操作吗？')
                        :
                        deleteLicense.type === Type.Opition ?
                            __('删除该授权码将导致已授权的选件功能失效，您确定要执行此操作吗？')
                            :
                            __('删除该授权码将导致已授权的代理失效，您确定要执行此操作吗？')
            }

        </ConfirmDialog>
    )
}