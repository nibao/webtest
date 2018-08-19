import * as React from 'react';
import RecycleDeleter from './RecycleDeleter/component.desktop';
import RecycleEmpty from './RecycleEmpty/component.desktop';
import RecycleRestore from './RecycleRestore/component.desktop';
import RecycleDeleteStrategy from './RecycleDeleteStrategy/component.desktop';
import ViewSize from '../ViewSize/component.desktop';
import RecycleBase from './component.base';
import RecycleBin from './RecycleBin/component.desktop';
import { OperationType } from './helper';

export default class Recycle extends RecycleBase {

    render() {

        let { isEntry, operationObj, listDocs, listSelections, entryDocs, entrySelections } = this.state;
        return (
            <div>
                <RecycleBin
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
            </div>
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
                        onStaticsCancel={(shouldRefresh, goToEntry) => { this.handleCloseOperationDialog(shouldRefresh, goToEntry); }}
                    >

                    </ViewSize>
                )
            default:
                return;
        }
    }
}