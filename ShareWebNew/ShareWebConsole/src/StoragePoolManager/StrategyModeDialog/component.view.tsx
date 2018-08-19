import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Select from '../../../ui/Select/ui.desktop';
import StoragePoolManagerBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class StoragePoolManager extends StoragePoolManagerBase {

    render() {
        let { currentMode } = this.props;
        let replicasModes =
            currentMode.mode === 1 ?
                [{ name: __('1副本模式'), mode: 1 }, { name: __('3副本模式'), mode: 3 }]
                :
                [{ name: __('3副本模式'), mode: 3 }];

        let { selectedMode } = this.state;
        return (
            <div className={classnames(styles['storage-strategy'])}>
                <Dialog
                    width={550}
                    title={__('存储策略配置')}
                    onClose={() => this.props.onStrategyChangeCancel()}
                >
                    <Panel>
                        <Panel.Main >

                            <div className={classnames(styles['storage-strategy-container'])}>
                                <div className={classnames(styles['storage-strategy-body'])}>
                                    <span className={classnames(styles['attr-title'])}>{__('系统存储策略：')}</span>
                                    <Select
                                        value={selectedMode}
                                        className={styles['storage-strategy-selectmenu']}
                                        onChange={(mode) => this.handleSelectStorageStrategyMenu(mode)}
                                    >
                                        {
                                            replicasModes.map((mode) =>
                                                <Select.Option
                                                    selected={_.isEqual(mode, selectedMode)}
                                                    value={mode}
                                                >
                                                    {
                                                        mode.name
                                                    }
                                                </Select.Option>
                                            )
                                        }
                                    </Select>
                                </div>
                                <div className={styles['storage-strategy-foot']}>
                                    <span className={classnames(styles['font-bold'])}>{__('注意：')}</span>
                                    {__('副本数量越多，数据安全性越高，但会导致池内逻辑可用空间减少。只允许更改为更高级的副本模式，无法回退到更低级的副本模式。')}
                                </div>
                            </div>

                        </Panel.Main>

                        <Panel.Footer>
                            <Panel.Button
                                type="submit"
                                onClick={() => { this.props.onStrategyChangeConfirm(this.state.selectedMode); }}
                            >
                                {__('确定')}
                            </Panel.Button>

                            <Panel.Button
                                type="submit"
                                onClick={() => { this.props.onStrategyChangeCancel(); }}
                            >
                                {__('取消')}
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>

            </div >
        )
    }


}
