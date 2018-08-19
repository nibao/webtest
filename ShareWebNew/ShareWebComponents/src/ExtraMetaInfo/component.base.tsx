/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { cloneDeep, map, assign } from 'lodash';
import { getFileCustomAttribute, setFileCustomAttribute } from '../../core/apis/efshttp/file/file';
import { isDir } from '../../core/docs/docs';
import { check } from '../../core/apis/eachttp/perm/perm';
import { isExist, isEmpty } from '../../util/accessor/accessor';
import WebComponent from '../webcomponent';
import { AttrType } from './helper';
import __ from './locale';

export default class ExtraMetaInfoBase extends WebComponent<Components.ExtraMetaInfo.Props, any> implements Components.ExtraMetaInfo.Base {
    static defaultProps = {
        doc: {},

        userid: ''
    }

    state = {
        attrs: [],

        displayedAttrs: [],

        showEditDialog: false,

        showEditBtn: false,

        errorMsg: ''
    }


    componentDidMount() {
        this.getFileCustomAttribute(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.doc.docid !== this.props.doc.docid) {
            this.getFileCustomAttribute(newProps);
        }
    }

    /**
     * 获取文件属性列表
     */
    getFileCustomAttribute(props) {
        if (!isDir(props.doc)) {
            // 判断文件有无修改权限，有编辑按钮显示，没有不显示
            check({
                docid: props.doc.docid,
                userid: props.userid,
                perm: 16
            }).then(perms => {
                if (!perms.result) {
                    this.setState({ showEditBtn: true })
                } else {
                    this.setState({ showEditBtn: false })
                }
            });

            getFileCustomAttribute({ docid: props.doc.docid }).then((attrInfos) => {
                this.setState({ displayedAttrs: attrInfos });
            });
        }
    }

    /**
     * 显示编辑页面
     */
    showEditDialog() {
        this.resetEdit();
        this.setState({
            showEditDialog: true
        })
    }

    /**
     * 重置编辑数据
     */
    resetEdit() {
        this.setState({
            attrs: cloneDeep(this.state.displayedAttrs)
        })
    }

    /**
     * 关闭编辑面板
     */
    closeEditDialog() {
        this.setState({
            showEditDialog: false
        })
    }

    /**
     * 输入框修改数字类型
     */
    setNumber(id, number) {
        this.updateValue(id, number);
    }

    /**
     * 输入框修改文本类型
     */
    setText(id, text = '') {
        this.updateValue(id, text);
    }

    /**
     * 输入框修改枚举类型
     */
    setEnum(id, value) {
        this.updateValue(id, value);
    }

    /**
     * 初始化枚举框
     */
    loadEnum(attr, value) {
        if (attr.value && attr.value.length) {
            this.updateValue(attr.id, value);
        }
    }

    /**
     * 输入框修改层级类型
     */
    setLevel(id, value) {
        this.updateValue(id, map(value, val => val.id));
    }

    /**
     * 设置时间
     */
    setTime(id, value) {
        this.updateValue(id, value);
    }

    /**
     * 文本域数字
     */
    validateText(input) {
        return input.length <= 140;
    }
    /**
     * 设置数值属性
     * js Number类型数值大于9007199254740992时会出现精度问题
     * 需要限制一下数值大小小于该16位数字，此处设计只希望做长度限制，故限制长度为15位
     */
    validateNumer(input) {
        return (/^[\-]?[0-9]+(\.[0-9])?$/.test(String(input)) && input.length <= 15);
    }

    /**
     * 更新文本域数据
     */
    updateValue(id, value) {
        let newAttrs = map(this.state.attrs, attr => {
            if (id === attr.id) {
                switch (attr.type) {
                    case AttrType.LEVEL:
                        // 枚举和层级获取到的是字符串数组，而保存需要使用id数组，因此不能直接写回value
                        // 层级设为空值时，attr.value 值为 [undefined]
                        return assign({}, attr, { values: isEmpty(value) || !isExist(value[0]) ? null : value });

                    case AttrType.ENUM:
                        // 枚举和层级获取到的是字符串数组，而保存需要使用id数组，因此不能直接写回value
                        return assign({}, attr, { option: value, value: [] });

                    case AttrType.NUMBER:
                        // 枚举设为空值时，attr.value 值为 null
                        return assign({}, attr, { value: value === '' ? null : value });

                    case AttrType.TEXT:
                        // 枚举设为空值时，attr.value 值为 null
                        return assign({}, attr, { value: value === '' ? null : value });

                    case AttrType.TIME:
                        // 枚举设为空值时，attr.value 值为 null
                        return assign({}, attr, { value: value === 0 ? null : value });

                    default:
                        return assign({}, attr, { value: value });
                }
            } else {
                return attr;
            }
        });

        this.setState({ attrs: newAttrs });
    }
    /**
     * 保存数据
     */
    saveAttrs() {
        let attribute = this.state.attrs.map(attr => {
            switch (attr.type) {
                case AttrType.ENUM:
                    return {
                        id: attr.id,
                        value: attr.option ? attr.option.id : null
                    }
                case AttrType.LEVEL:
                    return {
                        id: attr.id,
                        value: attr.values
                    }
                case AttrType.NUMBER:
                    return {
                        id: attr.id,
                        value: Number(attr.value)
                    }
                default:
                    return {
                        id: attr.id,
                        value: attr.value
                    }
            }
        }).filter(attr => isExist(attr));

        setFileCustomAttribute({
            docid: this.props.doc.docid,
            attribute
        }).then(() => {
            this.closeEditDialog();
            this.getFileCustomAttribute(this.props);
        }, xhr => {
            this.setState({
                errorMsg: xhr.errmsg
            })
        });
    }

    /**
     * 重置错误信息
     */
    resetError() {
        this.setState({
            errorMsg: ''
        });
    }
}