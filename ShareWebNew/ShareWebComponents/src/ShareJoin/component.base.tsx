///<reference path="./component.base.d.ts" />

import * as React from 'react';
import WebComponent from '../webcomponent';
import __ from './locale';
import { get } from '../../core/apis/eachttp/invitation/invitation';
import { formatTime } from '../../util/formatters/formatters';
import { buildSelectionText, splitPerm, SharePermissionOptions } from '../../core/permission/permission';
import { getHostInfo } from '../../core/apis/eachttp/redirect/redirect';
import { getConfig } from '../../core/config/config';
import { ReqStatus } from './helper';

export default class ShareJoinBase extends WebComponent<Components.ShareJoin.Props, any> implements Components.ShareJoin.Base {
    static defaultProps = {
        invitationid: ''
    }
    state = {
        // 邀请链接有效期
        invitationendtime: '',
        // 权限
        perm: '',
        // 权限有效期
        permendtime: '',
        // 显示提示
        message: false,
        // 图片
        image: '',
        // 备注
        description: '',
        // 文件名
        docname: '',
        // 请求错误
        reqStatus: ReqStatus.PENDING
    }

    componentDidMount() {
        this.getInvitationInfos();
    }
    /**
     * 获取详细信息
     */
    getInvitationInfos() {
        get({ invitationid: this.props.invitationid }).then(({ invitationendtime, permendtime, docname, description, image, isdir, perm }) => {
            this.setState({
                invitationendtime: invitationendtime === -1 ? __('永久有效') : formatTime(invitationendtime / 1000, 'yyyy-MM-dd'),
                permendtime: permendtime === -1 ? __('永久有效') : formatTime(permendtime / 1000, 'yyyy-MM-dd'),
                docname: docname,
                description: description,
                image: image,
                isdir: isdir,
                reqStatus: ReqStatus.OK,
                perm: buildSelectionText(SharePermissionOptions, { allow: perm })
            })
        }, xhr => {
            this.setState({
                reqStatus: xhr.errcode
            })

        })
    }

    /**
     * 点击确定跳转
     */
    groupJoin() {
        Promise.all([getConfig('https'), getHostInfo(null)]).then(([https, { host, port, https_port }]) => {
            this.setState({
                message: false
            })
            location.replace(`${https ? 'https' : 'http'}://${host}:${https ? https_port : port}/#/?invitation=${this.props.invitationid}`);
        })
    }

    /**
     * 点击立即加入
     */
    joinNow() {
        this.setState({
            message: true
        })
    }
}