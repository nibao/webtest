import * as React from 'react';
import * as _ from 'lodash';
import WebComponent from '../webcomponent';
import { OperationType } from './helper';
import { get } from '../../core/apis/eachttp/managedoc/managedoc';
import { list, getRetentionDays } from '../../core/apis/efshttp/recycle/recycle';

export default class RecycleBase extends WebComponent<Components.Recycle.Props, Components.Recycle.State> {
    static defaultProps = {

    }

    state = {
        isEntry: true,
        entryDocs: [],
        listDocs: [],
        entrySelections: [],
        listSelections: [],
        operationObj: {
            docs: [],
            type: OperationType.NOOP
        },
        isLoading: true,
        duration: -1,
        servertime: 0,
    }
    /**
     * 入口文档条件变更
     */
    protected handleIsEntry(isEntry) {
        this.setState({
            isEntry
        })
    }

    /**
     * 点击操作按钮
     */
    protected async handleClickOperationBtn(operationObj) {
        this.setState({
            operationObj
        })
    }

    /**
     * 完成查看大小后的回调函数
     */
    protected handleCompleteViewSize(docs) {
        // 往选中的回收站文件对象中添加_size属性
        // 如果是在回收站内 && 非选中任何文档下点击的查看大小，则不需要进行任何操作
        if (!this.state.isEntry && this.state.listSelections.length === 0) {
            return;
        }
        let newDocs = this.state.isEntry ? _.clone(this.state.entryDocs) : _.clone(this.state.listDocs);
        docs.map((doc) => {
            let index = _.findIndex(newDocs, (entrydoc) => {
                return entrydoc['docid'] === doc['docid']
            });
            newDocs.splice(index, 1, doc);

        });
        // 由于更新文档对象后，selection选中的文档对象已经不相同，也需要更新

        this.state.isEntry ?
            this.setState({
                entryDocs: newDocs,
                entrySelections: docs
            })
            :
            this.setState({
                listDocs: newDocs,
                listSelections: docs
            });
    }

    /**
     * 删除或还原单个文件成功，从列表中移除成功的文件
     */
    protected handleSingleOperationSuccess(item) {
        // 每删除一个成功就从state中删除一个
        let newListDocs = [...this.state.listDocs];
        let newListSelectDocs = [...this.state.listSelections];


        let index = _.findIndex(newListDocs, (listdoc) => {
            return listdoc['docid'] === item['docid']
        });

        let selectindex = _.findIndex(newListSelectDocs, (listdoc) => {
            return listdoc['docid'] === item['docid']
        });

        newListDocs.splice(index, 1);
        newListSelectDocs.splice(selectindex, 1);
        this.setState({
            listDocs: newListDocs,
            listSelections: newListSelectDocs
        })
    }

    /**
     * 确认或者关闭 还原、清空、删除、查看大小对话框
     * shouldRefresh: 是否需要刷新
     * goToEntry: 是否返回目录
     */
    protected handleCloseOperationDialog(shouldRefresh?, goToEntry?) {
        this.setState({
            operationObj: {
                docs: [],
                type: OperationType.NOOP
            }
        }, () => {
            shouldRefresh ?
                this.refs.recycle.handleRefresh(goToEntry)
                :
                null
        })
    }

    /**
     * 入口文档选中项发生变化
     */
    protected handleEntrySelectionChange(selection) {
        this.setState({
            entrySelections: selection
        })
    }

    /**
     * 文档选中项发生变化
     */
    protected handleListSelectionChange(selection) {
        this.setState({
            listSelections: selection
        })
    }

    /**
     * 入口文档对象发生变化
     */
    protected handleEntryDocsChange(docs) {
        this.setState({
            entryDocs: docs
        })

    }

    /**
     * 文档对象发生变化
     */
    protected handleListDocsChange(docs) {
        this.setState({
            listDocs: docs
        })
    }

    /**
    * 路径变化
    */
    handlePathChange(doc, sort, by, { newTab = false } = {}) {
        if (typeof this.props.onPathChange === 'function') {
            this.props.onPathChange(doc, sort, by, { newTab })
        }
    }




}