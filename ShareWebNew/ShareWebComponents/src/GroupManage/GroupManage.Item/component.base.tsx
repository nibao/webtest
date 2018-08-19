
/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { trimLeft, trimRight } from 'lodash';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import { transformBytes, formatSize } from '../../../util/formatters/formatters';
import { ValidateState } from './helper';

export default class GrounpItemBase extends React.Component<Components.GroupManageItem.Props, any> implements Components.GroupManageItem.Base {

    static defaultProps = {
        data: {}
    }

    state = {
        quotaTip: ValidateState.Normal,
        nameTip: ValidateState.Normal
    }

    componentWillMount() {
        const { docname, used, quota, docid } = this.props.data;
        const [quotaToGB] = transformBytes(quota, { minUnit: 'GB' });

        this.setState({
            docname,
            used,
            quota: quotaToGB ? quotaToGB.toFixed(2) : undefined,
            docid
        })
    }

    componentWillReceiveProps(newProps) {
        const { data } = newProps;

        if (data !== this.props.data && data.docid !== 'create') {
            const { docname, used, quota, docid } = data;
            const [quotaToGB] = transformBytes(quota, { minUnit: 'GB' });

            this.setState({
                docname,
                used,
                quota: quotaToGB ? quotaToGB.toFixed(2) : undefined,
                docid,
                editDisabled: false
            })
        }
    }

    /**
     * 点击编辑按钮，打开编辑状态
     */
    handleEdit(id, index) {
        const { docname, quota } = this.state;
        this.docname = docname;
        this.quota = quota;
        this.props.onEdit(id, index);
    }

    /**
     * 取消编辑
     */
    handleCancle() {
        this.setState({
            docname: this.docname,
            quota: this.quota,
            nameTip: ValidateState.Normal,
            quotaTip: ValidateState.MaxSize
        })
        this.props.onCancle();
    }

    /**
     * 聚焦群组名称编辑框，重置气泡状态
     */
    handleFocusName() {
        this.setState({
            nameTip: ValidateState.Normal
        })
    }

    /**
     * 聚焦配额编辑框，显示最大可分配空间气泡
     */
    handleFocusQuota() {
        if (this.state.quota && this.state.quota * Math.pow(1024, 3) < this.props.maxSize) {
            this.setState({
                quotaTip: ValidateState.Normal
            })
        } else {
            this.setState({
                quotaTip: ValidateState.MaxSize
            })
        }

    }

    /**
     * 失焦配额编辑框，隐藏最大可分配空间气泡
     */
    handleBlurQuota() {
        this.setState({
            quotaTip: ValidateState.Normal
        })
    }

    /**
     * 输入框change事件
     */
    handleChange(value, key) {
        if (key === 'docname') {
            this.setState({
                nameTip: ValidateState.Normal,
                [key]: value,
                editDisabled: false
            })
        } else {
            if (value && value * Math.pow(1024, 3) <= this.props.maxSize) {
                this.setState({
                    quotaTip: ValidateState.Normal,
                    [key]: value,
                    editDisabled: false
                })
            } else {
                if (this.state.quota !== undefined) {
                    this.setState({
                        quotaTip: ValidateState.MaxSize,
                        [key]: value,
                        editDisabled: false
                    })
                }
            }

        }
    }

    /**
     * 验证配额输入是否合法
     */
    checkquota(value) {
        return /^[0-9]*(\.[0-9]{0,2})?$/.test(value);
    }

    /**
     * 编辑保存
     */
    handleSave() {

        const { docname, quota, docid, used } = this.state;
        let nameTip = ValidateState.Normal;
        let quotaTip = ValidateState.Normal;
        /**
         * 验证用户名
         */
        switch (true) {
            case !docname:
                nameTip = ValidateState.Empty
                break;
            case /[\\/:*?"<>|]/.test(docname):
                nameTip = ValidateState.FormError
                break;
        }

        /**
         * 验证空间大小
         */
        switch (true) {
            case !quota:
                quotaTip = ValidateState.Empty
                break;

            case Number(quota) > 1000000 || Number(quota) === 0:
                quotaTip = ValidateState.LimitError
                break;

            case Number((quota * Math.pow(1024, 3)).toFixed(2)) < used:
                this.props.onError(ErrorCode.SmallQuota, { used: formatSize(used) });
                return;

            case Number((quota * Math.pow(1024, 3)).toFixed(2)) > this.props.maxSize:
                this.props.onError(ErrorCode.QuotaExhausted);
                return;
        }
        if (nameTip === ValidateState.Normal && quotaTip === ValidateState.Normal) {
            const info = {
                docid,
                name: trimLeft(trimRight(docname, [' ', '.'])), // 去除前后的空格和末尾的.号
                quota: parseInt((quota * Math.pow(1024, 3)).toFixed(2))
            }
            this.setState({
                editDisabled: true
            }, () => this.props.onSave(info))
        } else {
            this.setState({
                nameTip,
                quotaTip
            })
        }

    }
}