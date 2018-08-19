import * as React from 'react';
import { noop, isFunction } from 'lodash';
import { bitSub } from '../../util/accessor/accessor';
import { getDetail, set, open, close } from '../../core/apis/efshttp/link/link';
import { check as checkOwner } from '../../core/apis/eachttp/owner/owner';
import { getDocType } from '../../core/apis/eachttp/entrydoc/entrydoc';
import { getShareDocConfig } from '../../core/apis/eachttp/perm/perm';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { isDir } from '../../core/docs/docs';
import { LinkSharePermissionOptions, LinkSharePermission, getExternalinkTemp, setLinkSharePerm, unsetLinkSharePerm, getEndTime, buildSelectionText } from '../../core/permission/permission';
import { buildLinkHref } from '../../core/linkconfig/linkconfig';
import { getConfig } from '../../core/config/config';
import { MAX_INPUT } from '../../core/constants'
import WebComponent from '../webcomponent';
import { Status, ReqStatus, ErrorStatus } from './helper';

export enum Format {
    PNG,

    SVG,
}

export default class LinkShareBase extends WebComponent<Components.LinkShare.Props, Components.LinkShare.State>  {

    static defaultProps = {
        doc: null,
        onResize: noop,
        onErrorConfirm: noop,
        doConfigurationClose: noop,
        doApprovalCheck: noop,
    }

    state = {
        perm: 0,
        change: false,
        copySuccess: false,
        sendMailSuccess: false,
        configing: true,
        reqStatus: ReqStatus.PENDDING,
        error: ErrorStatus.OK,
        apvCase: false,
        isDisableSend: true,
        mailto: [],
        viewFullImage: false,
        showDownloadDialog: false,
        qrcodeFormat: Format.PNG,
        enableLinkAccessCode: false,
        opening: false,
        closing: false
    };

    doc = this.props.doc;

    /**
     * 外链模版
     */
    template: Core.Permission.externalinkTemp;

    /**
     * 外链详细信息
     */
    detail;

    /**
     * 是否开启提取码
     */
    enableLinkAccessCode: boolean;

    // async componentWillMount() {
    //     await this.checkLinkShareConfig(this.doc);
    // }

    async componentDidMount() {
        await this.checkLinkShareConfig(this.doc);
    }



    /**
     * 检测个人文档、群组文档是否允许开启外链
     */
    private async checkLinkShareConfig(doc: Core.Docs.Doc) {
        try {
            // 个人文档、群组文档是否允许开启外链
            const [{ enable_user_doc_out_link_share, enable_group_doc_out_link_share }, { isowner }, { doctype }] = await Promise.all([
                getShareDocConfig({}),
                checkOwner({ docid: doc.docid }),
                getDocType({ docid: doc.docid })
            ])

            if (isowner) {
                if (doctype === 'userdoc' && !enable_user_doc_out_link_share) {
                    // 个人文档 不允许开启外链
                    this.setState({
                        reqStatus: ErrorCode.PersonLinkUnauthorized
                    })
                } else if (doctype === 'groupdoc' && !enable_group_doc_out_link_share) {
                    // 群组文档 不允许开启外链
                    this.setState({
                        reqStatus: ErrorCode.GroupLinkUnauthorized
                    })
                } else {
                    this.template = await getExternalinkTemp();
                    await this.getDetail();
                }
            } else {
                this.setState({
                    reqStatus: ErrorCode.PermissionRestricted
                })
            }
        } catch (err) {
            this.setState({
                reqStatus: err.errcode
            })
        }
    }

    /**
     * 居中对话框
     */
    protected centerConfiguration() {

    }

    /**
     * 查看原图
     */
    viewFullImage() {
        this.setState({ viewFullImage: true });
    }

    /**
     * 关闭查看原图
     */
    closeViewFullImage() {
        this.setState({ viewFullImage: false });
    }

    /**
    * 显示二维码下载对话框
    */
    showDownloadDialog() {
        this.setState({ downloadQRCode: true });
    }

    /**
     * 关闭二维码下载对话框
     */
    closeDownloadDialog() {
        this.setState({ downloadQRCode: false });
    }

    /**
     * 下载二维码图片
     * @param url 下载地址
     */
    protected downloadQRCode(url) {
        location.assign(url);
        this.closeDownloadDialog();
    }

    /**
     * 获取外链详细信息
     */
    private async getDetail() {
        try {
            const [
                detail,
                { enable_link_access_code }
            ] = await Promise.all([
                getDetail({ docid: this.doc.docid }),
                getConfig()
            ]);

            this.detail = detail;
            this.enableLinkAccessCode = enable_link_access_code;

            if (detail.link) {
                this.updateLinkState(detail);
                this.setState({
                    address: await buildLinkHref(detail.link),
                    reqStatus: ReqStatus.OK,
                    status: Status.OPEN,
                })
            } else {
                this.setState({
                    reqStatus: ReqStatus.OK,
                    status: Status.CLOSED
                })
            }
        } catch (xhr) {
            if (xhr.errcode === ErrorCode.UserNotRealName || xhr.errcode === ErrorCode.CreatorNotRealName) {
                this.props.doConfigurationClose()
            }
            this.setState({
                otherError: xhr.errmsg,
                reqStatus: xhr.errcode
            })
        }
    }

    /**
     * 切换开启／关闭外链
     * @param on 开启／关闭
     */
    protected switchStatus(on: boolean): void {
        if (on === true) {

            this.setState({
                opening: true
            }, () => {
                this.linkOn()
            })
        } else {
            this.setState({
                closing: true
            }, () => {
                this.linkOff();
            })

        }
    }

    /**
     * 开启外链
     */
    private async linkOn() {
        // 选中文件
        if (
            !isDir(this.doc) &&
            (this.template.defaultPerms === LinkSharePermission.UPLOAD || this.template.allowPerms === LinkSharePermission.UPLOAD)
        ) {
            // 模板仅有上传权限
            this.setState({ error: ErrorStatus.PermInvalid })
        } else {
            try {
                const { result, ...info } = await open({ docid: this.doc.docid });

                if (result) {
                    this.setState({
                        apvCase: true,
                        reqStatus: ReqStatus.OK
                    })
                } else {
                    let perm = !isDir(this.doc) ? bitSub(info.perm, LinkSharePermission.UPLOAD) : info.perm,
                        endtime = this.template.validExpireDays ?
                            this.template.maxExpireDays > 30 ?
                                getEndTime(30) :
                                getEndTime(this.template.maxExpireDays) :
                            getEndTime(this.template.defaultExpireDays),
                        limittimes = this.template.limitAccessTime ? this.template.maxLimitTimes : -1

                    this.detail = info;
                    this.updateLinkState({ ...info, perm, endtime, limittimes });
                    this.setState({
                        status: Status.OPEN,
                        address: await buildLinkHref(info.link),
                    })
                }
            } catch (xhr) {
                this.setState({
                    status: Status.CLOSED,
                    otherError: xhr.errmsg,
                    error: xhr.errcode
                })
            } finally {
                this.setState({
                    opening: false
                })
            }
        }
    }

    /**
     * 关闭外链
     */
    private async linkOff() {
        try {
            await close({ docid: this.doc.docid });

            this.setState({
                status: Status.CLOSED,
                change: false
            })
        } catch (xhr) {
            this.setState({
                status: Status.OPEN,
                otherError: xhr.errmsg,
                error: xhr.errcode,
                change: true
            })
        } finally {
            this.setState({
                closing: false
            })
        }
    }

    /**
     * 设置外链密码
     */
    setRelatedPassword(checked) {
        this.setState({ change: true, password: checked ? '****' : '' })
    }

    setRelatedLimit(checked) {
        this.setState({ change: true, limitTimeStatus: checked });

        checked ?
            this.setState({
                limitTimes: this.template.limitAccessTime ? this.template.maxLimitTimes : this.template.defaultLimitTimes
            }) :
            this.setState({ limitTimes: '' })
    }

    /**
     *保存设置
     */
    protected async saveLinkInfo() {
        if (this.template.limitAccessTime && !this.state.limitTimeStatus) {
            this.setState({ error: ErrorStatus.AccessTimesMissing })
        } else if (!isDir(this.doc) && this.template.allowPerms === 4) {
            this.setState({ error: ErrorStatus.PermInvalid });
        }

        else {
            try {
                const { result, ...detail } = await set({
                    docid: this.doc.docid,
                    open: this.state.password ? true : false,
                    endtime: this.state.endtime,
                    perm: this.state.perm,
                    limittimes: parseInt(this.state.limitTimeStatus ? this.state.limitTimes : -1)
                });

                if (result) {
                    this.setState({
                        apvCase: true,
                        status: Status.CLOSED,
                        reqStatus: ReqStatus.OK
                    })

                    this.updateLinkState(this.detail);
                } else {
                    this.detail = detail;
                    this.updateLinkState(detail);
                }

                this.setState({
                    change: false
                })
            } catch (xhr) {
                this.setState({
                    otherError: xhr.errmsg,
                    error: xhr.errcode
                })
            }
        }

    }

    /**
     * 取消设置
     */
    protected resetLinkDetail() {
        this.updateLinkState(this.detail);
        this.setState({
            change: false,
            error: ErrorStatus.OK
        })
    }

    /**
     * 设置默认权限
     * @param checked, perm 复选框是否选中，权限值
     */
    protected updateDefaultPerm(checked: boolean, perm: number) {
        checked ?
            this.updatePerm(setLinkSharePerm({ allow: this.state.perm }, perm).allow) :
            this.updatePerm(unsetLinkSharePerm({ allow: this.state.perm }, perm).allow)
    }

    private updatePerm(perm) {
        this.setState({
            change: true,
            perm
        });
    }

    /**
     * 设置限制次数
     */
    protected setLimitTimes(limitTimes) {
        if (limitTimes > MAX_INPUT) {
            this.setState({ change: true });
        } else {
            this.setState({ change: true, limitTimes });
        }

    }

    /**
     * 更新表单数据
     */
    private updateLinkState({ link, accesscode, endtime, perm, limittimes, password }) {
        this.setState({
            link,
            endtime,
            accesscode,
            password,
            perm,
            limitTimes: limittimes === -1 ? '' : limittimes,
            limitTimeStatus: limittimes !== -1,
        })
    }

    /**
     * 设置外链有效期
     */
    protected setLinkDate(endtime) {
        this.setState({ change: true, endtime });
    }

    /**
     * 构造外链模板限定权限
     */
    protected buildTempAllowPerms() {
        return buildSelectionText(LinkSharePermissionOptions, { allow: this.template.allowPerms })
    }

    /**
     * 邮件发送成功时执行
     */
    private onMailSendSuccess() {
        this.setState({
            sendMailSuccess: true
        });

        setTimeout(() => {
            this.setState({
                sendMailSuccess: false
            })
        }, 5000)
    }

    /**
     * 邮件发送失败
     * @param err 异常
     */
    private onMailSendError(err) {
        this.setState({
            error: err.errcode
        })
    }

    protected resetApv() {
        this.setState({
            apvCase: false
        })
    }

    protected updateMails(mailto) {
        this.setState({
            mailto
        })
    }

    protected close() {
        this.setState({
            error: ErrorStatus.OK
        }, () => {
            this.props.onErrorConfirm()
        })
    }
}