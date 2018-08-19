import * as React from 'react';
import WebComponent from '../webcomponent';
import session from '../../util/session/session';
import { get } from '../../core/apis/efshttp/link/link';
import { getOEMConfByOptions } from '../../core/oem/oem';

export enum ErrorType {
    // 正常状态
    NORMAL,

    // 没有密码
    NO_PASSWORD,

    // 获取外链成功
    SUCCESS
}

interface Props {
    // 外链接
    link: any;

    // 打开成功
    onSuccess: () => {};
}

interface State {
    // 外链密码
    password: string;

    // 错误状态
    errorType: ErrorType;

    // 是否需要密码
    existPassword: boolean;

    // 图片
    titleIcon: '';
}

export default class LinkPasswordBase extends WebComponent<any, any> {
    static defaultProps = {
        link: '',

        onSuccess: null
    }

    state: State = {
        password: '',

        errorType: ErrorType.NORMAL,

        existPassword: false,

        titleIcon: ''
    }

    componentDidMount() {
        // 初次尝试调用外链
        this.setLinkStatus();
        this.getLogo();
    }

    /**
     * 获取外链信息
     */
    getLinkInfo(): PromiseLike<any> {
        return get({ link: this.props.link, password: this.state.password, docid: '' })
    }

    /** 
     * 设置外链信息，触发成功或失败
     */
    setLinkStatus() {
        // 密码不为空，再次调用空密码
        if (this.state.existPassword && this.state.password === '') {
            this.setState({
                errorType: ErrorType.NO_PASSWORD
            })
            return;
        }

        this.getLinkInfo().then((linkInfo) => {
            this.props.onSuccess( {...linkInfo, password: this.state.password });
            this.setState({
                errorType: ErrorType.SUCCESS
            })
        }, error => {
            if (this.state.existPassword && error.errcode === 401002) {
                this.setState({
                    errorType: error.errcode
                })
            } else {
                if (error.errcode === 401002) {
                    this.setState({
                        existPassword: true
                    })
                } else {
                    this.setState({
                        errorType: error.errcode,
                        existPassword: false
                    })
                }
            }

        })

    }

    getPassword(password: string) {
        this.setState({
            password: password
        })
    }

    getLogo() {
        getOEMConfByOptions('logo.png').then((res) => {
            this.setState({
                titleIcon: 'data:image/png;base64,' + res['logo.png']
            })
        });
    }

}