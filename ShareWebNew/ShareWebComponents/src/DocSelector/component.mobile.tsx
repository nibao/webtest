import * as React from 'react';
import DocSelectorBase from './component.base';
import Dialog from '../../ui/Dialog/ui.mobile';
import Button from '../../ui/Button/ui.mobile';
import DocTree from '../DocTree/component.mobile';
import { isDir } from '../../core/docs/docs';
import { isTopView } from '../../core/entrydoc/entrydoc';

import __ from './locale';
import * as styles from './styles.mobile.css';

export default class DocSelector extends DocSelectorBase {
    render() {
        return (
            <div className={styles['container']}>
                <Dialog width="20rem">
                    <Dialog.Header closable={true} onClose={() => this.props.onCancel()}>
                        {__('选择文件')}
                    </Dialog.Header>
                    <Dialog.Main>
                        <div className={styles['tree-box']}>
                            <DocTree {...this.props} onSelectionChange={this.onSelectionChange.bind(this)} />
                        </div>
                    </Dialog.Main>
                    <Dialog.Footer>
                        <div className={styles['button-wrap']}>
                            <Button type="submit" disabled={this.getBtnDisabled(this.state.selection)} onClick={this.confirm.bind(this)}>{__('确定')}</Button>
                        </div>
                        <div className={styles['button-wrap']}>
                            <Button onClick={() => this.props.onCancel()}>{__('取消')}</Button>
                        </div>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}