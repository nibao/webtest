///<reference path="./component.base.d.ts" />

import * as React from 'react';
import WebComponent from '../webcomponent'
import { noop } from 'lodash';
import { login, OS_TYPE } from '../../core/auth/auth';
import { AuthorizeStatus } from './helper';

export default class AuthorizeBase extends WebComponent<Components.Authorize.Props, any> {

    static defaultProps = {

        onAuthorizeSuccess: noop,

        onModifyPassword: noop,

        onCancelModifyPwd: noop

    }

    state: Components.Authorize.State = {
        pwdInvalidErrcode: 0,

        authorizeError: null
    }

    async componentWillMount() {
        this.authorize();
    }

    async authorize() {
        try {
            const accountInfo = await login(this.props.account, this.props.password, OS_TYPE.WEB);
            this.props.onAuthorizeSuccess(accountInfo);
        } catch (ex) {
            if (ex.errcode) {
                switch (ex.errcode) {
                    case AuthorizeStatus.EXPIRED_PASSWORD:
                    case AuthorizeStatus.LOW_PASSWORD:
                    case AuthorizeStatus.ORGIN_PASSWORD:

                        this.setState({
                            pwdInvalidErrcode: ex.errcode
                        })
                        break
                    default:
                        this.setState({
                            authorizeError: ex
                        });
                        setTimeout(() => {
                            this.setState({
                                authorizeError: null
                            });
                        }, 3000)
                        break
                }
            } else {
                this.setState({
                    authorizeError: ex
                });
                setTimeout(() => {
                    this.setState({
                        authorizeError: null
                    });
                }, 3000)
            }
        }

    }

    handleModifyPassword() {
        this.props.onModifyPassword(this.props.account);
    }

    handleCancelModifyPassword() {
        this.props.onCancelModifyPwd();
    }

}