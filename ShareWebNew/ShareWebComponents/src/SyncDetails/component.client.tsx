import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.client';
import Panel from '../../ui/Panel/ui.desktop';
import Tabs from '../../ui/Tabs/ui.desktop';
import NWWindow from '../../ui/NWWindow/ui.client';
import { SyncMode } from '../../core/client/client';
import { ClientComponentContext } from '../helper';
import Syncing from './Syncing/component.client';
import Completed from './Completed/component.client';
import Failed from './Failed/component.client';
import Unsync from './Unsync/component.client';
import CancelConfig from './CancelConfig/component.client';
import SyncDetailsBase from './component.base';
import * as styles from './styles.client.css';
import __ from './locale';

export default class SyncDetails extends SyncDetailsBase {

    render() {
        const { onOpenSyncDetailsDialog, onCloseDialog, fields, id } = this.props
        return (
            <NWWindow
                id={id}
                title={__('同步详情')}
                onOpen={onOpenSyncDetailsDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <Dialog width={800}>
                        <Panel>

                            <div className={styles['wrapper']}>
                                <Tabs>
                                    <Tabs.Navigator className={styles['tabs-navigator']}>
                                        <Tabs.Tab key="tab-prop" className={styles['tabs-tab']} active={this.props.defaultActiveView === SyncMode.Syncing}>
                                            <div>
                                                {__('正在同步')}
                                            </div>

                                        </Tabs.Tab>
                                        <Tabs.Tab key="tab-permission" className={styles['tabs-tab']} active={this.props.defaultActiveView === SyncMode.Synced}>

                                            <div>
                                                {__('同步完成')}
                                            </div>
                                        </Tabs.Tab>
                                        <Tabs.Tab key="tab-revision" className={styles['tabs-tab']}>
                                            <div>
                                                {__('同步失败')}
                                            </div>
                                        </Tabs.Tab>
                                        <Tabs.Tab key="tab-unsync" className={styles['tabs-tab']} active={this.props.defaultActiveView === SyncMode.UnSynced}>
                                            <div>
                                                {__('未同步')}
                                            </div>
                                        </Tabs.Tab>
                                    </Tabs.Navigator>
                                    <Tabs.Main className={styles['tabs-main']}>
                                        <Tabs.Content className={styles['tabs-content']} key="content-prop">
                                            <Syncing detail={this.state.detail}
                                                total={this.state.total}
                                                resumeAllTask={this.resumeAllTask.bind(this)}
                                                pauseAllTask={this.pauseAllTask.bind(this)}
                                                cancelAllTask={this.cancelAllTask.bind(this)}
                                                pause={this.pause.bind(this)}
                                                resume={this.resume.bind(this)}
                                                cancel={this.cancel.bind(this)}
                                                showTextByStatus={this.showTextByStatus.bind(this)}
                                                showTaskIcon={this.showTaskIcon.bind(this)}
                                            />
                                        </Tabs.Content>
                                        <Tabs.Content className={styles['tabs-content']} key="content-permission">
                                            <Completed completedSyncs={this.state.completedSyncs}
                                                completedNum={this.state.completedNum}
                                                clear={this.clear.bind(this, 0)}
                                                openFileByRelPath={this.openFileByRelPath.bind(this)}
                                                openDirByRelPath={this.openDirByRelPath.bind(this)}
                                                openFileByAbsPath={this.openFileByAbsPath.bind(this)}
                                                openDirByAbsPath={this.openDirByAbsPath.bind(this)}
                                                deleteByLogId={this.deleteByLogId.bind(this)}
                                                showTaskIcon={this.showTaskIcon.bind(this)}
                                            />
                                        </Tabs.Content>
                                        <Tabs.Content className={styles['tabs-content']} key="content-revision">
                                            <Failed failedSyncs={this.state.failedSyncs}
                                                failedNum={this.state.failedNum}
                                                clear={this.clear.bind(this, 1)}
                                                openDirByRelPath={this.openDirByRelPath.bind(this)}
                                                openDirByAbsPath={this.openDirByAbsPath.bind(this)}
                                                deleteByLogId={this.deleteByLogId.bind(this)}
                                                showTaskIcon={this.showTaskIcon.bind(this)}
                                            />
                                        </Tabs.Content>
                                        <Tabs.Content className={styles['tabs-content']} key="content-unsync">
                                            <Unsync
                                                unSyncs={this.state.unSyncs}
                                                unSyncsNum={this.state.unSyncsNum}
                                                isSelectDir={this.state.isSelectDir}
                                                selectDir={this.selectDir.bind(this)}
                                                transferUnsyc={this.transferUnsyc.bind(this)}
                                                uploadUnsync={this.uploadUnsync.bind(this)}
                                                onSelectDir={this.onSelectDir.bind(this)}
                                                openDirByAbsPath={this.openDirByAbsPath.bind(this)}
                                            />
                                        </Tabs.Content>
                                    </Tabs.Main>
                                </Tabs>
                            </div>
                        </Panel>
                        {
                            this.state.cancelAllTask === true && !this.state.skipDirectTransferTip ?
                                <NWWindow
                                    onOpen={nwWindow => this.nwWindow = nwWindow}
                                    onClose={this.onCancelConfigCancel.bind(this)}
                                    title={__('提示')}
                                >
                                    <CancelConfig
                                        onConfirm={this.onCancelAllTaskConfirm.bind(this)}
                                        onCancel={this.onCancelConfigCancel.bind(this)}
                                    />
                                </NWWindow>
                                :
                                null
                        }
                        {
                            this.state.cancelTaskId !== '' && !this.state.skipDirectTransferTip ?
                                <NWWindow
                                    onOpen={nwWindow => this.nwWindow = nwWindow}
                                    onClose={this.onCancelConfigCancel.bind(this)}
                                    title={__('提示')}
                                >
                                    <CancelConfig
                                        onConfirm={this.onCancelTaskIdConfirm.bind(this, this.state.cancelTaskId)}
                                        onCancel={this.onCancelConfigCancel.bind(this)}
                                    />
                                </NWWindow>
                                :
                                null
                        }
                    </Dialog>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }

} 