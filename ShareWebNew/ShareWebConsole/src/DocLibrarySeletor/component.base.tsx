import * as React from 'react';
import { noop } from 'lodash';
import {  ShareMgnt } from '../../core/thrift/thrift';
import WebComponent from '../webcomponent';

export default class DocLibrarySeletorBase extends WebComponent<Console.DocLibrarySeletor.Props, Console.DocLibrarySeletor.State>{
    
    static defaultProps = {      
        onConfirmSelectDocLib: noop,

        onCancelSelectDocLib: noop
    }

    state = {
        selected: []
    }

    /**
     * 选中节点
     */
    protected handleSelectDoc(docLib) {
        this.setState({
            selected: [docLib]
        })
    }

    /**
     * 确定
     */
    protected handleConfirm() {
        this.props.onConfirmSelectDocLib(this.state.selected);
    }

    /**
     * 取消
     */
    protected handleCancel() {
        this.props.onCancelSelectDocLib();
    }
}