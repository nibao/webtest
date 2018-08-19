import * as React from 'react';
import WebComponent from '../../webcomponent';

export default class StrategyModeDialogBase extends WebComponent<Console.StoragePoolManager.StrategyModeDialog.Props, Console.StoragePoolManager.StrategyModeDialog.State>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        /**
         * 选择的系统存储策略
         * {
         *      name: 策略名称
         *      mode: 策略值
         * }
         */
        selectedMode: this.props.currentMode,

    }

    /**
     * 选择系统存储策略
     */
    protected async handleSelectStorageStrategyMenu(item) {
        this.setState({
            selectedMode: item
        })
    }

}