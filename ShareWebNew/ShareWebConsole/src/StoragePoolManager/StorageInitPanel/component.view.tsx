import * as React from 'react';
import * as classnames from 'classnames';
import Button from '../../../ui/Button/ui.desktop';
import CustomSelectMenu from '../CustomSelectMenu/component.desktop';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import ProgressCircle from '../../../ui/ProgressCircle/ui.desktop';
import * as loading from '../assets/loading.gif';
import Icon from '../../../ui/Icon/ui.desktop';
import { LoadingStatus, ErrorStatus, WarningStatus } from '../helper';
import StorageInitPanelBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class StorageInitPanel extends StorageInitPanelBase {

    render() {
        let replicasModes = [{ name: __('1副本模式'), mode: 1 }, { name: __('3副本模式'), mode: 3 }];
        let defaultReplicasMode = { name: '--', mode: 0 };
        let { errorMsg, errorStatus, warningStatus, storageStrategyMode, loadingStatus } = this.state;
        return (
            <div className={classnames(styles['storage-init'])}>
                {
                    this.renderLoadingContent(loadingStatus)
                }

                <div className={classnames(styles['font-color-red'], styles['storage-init-title'])}>{__('存储池尚未执行初始化，请先进行初始化设置！')}</div>
                <CustomSelectMenu
                    label={__('系统存储策略')}
                    btnClassName={styles['storage-select-btn']}
                    popmenuClassName={styles['storage-select-popmenu']}
                    defaultSelectedValue={defaultReplicasMode}
                    candidateItems={replicasModes}
                    className={styles['storage-select-menu']}
                    onSelect={(item) => { this.handleSelectStorageStrategyMenu(item) }}
                />
                <Button
                    className={classnames(styles['storage-excuteInit-btn'], { [styles['disabled']]: storageStrategyMode.mode === 0 })}
                    disabled={storageStrategyMode.mode === 0}
                    onClick={() => this.handleExcuteInitStoragePool()}
                >
                    {__('执行初始化')}
                </Button>
                <div>
                    <span className={classnames(styles['font-grey'])}>{__('注意：副本数量越多，数据安全性越高，但会导致池内逻辑可用空间减少。只允许更改为更高级的副本模式，无法回退到更低级的副本模式。')}</span>
                </div>

                {
                    this.renderWarningContent(warningStatus, storageStrategyMode.mode)
                }

                {
                    this.renderErrorContent(errorStatus, errorMsg)
                }
            </div>

        )
    }


    /**
     * 渲染等待提示
     */
    renderLoadingContent(loadingStatus) {
        let loadingMsg = '';
        switch (loadingStatus) {
            case LoadingStatus.NOVISIBLE:
                return;
            case LoadingStatus.INITING:
                loadingMsg = __('正在初始化，请稍候......')
                break;
            default:
                return;
        }

        return (
            <div className={styles['loading']}>
                <ProgressCircle
                    detail={loadingMsg}
                />
            </div>
        )
    }

    /**
     * 渲染警告提示框
     */
    renderWarningContent(warningStatus, mode) {
        let warningMsg = '';
        switch (warningStatus) {
            case WarningStatus.NOVISIBLE:
                return;
            case WarningStatus.CHOOSE_MODE:
                warningMsg = __('系统存储策略将设为${which}副本模式，您确定要执行此操作吗？', { which: mode })
            default:
                break;
        }

        return (
            <ConfirmDialog
                onConfirm={() => { this.handleConfirmConfirmDialog() }}
                onCancel={() => { this.handleCancelConfirmDialog() }}
            >
                {warningMsg}
            </ConfirmDialog>
        )
    }

    /**
     * 渲染错误提示框
     */
    renderErrorContent(errorStatus, errorMsg) {
        let errorTitle = '';
        switch (errorStatus) {
            case ErrorStatus.NOVISIBLE:
                return;
            case ErrorStatus.INIT_FAILED:
                errorTitle = __('初始化失败，错误信息如下：');
                break;
            default:
                return;
        }

        return (
            <ErrorDialog
                onConfirm={() => { this.handleConfirmErrorDialog() }}
            >
                <ErrorDialog.Title>
                    {errorTitle}
                </ErrorDialog.Title>
                <ErrorDialog.Detail>
                    {errorMsg}
                </ErrorDialog.Detail>
            </ErrorDialog>
        )
    }


}
