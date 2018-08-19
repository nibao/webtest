import * as React from 'react';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';

/**
 * 确认禁用弹出框提示
 * @param
 */
export default function DisableConfig({ onDisableConfirm, onDisableCancle }) {
    return (
        <ConfirmDialog
            onConfirm={onDisableConfirm}
            onCancel={onDisableCancle}
        >
            {__('禁用后，将擦除当前账号在该设备上的缓存数据，且当前账号无法再在该设备上进行登录。')}
        </ConfirmDialog >
    )
}