import * as React from 'react';
import { EVFS } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import __ from './locale';

interface State {
    showModify: boolean;        // 是否显示修改按钮
    showSaveAndCancel: boolean; // 是否显示保存、取消按钮
    errorMessage: string;       // 错误信息
    value: number;
}

export default class DocTagConfigBase extends WebComponent<any, any> {
    state: State = {
        showModify: true,
        showSaveAndCancel: false,
        errorMessage: null,
        value: null
    }

    value: number;

    componentDidMount() {
        this.getTagNum()
    }

    componentWillReceiveProps(NextProps) {
        this.getTagNum()
    }

    /**
     * 获取允许的最大标签数
     */
    getTagNum(): void {
        EVFS('GetTagMaxNum').then(value => {
            this.setState({
                value
            }, () => this.value = value)
        })
    }

    /**
     * 切换修改和确定、取消按钮的显示
     * @param flag true: 显示“保存”和“取消”按钮；false：显示“修改”按钮
     */
    toggleModifyToSaveAndCancel(flag: boolean): void {
        this.setState({
            showModify: !flag,
            showSaveAndCancel: flag
        })
    }

    /**
     * 更新输入框中的标签数
     */
    updateMaxTags(value: string): void {
        this.setState({
            value: value ? parseInt(value) : '',
        })

        if (value && (parseInt(value) > 100 || parseInt(value) < 1)) {
            this.setState({
                errorMessage: __('请输入1~100之间的数值。')
            })
        } else {
            this.setState({
                errorMessage: null
            })
        }
    }

    /**
     * 设置最大标签数
     */
    saveMaxTags(): void {
        const { value } = this.state;
        if (!value || value > 100 || value < 1) {
            this.setState({
                errorMessage: __('请输入1~100之间的数值。'),
                value
            })
        } else {
            // 设置最大标签数
            EVFS('SetTagMaxNum', [value]).then(() => {
                this.setState({
                    errorMessage: null,
                    showModify: true,
                    showSaveAndCancel: false
                }, () => this.value = value)
                manageLog(ManagementOps.SET, __('设置“允许用户文件最多可添加${num}个标签” 成功', { num: value }), '', Level.INFO);
            })

        }
    }

    /**
     * 取消
     */
    cancel() {
        this.setState({
            value: this.value,
            errorMessage: null
        })
        this.toggleModifyToSaveAndCancel(false)
    }
}