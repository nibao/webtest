import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import DiskUserTree from './DiskUserTree/component.view';
import EnableDiskBase from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';

export default class EnableDisk extends EnableDiskBase {
    render() {
        return (
            <Dialog
                title={__('开启网盘')}
                width={460}
                onClose={() => this.props.onCancel()}
            >
                <Panel>
                    <Panel.Main>
                        <div>{__('请选择需要开启网盘的用户组织：')}</div>
                        <div className={styles['tree-box']}>
                            <DiskUserTree
                                checked={false}
                                onSelectionChange={(selection) => this.setState({ selection })}
                            />
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            type="submit"
                            disabled={!this.state.selection.length}
                            onClick={() => this.onConfirm()}
                        >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button onClick={() => this.props.onCancel()}>
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }
}