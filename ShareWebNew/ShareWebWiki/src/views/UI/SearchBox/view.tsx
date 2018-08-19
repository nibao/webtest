import * as React from 'react';
import UIView from '../../UI/view';
import SearchBox from '../../../../ui/SearchBox/ui.desktop';

export default function SearchBoxView() {
    return (
        <UIView
            name={ '<SearchBox />' }
            description={ '搜索组件' }
            api={
                [
                    {
                        name: 'className',
                        type: String,
                        required: false,
                        note: 'className'
                    },
                    {
                        name: 'style',
                        type: Object,
                        required: false,
                        note: 'style'
                    },
                    {
                        name: 'icon',
                        type: String,
                        required: false,
                        defaultValue: '\uf01e',
                        note: '图标，使用Unicode或者Base64'
                    },
                    {
                        name: 'value',
                        type: String,
                        required: false,
                        defaultValue: '',
                        note: '初始关键字'
                    },
                    {
                        name: 'disabled',
                        type: Boolean,
                        required: false,
                        defaultValue: false,
                        note: '是否禁用'
                    },
                    {
                        name: 'placeholder',
                        type: String,
                        required: false,
                        defaultValue: '',
                        note: '占位提示'
                    },
                    {
                        name: 'autoFocus',
                        type: Boolean,
                        required: false,
                        defaultValue: false,
                        note: '加载时是否要自动聚焦'
                    },
                    {
                        name: 'validator',
                        type: Function,
                        required: false,
                        defaultValue: () => true,
                        note: '验证输入合法性，返回false则不允许输入'
                    },
                    {
                        name: 'loader',
                        type: Function,
                        required: false,
                        note: '搜索函数'
                    },
                    {
                        name: 'onChange',
                        type: Function,
                        required: false,
                        note: '文本框发生变化时触发'
                    },
                    {
                        name: 'onFetch',
                        type: Function,
                        required: false,
                        note: '搜索开始时触发'
                    },
                    {
                        name: 'onLoad',
                        type: Function,
                        required: false,
                        note: '搜索完成时触发'
                    },
                    {
                        name: 'onClick',
                        type: Function,
                        required: false,
                        note: '点击时触发'
                    },
                    {
                        name: 'onFocus',
                        type: Function,
                        required: false,
                        note: '聚焦时时触发'
                    },
                    {
                        name: 'onBlur',
                        type: Function,
                        required: false,
                        note: '失去焦点时触发'
                    },
                    {
                        name: 'onEnter',
                        type: Function,
                        required: false,
                        note: '按下回车时触发'
                    },
                    {
                        name: 'onKeyDown',
                        type: Function,
                        required: false,
                        note: '键盘输入时触发'
                    },
                ]
            }>
            <SearchBox />
        </UIView>
    )
}