import * as React from 'react';
import { ViewDocType, isTopView } from '../../core/entrydoc/entrydoc';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import ExceptionStrategy from '../ExceptionStrategy/component.desktop';
import DocTree from '../DocTree/component.desktop';
import { SelectType } from '../DocTree/component.base';
import SaveLinkBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class SaveLink extends SaveLinkBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.showSelectFile ?
                        this.getSaveLinkTemplate() :
                        null
                }
                {
                    this.state.showLoading ?
                        <ProgressCircle detail={__('正在复制，请稍候...')} /> :
                        null
                }

                {
                    this.state.exception ?
                        this.getExceptionTemplate() :
                        null
                }
            </div>
        )
    }

    getSaveLinkTemplate() {
        return (
            <Dialog
                title={__('转存到我的云盘')}
                width={460}
                onClose={() => { this.cancelAllCopies() }}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['tree-box']}>
                            <DocTree
                                selectRange={[ViewDocType.UserDoc]}
                                selectType={[SelectType.DIR]}
                                onSelectionChange={(file) => { this.selectChange(file) }}
                            />
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button disabled={!this.state.selectedFile || isTopView(this.state.selectedFile)} onClick={() => { this.confirm() }}>{__('确定')}</Panel.Button>
                        <Panel.Button onClick={() => { this.cancelAllCopies() }}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>)
    }
    getExceptionTemplate() {

        return (
            <ExceptionStrategy
                exception={this.state.exception}
                doc={this.state.processingDoc}
                handlers={this.handlers}
                strategies={this.strategies}
                onConfirm={this.handleExceptionConfirm.bind(this)}
                onCancel={() => this.cancelAllCopies()}
            />
        )
    }
}

