import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import { isTopView } from '../../core/entrydoc/entrydoc';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop'
import DocTree from '../DocTree/component.desktop';
import ExceptionStrategy from '../ExceptionStrategy/component.desktop'
import { SelectType } from '../DocTree/component.base'
import DirLockedWarning from './DirLockedWarning/component.desktop'
import MoveBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Move extends MoveBase {
    render() {
        const { showCopyToDialog, exception, processingDoc, showLoading, lockedDir } = this.state;
        return (
            <div>
                {
                    showLoading ?
                        <ProgressCircle detail={__('正在移动，请稍候...')} />
                        : null
                }
                {
                    showCopyToDialog ?
                        <Dialog
                            title={__('移动到')}
                            width={460}
                            onClose={() => this.props.onCancel()}
                        >
                            <Panel>
                                <Panel.Main>
                                    <div className={styles['tree-box']}>
                                        <DocTree
                                            {...this.props}
                                            selectType={[SelectType.DIR]}
                                            selectRange={this.props.selectRange}
                                            onSelectionChange={(selection) => this.setState({ selection })}
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
                            onCancel={() => this.cancelAllMovies()}
                        />
                        : null
                }
                {
                    lockedDir ?
                        <DirLockedWarning
                            doc={lockedDir}
                            docs={this.props.docs}
                            onCancel={this.cancelMoveLockedDir.bind(this)}
                            onConfirm={this.continueMoveLockedDir.bind(this)}
                            onChange={checked => this.skipLockedDirConflictChecked = checked}
                        />
                        : null
                }
            </div>
        )
    }
}