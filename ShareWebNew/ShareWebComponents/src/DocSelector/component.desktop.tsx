import * as React from 'react';
import DocSelectorBase from './component.base';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import DocTree from '../DocTree/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class DocSelector extends DocSelectorBase {
    render() {
        return (
            <div className={styles['container']}>
                <Dialog
                    title={__('选择文件')}
                    width={460}
                    onClose={() => this.props.onCancel()}
                    >
                    <Panel>
                        <Panel.Main>
                            <div className={styles['tree-box']}>
                                <DocTree {...this.props} onSelectionChange={this.onSelectionChange.bind(this)} />
                            </div>
                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button type="submit" disabled={this.getBtnDisabled(this.state.selection)} onClick={this.confirm.bind(this)}>{__('确定')}</Panel.Button>
                            <Panel.Button onClick={() => this.props.onCancel()}>{__('取消')}</Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>
            </div>
        )
    }
}