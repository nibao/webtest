import * as React from 'react';
import { formatTime } from '../../util/formatters/formatters';
import { buildInvitationHref } from '../../core/invitationconfig/invitationconfig';
import { buildLinkHref } from '../../core/linkconfig/linkconfig';
import __ from './locale';

export default class CopyLinkBase extends React.Component<Components.CopyLink.Props, any> implements Components.CopyLink.Component {
    static defaultProps = {
        enableLinkAccessCode: false,
    }

    state = {
        copySuccess: false,

        text: '',

        clipboardData: '',
    }

    componentWillMount() {
        const { enableLinkAccessCode, link, accesscode, invitationid, endtime, password } = this.props;

        this.updateClipboard({ enableLinkAccessCode, link, accesscode, invitationid, endtime, password });
    }

    componentWillReceiveProps({ enableLinkAccessCode, link, accesscode, invitationid, endtime, password }) {
        if (endtime !== this.props.endtime || password !== this.props.password) {
            this.updateClipboard({ enableLinkAccessCode, link, accesscode, invitationid, endtime, password });
        }
    }

    /**
     * 更新剪贴板信息
     * @param param0.link 外链id
     * @param param0.endtime 有效期
     * @param param0.password 密码
     * @param param0.accesscode 提取码
     * @param param0.enableLinkAccessCode 是否启用提取码
     * @param param0.invitationid 共享邀请id
     */
    private async updateClipboard({ enableLinkAccessCode, accesscode, link, invitationid, endtime, password }: { enableLinkAccessCode?: boolean; link?: string; accesscode?: string; invitationid?: string; endtime?: number; password?: string; }): Promise<void> {
        if (link || (enableLinkAccessCode && accesscode)) {
            let address = enableLinkAccessCode ? accesscode : await buildLinkHref(link);
            let clipboardData = address;

            if (address) {
                if (endtime) {
                    clipboardData += `\n${__('有效期限：${endtime}', { endtime: formatTime(endtime / 1000, 'yyyy-MM-dd') })}`
                }

                if (password) {
                    clipboardData += `\n${__('访问密码：${password}', { password })}`
                }

                this.setState({
                    clipboardData,
                    text: address,
                })
            }
        } else if (invitationid) {
            const address = await buildInvitationHref(invitationid);

            this.setState({
                clipboardData: address,
                text: address,
            })
        }
    }

    /**
     * 复制链接成功
     */
    copyLinkSuccess() {
        this.setState({
            copySuccess: true
        });

        setTimeout(() => {
            this.setState({
                copySuccess: false
            })
        }, 5000)
    }
}
