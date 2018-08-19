import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import DocTree from '../DocTree/component.desktop';
import { isTopView } from '../../core/entrydoc/entrydoc';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop'
import ExceptionStrategy from '../ExceptionStrategy/component.desktop'
import { SelectType } from '../DocTree/component.base'
import CopyBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Copy extends CopyBase {
    render() {
        const { showCopyToDialog, exception, processingDoc, showLoading } = this.state;
        return (
            <div>
                {
                    showLoading ?
                        <ProgressCircle detail={__('正在复制，请稍候...')} />
                        : null
                }
                {
                    showCopyToDialog ?
                        <Dialog
                            title={this.props.title || __('复制到')}
                            width={460}
                            onClose={() => this.props.onCancel()}
                        >
                            <Panel>
                                <Panel.Main>
                                    <div className={styles['tree-box']}>
                                        <DocTree
                                            {...this.props}
                                            selectType={[SelectType.DIR]}
                                            onSelectionChange={(selection) => this.setState({ selection })}
                                            selectRange={this.props.selectRange}
                                        />
                                    </div>
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button
                                        type="submit"
                                        disabled={!this.state.selection || isTopView(this.state.selection)}
                                        onClick={this.confirm.bind(this)}
                                    >
                                        {__('确定')}
                                    </Panel.Button>
                                    <Panel.Button onClick={() => this.props.onCancel()}>
                                        {__('取消')}
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        : null
                }
                {
                    exception ?
                        <ExceptionStrategy
                            exception={exception}
                            doc={processingDoc}
                            handlers={this.handlers}
                            strategies={this.strategies}
                            onConfirm={this.handleExceptionConfirm.bind(this)}
                            onCancel={() => this.cancelAllCopies()}
                        />
                        : null
                }
            </div>
        )
    }
}