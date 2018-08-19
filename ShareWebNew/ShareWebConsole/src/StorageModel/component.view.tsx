import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import RadioBoxOption from '../../ui/RadioBoxOption/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import { StorageMode } from '../StorageSubSystem/helper';
import StorageModelBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';


export default class StorageModel extends StorageModelBase {

    render() {
        let { storageModelSelection, showWarningDialog } = this.state;
        return (
            < div className={classnames(styles['storage-uninit'])} >
                <Dialog
                    width={500}
                    title={__('存储模式')}
                    onClose={() => { this.handleModeCancel() }}
                >
                    <Panel>
                        <Panel.Main >
                            <div className={classnames(styles['storage-uninit-container'])}>
                                <div className={classnames(styles['storage-uninit-head'])}>
                                    {__('请选择一种存储模式：')}
                                </div>

                                <div className={styles['storage-uninit-body']}>
                                    <div className={styles['storage-uninit-option']}>
                                        <RadioBoxOption
                                            onChange={this.handleSelectStorageModel.bind(this)}
                                            className={classnames(styles['inline-radio'])}
                                            value={StorageMode.ASU}
                                            checked={storageModelSelection === StorageMode.ASU}
                                        >
                                            <span className={styles['radio-content']}>
                                                {__('本地Ceph存储')}
                                            </span>
                                        </RadioBoxOption>
                                    </div>
                                    <div className={styles['storage-uninit-option']}>
                                        <RadioBoxOption
                                            onChange={this.handleSelectStorageModel.bind(this)}
                                            className={classnames(styles['inline-radio'])}
                                            value={StorageMode.SWIFT}
                                            checked={storageModelSelection === StorageMode.SWIFT}
                                        >
                                            <span className={styles['radio-content']}>
                                                {__('本地Swift存储')}
                                            </span>
                                        </RadioBoxOption>
                                    </div>
                                    <div className={styles['storage-uninit-option']}>
                                        <RadioBoxOption
                                            onChange={this.handleSelectStorageModel.bind(this)}
                                            className={classnames(styles['inline-radio'])}
                                            value={StorageMode.THIRD}
                                            checked={storageModelSelection === StorageMode.THIRD}
                                        >
                                            <span className={styles['radio-content']}>
                                                {__('第三方存储')}
                                            </span>
                                        </RadioBoxOption>
                                    </div>
                                </div>

                            </div>


                        </Panel.Main>

                        <Panel.Footer>
                            <Panel.Button
                                type="submit"
                                onClick={() => { this.handleModeConfirm(); }}
                            >
                                {__('确定')}
                            </Panel.Button>

                            <Panel.Button
                                type="submit"
                                onClick={() => { this.handleModeCancel(); }}
                            >
                                {__('取消')}
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>

                {
                    showWarningDialog ?
                        <ConfirmDialog
                            onConfirm={() => { this.handleConfirmConfirmDialog() }}
                            onCancel={() => { this.handleCancelConfirmDialog() }}
                        >
                            {__('存储模式一旦选用，无法进行切换，您确定要执行此操作吗？')}
                        </ConfirmDialog>
                        :
                        null
                }
            </div >

        )
    }

}
