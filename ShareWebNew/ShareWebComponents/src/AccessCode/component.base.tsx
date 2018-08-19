/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { buildLinkHref } from '../../core/linkconfig/linkconfig';
import { getLinkByAccessCode } from '../../core/apis/efshttp/link/link';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class AccessCodeBase extends WebComponent<Components.AccessCode.Props, any> implements Components.AccessCode.Base {

    static defaultProps = {
        onGetLink: noop
    }

    state = {
        code: '',
        codeError: false
    }

    // 校验提取码，允许数字及字母
    validateCode(input) {
        return /^[a-zA-Z0-9]{0,6}$/i.test(input);
    }

    // 输入提取码
    setCode(val) {
        this.setState({
            code: val
        })
    }

    async getLink(accesscode) {
        const { link } = await getLinkByAccessCode({ accesscode });

        if (link) {
            this.resetError();
            const fullLink = await buildLinkHref(link);
            this.props.onGetLink(fullLink);
        } else {
            this.setState({
                codeError: true
            });
        }
    }

    // 提取文件
    accessFile() {
        if (this.state.code !== '') {
            this.getLink(this.state.code);
        }
    }

    /**
     * 重置错误信息
     */
    resetError() {
        this.setState({
            codeError: false
        });
    }

}