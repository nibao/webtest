import * as React from 'react';
import { forEach } from 'lodash';
import { convertPath } from '../../core/apis/efshttp/file/file';
import WebComponent from '../webcomponent';

interface Props {
    // 外部传入的未定密文件对象
    files: Array<any>;
    // 密级可选项
    csfOptions: Array<string>;

}

interface State {
    // 列表选中项
    selections: Array<any>;
    // 批量选择的密级
    csflevel: number;

}

export default class UploadSetCSFBase extends WebComponent<any, any> {

    static defaultProps: Props = {
        files: [],
        csfOptions: []
    };

    state = {
        selections: [],
        csflevel: 0
    }

    /**
     * 设置某个文件的密级
     * @param csflevel 
     * @param file 
     */
    setCSF(csflevel: number, file: any) {
        file.csflevel = csflevel;
        this.forceUpdate();
    }

    /**
     * 批量设置文件密级
     * @param csflevel 
     */
    bulkSetCSF(csflevel: number) {
        if (this.state.selections) {
            this.state.selections.forEach(file => {
                file.csflevel = csflevel;
            });
        }
        this.setState({ csflevel });
    }

    stopProagate(e) {
        e.stopPropagation();
    }

    /**
     * 改变当前选中项
     * @param selections 
     */
    handleSelectionChange(selections: Array<any>) {
        // 选中项
        this.setState({ selections });
    }

    /**
     * 保存文件密级
     */
    saveFilesCSF() {
        this.props.onCSFinished();
    }

    /**
     * 取消设置密级
     */
    CancelSetCSF() {
        this.props.onCancelSetCSF();
    }

}