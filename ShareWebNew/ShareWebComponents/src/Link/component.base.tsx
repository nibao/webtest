/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { assign, noop } from 'lodash';
import { Status } from './helper';
import { get as getLink } from '../../core/apis/efshttp/link/link';

export default class LinkBase extends React.Component<Components.Link.Props, any> implements Components.Link.Base {
    static defaultProps = {
        onVerify: noop
    }

    state = {
        password: '',

        passwordTried: false,

        errorType: Status.OK
    }

    componentDidMount() {
        this.verify(this.props.link);
    }

    verify({ link, password, docid }) {
        // 密码不为空，再次调用空密码
        if (this.state.passwordTried && password === '') {
            this.setState({
                errorType: Status.NO_PASSWORD
            })
        } else {
            getLink({ link, password, docid }).then(info => {
                this.props.onVerify(assign({}, { link, password, docid }, info));
                this.setState({
                    status: Status.OK
                });
            }, err => {
                if (this.state.passwordTried && err.errcode === 401002) {
                    this.setState({
                        errorType: err.errcode
                    })
                } else {
                    if (err.errcode === 401002) {
                        this.setState({
                            passwordTried: true,
                            status: Status.NEED_PASSWORD
                        })
                    } else {
                        this.setState({
                            errorType: err.errcode,
                            passwordTried: false,
                            status: err.errcode
                        })
                    }
                }
            })
        }

    }

    updatePassword(password) {
        this.setState({
            password
        })
    }

    verifyPassword(password) {
        this.verify(assign(this.props.link, { password }))
    }
}