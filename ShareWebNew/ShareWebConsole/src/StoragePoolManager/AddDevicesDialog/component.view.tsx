import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import SimpleDevicesList from './SimpleDevicesList/component.desktop';
import StoragePoolManagerBase from './component.base';
import { DevicesStatus } from '../helper';
import * as styles from './styles.view.css';
import __ from './locale';

export default class StoragePoolManager extends StoragePoolManagerBase {

    render() {
        const { storagePoolNodeInfo } = this.props;
        const { devicesExceptionStatus } = this.state;

        return (

            <div className={classnames(styles['storage-add'])}>
                <Dialog
                    width={550}
                    title={__('添加设备')}
                    onClose={() => { this.handleAddDeviceCancel(); }}
                >
                    <Panel>
                        <Panel.Main >
                            <div className={classnames(styles['storage-add-container'])}>
                                <div className={classnames(styles['storage-add-content'])}>
                                    <div className={classnames(styles['storage-add-body'])}>
                                        {

                                            storagePoolNodeInfo.map((poolNode) =>
                                                <SimpleDevicesList
                                                    storagePoolNodeInfo={poolNode}
                                                    onFreeDevicesSelected={(selectedFreeDevices, isAll) => { this.handleSelectedFreeDevices(poolNode.node_ip, selectedFreeDevices, isAll) }}
                                                    onGetFreeDevicesFailed={(devicesStatus) => this.handleGetFreeDevicesFailed(devicesStatus)}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles['storage-add-foot']}>
                                <span className={classnames(styles['font-bold'])}>{__('注意：')}</span>
                                <span className={classnames(styles['foot-content'])}>{__('以上空闲设备被加入存储池时将被格式化。')}</span>
                            </div>
                        </Panel.Main>

                        <Panel.Footer>
                            <Panel.Button
                                type="submit"
                                onClick={() => { this.handleAddDeviceConfirm(); }}
                            >
                                {__('确定')}
                            </Panel.Button>

                            <Panel.Button
                                type="submit"
                                onClick={() => { this.handleAddDeviceCancel(); }}
                            >
                                {__('取消')}
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>
                {
                    devicesExceptionStatus.status === DevicesStatus.NoFreeDevices ?
                        <MessageDialog
                            onConfirm={() => { this.handleConfirmGetFreeDevicesFailed() }}
                        >
                            {__('当前存储节点不存在空闲设备。')}
                        </MessageDialog>
                        :
                        devicesExceptionStatus.status === DevicesStatus.GetDevicesFailed ?
                            <ErrorDialog
                                onConfirm={() => { this.handleConfirmGetFreeDevicesFailed() }}
                            >
                                <ErrorDialog.Title>
                                    {__('获取空闲设备失败，错误信息如下：')}
                                </ErrorDialog.Title>
                                <ErrorDialog.Detail>
                                    {devicesExceptionStatus.detail}
                                </ErrorDialog.Detail>
                            </ErrorDialog>
                            : null
                }
            </div>
        )
    }
}