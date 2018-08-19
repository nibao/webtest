import * as React from 'react';
import RecycleBase from './component.base';
import RecycleBin from './RecycleBin/component.desktop';
import RecycleDeleter from './RecycleDeleter/component.client';
import RecycleEmpty from './RecycleEmpty/component.client';
import RecycleRestore from './RecycleRestore/component.client';
import RecycleDeleteStrategy from './RecycleDeleteStrategy/component.client';
import Dialog from '../../ui/Dialog2/ui.client';
import NWWindow from '../../ui/NWWindow/ui.client';
import Panel from '../../ui/Panel/ui.desktop';
import ViewSize from '../ViewSize/component.client';
import { ClientComponentContext } from '../helper';
import { OperationType } from './helper';
import __ from './locale';
export default class Recycle extends RecycleBase {

    render() {
        const { onOpenRecycleDialog, onCloseDialog, fields, id } = this.props
        let { isEntry, operationObj, listDocs, listSelections, entryDocs, entrySelections } = this.state;
        return (
            <NWWindow
                width={1100}
                height={650}
                id={id}
                title={__('回收站')}
                onOpen={onOpenRecycleDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <Dialog
                        title={__('回收站')}
                        width={1100}
                        onClose={this.props.onCloseDialog}
                    >
                        <Panel>
                            <RecycleBin
                                isClient={true}
                                operationObj={operationObj}
                                listDocs={listDocs}
                                listSelections={listSelections}
                                entryDocs={entryDocs}
                                entrySelections={entrySelections}
                                historyDoc={this.props.doc}
                                historySort={{ sort: this.props.sort, by: this.props.by }}
                                handleClickOperationBtn={this.handleClickOperationBtn.bind(this)}
                                handleEntrySelectionChange={this.handleEntrySelectionChange.bind(this)}
                                handleListSelectionChange={this.handleListSelectionChange.bind(this)}
                                handleListDocsChange={this.handleListDocsChange.bind(this)}
                                handleEntryDocsChange={this.handleEntryDocsChange.bind(this)}
                                handleIsEntry={this.handleIsEntry.bind(this)}
                                handlePathChange={this.handlePathChange.bind(this)}
                                ref="recycle"

                            />
                            {this.renderRecycleDialog(operationObj, isEntry)}
                        </Panel>
                    </Dialog>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )

    }

    renderRecycleDialog(operationObj, isEntry) {
        switch (operationObj.type) {
            case OperationType.NOOP:
                return;
            case OperationType.DELETE:
                return (
                    <RecycleDeleter
                        docs={operationObj.docs}
                        onSingleSuccess={(item) => { this.handleSingleOperationSuccess(item); }}
                        onSuccess={() => { this.handleCloseOperationDialog(); }}
                        onCancel={() => { this.handleCloseOperationDialog(true, false); }}
                    >
                    </RecycleDeleter>
                )
            case OperationType.EMPTY:
                return (
                    <RecycleEmpty
                        doc={operationObj.docs[0]}
                        onSingleSuccess={(item) => { this.handleSingleOperationSuccess(item); }}
                        onSuccess={() => { this.handleCloseOperationDialog(true); }}
                        onCancel={(goToEntry) => { this.handleCloseOperationDialog(true, goToEntry); }}
                    >

                    </RecycleEmpty >
                )
            case OperationType.RESTORE:
                return (
                    <RecycleRestore
                        docs={operationObj.docs}
                        onSingleSuccess={(item) => { this.handleSingleOperationSuccess(item); }}
                        onSuccess={() => { this.handleCloseOperationDialog(); }}
                        onCancel={() => { this.handleCloseOperationDialog(true, false); }}
                    >
                    </RecycleRestore>
                )
            case OperationType.STORATEGY:
                return (
                    <RecycleDeleteStrategy
                        docs={operationObj.docs}
                        isEntry={isEntry}
                        onStrategyClose={(goToEntry) => { this.handleCloseOperationDialog(true, goToEntry); }}
                    />
                )
            case OperationType.VIEWSIZE:
                return (
                    <ViewSize
                        docs={operationObj.docs}
                        onlyrecycle={true}
                        onStatisticsCompleted={(docs) => { this.handleCompleteViewSize(docs); }}
                        onStaticsConfirm={() => { this.handleCloseOperationDialog(); }}
                        onCloseDialog={() => { this.handleCloseOperationDialog(); }}
                        onStaticsCancel={(shouldRefresh, goToEntry) => { this.handleCloseOperationDialog(shouldRefresh, goToEntry); }}
                    />
                )
            default:
                return;
        }
    }
}