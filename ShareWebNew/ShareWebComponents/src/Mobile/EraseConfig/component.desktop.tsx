import * as React from 'react';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';


/**
 * 确认擦除弹出框提示
 */
export default function EraseConfig({ onEraseConfirm, onEraseCancle }) {
    return (
        <ConfirmDialog
            onConfirm={onEraseConfirm}
            onCancel={onEraseCancle}
        >
            <div className={styles['erase']}>
                <div className={styles['head']}>{__('您确认要请求擦除该设备上的缓存数据吗？')}</div>
                <div className={styles['content']}>{__('说明：只有当该移动设备切换到客户端时，才能执行数据擦除，擦除后将清除设备上的账号信息，并自动退出登录该设备。')}</div>
            </div>
        </ConfirmDialog >
    )
}