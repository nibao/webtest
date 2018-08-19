import * as React from 'react';
import WebComponent from '../../webcomponent';

export default class CustomSelectMenuBase extends WebComponent<Console.StoragePoolManager.CustomSelectMenu.Props, Console.StoragePoolManager.CustomSelectMenu.State> {

    state = {
        /**
         * 菜单锚点
         */
        selectMenuAnchor: {},

        /**
         * 是否显示下拉菜单项
         */
        showSelectMenu: false,

        /**
         * 菜单选中项
         * {
         *      name: 显示名称 string
         *      content: 具体值 any
         * }
         */
        selectValue: this.props.defaultSelectedValue ? this.props.defaultSelectedValue : this.props.candidateItems[0],

        /**
         * 点击状态,用于点击后出现高亮背景
         */
        clickStatus: false
    }

    /**
     * 点击范围菜单按钮
     */
    protected handleClickSelectMenuBtn(e) {
        this.setState({
            showSelectMenu: !this.state.showSelectMenu,
            selectMenuAnchor: e.currentTarget,
            clickStatus: !this.state.clickStatus
        })
    }

    /**
     * 选择候选菜单项
     */
    protected handleClickCandidateItem(e, item) {
        this.setState({
            selectValue: item,
            showSelectMenu: false
        }, () => {
            this.props.onSelect(item);
        })
    }


}