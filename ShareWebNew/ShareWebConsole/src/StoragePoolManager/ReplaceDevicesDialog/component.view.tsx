import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Select from '../../../ui/Select/ui.desktop';
import ReplaceDevicesDialogBase from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';


export default class ReplaceDevicesDialog extends ReplaceDevicesDialogBase {

    render() {
        let { replacedPoolDevice, freePoolDevices } = this.props;

        let { waitForReplacedDevices } = this.state;
        return (

            <div className={classnames(styles['storage-replace'])}>

                <div className={classnames(styles['storage-content'])}>
                    <Dialog
                        width={540}
                        title={__('替换设备')}
                        onClose={() => { this.handleReplaceDeviceCancel(); }}
                    >
                        <Panel>
                            <Panel.Main >
                                <div className={classnames(styles['storage-replace-outer'])}>

                                    <div className={classnames(styles['storage-replace-container'])}>

                                        <div className={classnames(styles['storage-replace-content'])}>

                                            <div className={classnames(styles['storage-replace-title'])}>
                                                <span className={classnames(styles['storage-title-label'])}>{__('待替换设备：')}</span>
                                                <span className={classnames(styles['storage-title-info'], styles['font-bold'])}>{__('设备ID：')}{`${replacedPoolDevice.swift_device.dev_id}`}</span>
                                                <span className={classnames(styles['storage-title-info'], styles['font-bold'])}>{__('设备路径：')}{replacedPoolDevice.data_volume.disk_dev_path}</span>
                                                <span className={classnames(styles['storage-title-info'], styles['font-bold'])}>{__('容量：')}{`${replacedPoolDevice.data_volume.capacity_gb.toFixed(2)}GB`}</span>
                                            </div>
                                            <div className={classnames(styles['storage-replace-body'])}>
                                                <span className={classnames(styles['attr-title'])}>{__('请选择新设备：')}</span>
                                                <Select
                                                    value={waitForReplacedDevices}
                                                    className={styles['storage-replace-selectmenu']}
                                                    onChange={(item) => this.handleSelectReplaceDeviceMenu(item)}
                                                >
                                                    {
                                                        freePoolDevices.map((dev) =>
                                                            <Select.Option
                                                                selected={_.isEqual(dev, waitForReplacedDevices)}
                                                                value={dev}
                                                            >
                                                                {
                                                                    dev.name
                                                                }
                                                            </Select.Option>
                                                        )
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className={styles['storage-replace-foot']}>
                                            <span className={classnames(styles['font-bold'])}>{__('注意：')}</span>
                                            <span className={classnames(styles['foot-content'])}>{__('以上空闲设备被加入存储池时将被格式化。')}</span>
                                        </div>


                                    </div>

                                </div>
                            </Panel.Main>

                            <Panel.Footer>
                                <Panel.Button
                                    type="submit"
                                    onClick={() => { this.handleReplaceDeviceConfirm(); }}
                                >
                                    {__('确定')}
                                </Panel.Button>

                                <Panel.Button
                                    type="submit"
                                    onClick={() => { this.handleReplaceDeviceCancel(); }}
                                >
                                    {__('取消')}
                                </Panel.Button>
                            </Panel.Footer>
                        </Panel>
                    </Dialog>


                </div>


            </div>

        )
    }


}
