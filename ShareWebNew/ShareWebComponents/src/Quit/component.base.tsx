/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { quit, getByType } from '../../core/apis/eachttp/entrydoc/entrydoc';
import WebComponent from '../webcomponent';
import __ from './locale';
import { DocType } from './helper';

export default class QuitBase extends WebComponent<Components.Quit.Props, any> implements Components.Quit.Base {
    static defaultProps = {
        onCloseDialog: noop,
        onCancel: noop,
        onSuccess: noop,
        onSingleSuccess: noop,
        onError: noop,
        docs: [],
        docType: DocType.USERDOC
    }

    state = {
        start: false
    }

    /**
     * 确认屏蔽
     */
    confirm() {
        this.setState({
            start: true
        })
    }

    /**
     * 队列操作
     */
    getLoader({ docid }) {
        return quit({
            docid
        })
    }

    /**
     * 进度条显示的文字详情
     * @param item 正在进行中的文档对象
     */
    getDetailTemplate({ docname }) {
        return __('正在屏蔽共享：') + docname;
    }

}