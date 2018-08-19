import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import CheckBox from '../../../../ui/CheckBox/ui.desktop';
import DataList from '../../../../ui/DataList/ui.desktop';
import UIIcon from '../../../../ui/UIIcon/ui.desktop';
import Icon from '../../../../ui/Icon/ui.desktop';
import { decorateText } from '../../../../util/formatters/formatters';
import SimpleDevicesListBase from './component.base';
import * as loadingImg from './assets/loading.gif';
import * as styles from './styles.desktop.css';

export default class SimpleDevicesList extends SimpleDevicesListBase {

    render() {
        const { storagePoolNodeInfo } = this.props;
        const { showPoolDevicesList, deviceSelection, checked, halfChecked, storagePoolFreeDevices, loading } = this.state;

        return (
            <div className={classnames(styles['storage-add-devices'])}>
                <div
                    className={classnames(styles['storage-add-ip'])}
                    onClick={() => { this.handleExpandDeviceList() }}
                >
                    {
                        loading ?
                            <div className={styles['loading-icon']}>
                                <Icon url={loadingImg} size={14} />
                            </div>
                            : <UIIcon
                                className={styles['storage-add-expand-icon']}
                                code={showPoolDevicesList ? '\uf04c' : '\uf04b'}
                                size="14px"
                            />
                    }
                    <CheckBox
                        checked={checked}
                        halfChecked={halfChecked}
                        onChange={this.handleClickTopCheckBox.bind(this)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className={classnames(styles['storage-add-ip-content'])}>
                        {storagePoolNodeInfo.node_ip}
                    </span>
                </div>
                {
                    showPoolDevicesList ?
                        <div className={classnames(styles['storage-add-list'])}>
                            <div className={classnames(styles['storage-add-list-body'])}>
                                <DataList
                                    onSelectionChange={(selection) => { this.handleSelectDevice(selection); }}
                                    selections={deviceSelection}
                                    multiple={true}
                                >
                                    {
                                        _.values(storagePoolFreeDevices).map((device) =>
                                            <DataList.Item
                                                key={storagePoolNodeInfo.node_ip + device.disk_dev_path}
                                                checkbox={true}
                                                className={styles['storage-add-list-item']}
                                                data={device}
                                                selectable={true}
                                                selecting={false}
                                            >
                                                <span className={styles['list-item']}>{`/${decorateText(device.disk_dev_path, { limit: 20 }).slice(1)}`}</span>
                                                <span className={styles['list-item']}>{`(${device.capacity_gb.toFixed(2)}GB)`}</span>
                                            </DataList.Item>
                                        )
                                    }
                                </DataList>
                            </div>
                        </div>
                        :
                        null
                }
            </div >
        )
    }
}