/// <reference path="./component.base.d.ts" />
import * as React from 'react';
import { includes } from 'lodash'
import { isDir } from '../../core/docs/docs';
import { isTopView } from '../../core/entrydoc/entrydoc';
import { SelectType } from '../DocTree/component.base'
import WebComponent from '../webcomponent';
import { noop } from 'lodash';

export default class DocSelectorBase extends WebComponent<Components.DocSelector.Props, any> {
    static defaultProps = {
        onSelect: noop,

        selectMode: 'single',    // 选择模式: 'single'--单选, 'multi'--多选, 'cascade'--级联

        selectType: [SelectType.FILE],  // 选择类型，文件和文件夹的选择控制

        onCancel: noop,
    }

    state = {
        selection: null || []
    }

    onSelectionChange(doc: Object | Array<Object>) {
        this.setState({ selection: doc })
    }

    confirm() {
        this.props.onSelect(this.state.selection);
    }

    /**
     * “确定”按钮是否可用
     * （1）数组，当数组里有元素时，按钮可用
     * （2）一个文件，当文件不是topview，不是文件夹时，按钮可用
     */
    getBtnDisabled(selection: Object | Array<Object>) {
        const { selectType } = this.props
        if (selection instanceof Array) {
            // 数组
            return !selection.length
        } else {
            // 对象
            return !selection || isTopView(selection) ||
                isDir(selection) && !includes(selectType, SelectType.DIR) ||
                !(isDir(selection)) && !includes(selectType, SelectType.FILE)
        }
    }
}