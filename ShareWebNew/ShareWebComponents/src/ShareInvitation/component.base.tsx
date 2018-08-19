import * as React from 'react';
import { assign, pick, includes } from 'lodash';
import WebComponent from '../webcomponent';
import * as WebUploader from '../../libs/webuploader';
import { getHostInfo } from '../../core/apis/eachttp/redirect/redirect';
import { getDocType } from '../../core/apis/eachttp/entrydoc/entrydoc';
import { getConfig } from '../../core/config/config';
import { getDisabledOptions, getInternalTemplate, buildSelectionText, SharePermissionOptions, getEndTime, SharePermission } from '../../core/permission/permission';
import { setBaseInfo, open, getBaseInfoByDocId, setNoteInfo, getNoteInfoByDocId, close } from '../../core/apis/eachttp/invitation/invitation';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { check } from '../../core/apis/eachttp/owner/owner';
import { bitSum, bitSub } from '../../util/accessor/accessor';
import { Status, UploadStatus, ReqStatus } from './helper';
import __ from './locale';

export default class ShareInvitationBase extends WebComponent<Components.ShareInvitation.Props, Components.ShareInvitation.State> implements Components.ShareInvitation.Component {
    static defaultProps = {
        doc: {},
        swf: '',
        uploadSwf: ''
    }
    // 备注信息
    description: string = '';

    // WebUploader 实例
    uploader = null;

    state = {
        // 共享邀请状态
        status: Status.CLOSED,
        // 邀请id
        invitationid: '',
        // 邀请链接有限期
        invitationendtime: -1,
        // 权限有有效期
        permendtime: -1,
        // 备注弹窗状态
        descriptionDialog: false,
        // 图片状态
        uploadStatus: UploadStatus.NO_PICTURE,
        // 图片内容
        image: '',
        // 备注信息
        description: '',
        // 配置信息是否被编辑
        change: false,
        // 已选权限
        allow: 0,
        // 异常
        reqStatus: ReqStatus.PENDING
    }

    // 权限
    perm: {
        isowner: false,
        allow: 0,
        deny: 0
    };

    Template = {};

    disabledOptions = null;


    hideConfig() {
        if (typeof this.props.onClose === 'function') {
            this.props.onClose()
        } else {
            this.destroy()
        }
    }

    /**
     * 获取模板配置
     */
    getShareInvitTemp() {
        return getInternalTemplate().then(temp => {
            return pick(temp, ['allowPerms', 'defaultPerms', 'maxExpireDays', 'defaultExpireDays', 'validExpireDays']);
        });
    }

    /**
     * 获取初始数据
     * 
     */
    componentWillMount() {
        this.checkOwners();
    }


    componentDidUpdate(_prevProps, prevState) {
        // 切换外链详细信息显示时，重新定位对话框
        if (prevState.status !== this.state.status) {
            this.refs.dialog && this.refs.dialog.center();
        }
    }

    /**
     * 获取邀请基本信息
     */
    getInfo(): Promise<void> {
        return Promise.all([
            getDisabledOptions({ docid: this.props.doc.docid }),
            getBaseInfoByDocId({ docid: this.props.doc.docid }),
            this.getShareInvitTemp()
        ]).then(([disabledOptions, res, temp]) => {
            this.disabledOptions = disabledOptions;
            this.Template = temp;

            if (res.invitationid) {
                this.updateInvitationInfo(res);
            } else {
                this.setState({
                    status: Status.CLOSED,
                })
            }
        })
    }

    /**
    * 开启共享邀请
    */
    linkOn() {

        Promise.all([this.getShareInvitTemp(), getDocType({ docid: this.props.doc.docid }), open({ docid: this.props.doc.docid })]).then(([temp, docType, linkInfo]) => {
            this.Template = temp;
            let permendtime = this.Template.validExpireDays ?
                getEndTime(Math.min(30, this.Template.maxExpireDays)) : getEndTime(this.Template.defaultExpireDays),
                // 判断是否归档库(过滤模板中的删除和修改权限)
                perm = docType === 'archivedoc' ?
                    bitSub(this.Template.defaultPerms, bitSum(SharePermission.MODIFY, SharePermission.DELETE)) : this.Template.defaultPerms,
                tempInfo = assign({}, linkInfo, { permendtime, perm });

            this.updateInvitationInfo(tempInfo);
        }, xhr => {
            this.setState({
                status: Status.CLOSED,
                reqStatus: xhr.errcode
            })
        })
    }

    /**
     * 关闭共享邀请
     */
    linkOff() {
        close({ 'docid': this.props.doc.docid }).then(() => {
            this.setState({
                status: Status.CLOSED
            })
        }, xhr => {
            this.setState({
                status: Status.OPEN,
                reqStatus: xhr.errcode
            })

        })
    }


    updateInvitationInfo(invitationInfo) {
        if (invitationInfo.invitationid) {
            this.setState({
                status: Status.OPEN,
                change: false,
                invitationid: invitationInfo.invitationid,
                invitationendtime: invitationInfo.invitationendtime,
                permendtime: invitationInfo.permendtime,
                allow: invitationInfo.perm
            })
        } else {
            this.setState({
                change: false,
                status: Status.CLOSED
            })
        }
    }

    /**
     * 设置权限有效期
    */
    setPermTime(date) {
        this.setState({
            change: true,
            permendtime: date
        })
    }
    /**
     * 设置邀请有效期
     */
    setInvitationTime(date) {
        this.setState({
            change: true,
            invitationendtime: date
        })
    }

    /**
     * 保存基本信息
     */
    saveInvitationInfo() {
        // 获取最新模板
        this.getShareInvitTemp().then(temp => this.Template = temp);
        if (this.state.permendtime !== -1 && (this.state.invitationendtime > this.state.permendtime)) {
            this.setState({
                reqStatus: ReqStatus.TIMEERROR
            })
        } else {
            setBaseInfo({
                docid: this.props.doc.docid,
                invitationendtime: this.state.invitationendtime,
                perm: this.state.allow,
                permendtime: this.state.permendtime
            }).then(() => {
                this.setState({
                    change: false
                })
            }, xhr => {
                this.setState({ reqStatus: xhr.errcode })
            })
        }
    }
    /**
     * 取消保存
     */
    cancelInvitationInfo() {
        this.getInfo();
    }

    /**
     * 设置备注信息
     */
    setDescription() {
        getNoteInfoByDocId({ docid: this.props.doc.docid }).then(noteInfo => {
            this.description = noteInfo.description;
            if (noteInfo.image) {
                this.setState({
                    descriptionDialog: true,
                    uploadStatus: UploadStatus.UPLOAD_COMPELETE,
                    image: noteInfo.image,
                    description: noteInfo.description
                })
            } else {
                this.setState({
                    descriptionDialog: true,
                    uploadStatus: UploadStatus.NO_PICTURE,
                    image: noteInfo.image,
                    description: noteInfo.description
                })
                this.initWebUpload();
            }
        }, xhr => {
            this.setState({
                reqStatus: xhr.errcode
            })
        })
    }

    /**
     * 选择权限
     */
    selectPerm(value) {
        this.perm = assign({}, value);
        this.setState({
            allow: value.allow,
            change: true
        });
    }
    /**
     * 关闭描述
     */
    closeDescription() {
        this.setState({
            descriptionDialog: false
        })
    }

    /**
     * 保存描述
     */
    saveDescription() {
        setNoteInfo({ docid: this.props.doc.docid, image: this.state.image, description: this.description }).then(() => {
            this.setState({
                descriptionDialog: false
            })
        })
    }

    /**
     * 更改描述
     */
    changeDescription(value) {
        this.description = value;
    }

    // 删除图片
    delImage() {
        this.setState({
            image: '',
            uploadStatus: UploadStatus.NO_PICTURE
        })
        this.initWebUpload();
    }

    // 上传图片
    initWebUpload() {
        let self = this;
        Promise.all([getConfig('https'), getHostInfo(null)]).then(([https, { host, port, https_port }]) => {
            self.uploader = new WebUploader.Uploader({
                swf: this.props.uploadSwf,
                server: `${https ? 'https' : 'http'}://${host}:${https ? https_port : port}/uploadimage`,
                auto: true,
                method: 'POST',
                threads: 1,
                forceURLStream: true,
                sendAsBinary: false,
                disableWidgets: ['fileupload'], // 在Components.Upload2中注册了fileupload，此处禁用掉避免上传失败
                compress: {
                    width: 80,
                    height: 80,
                    allowMagnify: false,
                    crop: false,
                    noCompressIfLarger: true,
                    quality: 10
                },
                accept: {
                    extensions: 'jpg,jpeg,gif,bmp,png',
                    mimeTypes: 'image/*'
                },
                chunked: false,
                pick: {
                    id: self.refs.select,
                    innerHTML: __('选择文件'),
                    multiple: false
                },
                onBeforeFileQueued: function (file) {
                    self.setState({
                        uploadStatus: UploadStatus.UPLOADING_IMAGE,
                        imageType: file.ext
                    })
                },
                onUploadComplete: function (file) {

                },
                onUploadSuccess: function (file, response) {
                    self.setState({
                        image: `data:img/${file.ext};base64,${response.result}`,
                        uploadStatus: UploadStatus.UPLOAD_COMPELETE
                    })
                },
                onUploaderError: function (file, reason) {
                    self.setState({
                        reqStatus: reason.errcode
                    })
                }
            })

        })
    }
    /**
     * 重置错误
     */
    resetError() {
        if (includes([403171, 403172], this.state.reqStatus)) {
            this.hideConfig()
        } else {
            this.setState({
                reqStatus: ReqStatus.OK
            })
        }
    }

    /**
     * 检查所有者
     */
    async checkOwners() {
        if (!(await check({ docid: this.props.doc.docid })).isowner) {
            this.setState({
                reqStatus: ReqStatus.NOT_OWNER
            })
        } else {
            try {
                await this.getInfo();
                this.setState({
                    reqStatus: ReqStatus.OK
                })
            } catch (xhr) {
                if (xhr.errcode === ErrorCode.UserNotRealName || ErrorCode.CreatorNotRealName) {
                    this.hideConfig()
                }
                this.setState({
                    status: Status.CLOSED,
                    reqStatus: xhr.errcode
                })
            }
        }
    }

    buildTempAllowPerms() {
        return buildSelectionText(SharePermissionOptions, { allow: this.Template.allowPerms })
    }

    buildDefaultSelect() {
        const { validExpireDays, defaultExpireDays, maxExpireDays } = this.Template;
        return validExpireDays ?
            defaultExpireDays ?
                defaultExpireDays : Math.min(30, maxExpireDays)
            :
            defaultExpireDays === -1 ?
                30 : defaultExpireDays;
    }
}