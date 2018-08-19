///<reference path="./component.base.d.ts" />

import * as React from 'react';
import { keys, noop, reduce } from 'lodash';
import WebComponent from '../webcomponent';
import { redirect, loginByParams, OS_TYPE } from '../../core/auth/auth';

// 单点登录状态
export enum Status {
    PENDING, // 登录中

    OK // 鉴权正确
}

export default class SSOBase extends WebComponent<Components.SSO.Props, any> implements Components.SSO.Base {
    static defaultProps = {
        onAuthSuccess: noop,
        ostype: OS_TYPE.WEB
    }

    state = {
        status: Status.PENDING,
    }

    componentWillMount() {
        if (!keys(this.props.params).length) {
            redirect();
        } else {
            loginByParams(reduce(this.props.params, (result, value, key) => {
                if (key !== 'asplatform') {
                    return { ...result, [key]: value }
                } else {
                    return result
                }
            }, {}), this.props.ostype).then(res => {
                this.setState({ status: Status.OK });
                this.props.onAuthSuccess(res);
            }, error => {
                this.setState({ status: error });
            })
        }
    }
}   