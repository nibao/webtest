import * as React from 'react';
import WebComponent from '../webcomponent'

export default class StorageModelBase extends WebComponent<any, any>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
         * 存储模式选择
         */
        storageModelSelection: this.props.storageModelSelection,

        /**
         * 是否显示警告提示框
         */
        showWarningDialog: false

    }
    
    /**
     * 选择存储模式
     */
    protected handleSelectStorageModel(checked, value) {
        this.setState({
            storageModelSelection: value
        })
    }

    /**
     * 确定选择存储模式，弹出警告提示框，二次确定
     */
    protected handleModeConfirm() {
        this.setState({
            showWarningDialog: true
        })
    }

    /**
     * 取消选择存储模式，回退到之前的操作页面
     */
    protected handleModeCancel() {
        this.props.onSelectionCancel();
    }

    /**
     * 二次确定选择存储模式，根据不同选择，进入不同视图页面
     */
    protected handleConfirmConfirmDialog() {
        this.props.onSelectionConfirm(this.state.storageModelSelection);
    }

    /** 
     * 取消选择存储模式，回到选择页面
     */
    protected handleCancelConfirmDialog() {
        this.setState({
            showWarningDialog: false
        })
    }


}