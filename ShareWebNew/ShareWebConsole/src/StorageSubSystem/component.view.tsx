import * as React from 'react';
import * as classnames from 'classnames';
import StorageSubSystemBase from './component.base';
import StoragePoolManager from '../StoragePoolManager/component.view';
import StorageModel from '../StorageModel/component.view';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import ThirdPartyStorage from '../ThirdPartyStorage/component.view';
import __ from './locale';
import { InitStatus, ManageMode, StorageMode, LoadingStatus } from './helper';
import * as styles from './styles.view.css';


export default class StorageSubSystem extends StorageSubSystemBase {

    render() {
        let { storageMode, loadingStatus, thirdPartyOSSInfo, storageInitStatus, manageMode } = this.state;
        return (

            <div className={classnames(styles['storage'])}>

                {
                    loadingStatus === LoadingStatus.LOADING ?
                        this.renderLoadingContent(loadingStatus)
                        :
                        this.renderStoragePanel(storageMode, thirdPartyOSSInfo, manageMode, storageInitStatus)

                }
            </div>

        )
    }
    /**
     * 渲染存储面板
     */
    renderStoragePanel(storageMode, thirdPartyOSSInfo, manageMode, storageInitStatus) {
        switch (storageMode) {
            case StorageMode.SWIFT:
                return this.renderSwiftPanel(storageInitStatus, manageMode)

            case StorageMode.ASU:
            case StorageMode.THIRD:
                return (
                    <ThirdPartyStorage
                        thirdPartyOSSInfo={thirdPartyOSSInfo}
                        storageMode={storageMode}
                    />
                )
            default:
                break;
        }
    }

    /**
     * 渲染本地Swift存储面板
     */
    renderSwiftPanel(storageInitStatus, manageMode) {
        switch (storageInitStatus) {
            case InitStatus.UNINIT:
                return (
                    <StorageModel
                        storageModelSelection={StorageMode.ASU}
                        onSelectionConfirm={this.handleSelectStorageModel.bind(this)}
                        onSelectionCancel={this.handleCancelSelectiStorageModel.bind(this)}
                    />
                )
            case InitStatus.TOINIT:
            case InitStatus.INITED:
                return (
                    <div className={classnames(styles['storage-panel'])}>
                        {/* <div className={classnames(styles['storage-head'])}>
                            <Button
                                className={classnames(styles['storage-head-button'], { [styles['btn-selected']]: manageMode === ManageMode.NODE })}
                                onClick={() => this.handleSelectManageMode(ManageMode.NODE)}
                            >
                                {__('存储节点管理')}
                            </Button>
                            <Button
                                className={classnames(styles['storage-head-button'], { [styles['btn-selected']]: manageMode === ManageMode.POOL })}
                                onClick={() => this.handleSelectManageMode(ManageMode.POOL)}
                            >
                                {__('存储池管理')}
                            </Button>
                        </div> */}

                        <div className={classnames(styles['storage-body'])}>
                            {
                                manageMode === ManageMode.POOL ?
                                    <StoragePoolManager
                                        storageInitStatus={storageInitStatus}
                                        onInitedSucceed={this.handleInitedSucceed.bind(this)}
                                    />
                                    :
                                    null

                            }
                        </div>
                    </div>
                )
            case InitStatus.INITCANCEL:
            default:
                break;
        }
    }

    /**
    * 渲染等待提示
    */
    renderLoadingContent(loadingStatus) {
        let loadingMsg = '';
        switch (loadingStatus) {
            case LoadingStatus.NOVISIBLE:
                return;
            case LoadingStatus.LOADING:
                loadingMsg = __('正在加载，请稍候......')
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

}
