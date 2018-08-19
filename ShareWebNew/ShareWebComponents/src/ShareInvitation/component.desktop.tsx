import * as React from 'react';
import * as classnames from 'classnames';
import { includes } from 'lodash';
import { isDir, docname } from '../../core/docs/docs';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import TweetBox from '../../ui/TweetBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import LinkIcon from '../../ui/LinkIcon/ui.desktop';
import CopyLink from '../CopyLink/component.desktop';
import QrCodeLink from '../QrCodeLink/component.desktop';
import PermissionSelect from '../PermissionSelect/component.desktop';
import ValidityBox2 from '../ValidityBox2/component.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { getErrorMessage } from '../../core/errcode/errcode';
import { getSelectionTimeRange } from '../../core/permission/permission';
import { getIcon } from '../helper';
import { Status, UploadStatus, ReqStatus } from './helper';
import ShareInvitationBase from './component.base';
import * as styles from './styles.desktop.css';
import * as close from './assets/close.desktop.png';
import * as load from './assets/loading.gif';
import __ from './locale';

export default class ShareInvitation extends ShareInvitationBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.reqStatus !== ReqStatus.PENDING && !includes([403171, 403172], this.state.reqStatus) ?
                        this.state.reqStatus === ReqStatus.NOT_OWNER ?
                            this.renderPermissionError() : this.renderMainConfig()
                        : null
                }
                {
                    includes([403171, 403172], this.state.reqStatus) ?
                        this.renderError(this.state.reqStatus) :
                        null
                }
            </div>
        )
    }

    renderPermissionError() {
        if (isDir(this.props.doc)) {
            return (
                <MessageDialog onConfirm={this.hideConfig.bind(this)}>
                    <p>{__('您不是该文件夹的所有者，无法使用此功能。')}</p>
                </MessageDialog>
            )
        } else {
            return (
                <MessageDialog onConfirm={this.hideConfig.bind(this)}>
                    <p>{__('您不是该文件的所有者，无法使用此功能。')}</p>
                </MessageDialog>
            )
        }
    }

    renderMainConfig() {
        return (
            <Dialog
                width="650"
                ref="dialog"
                title={__('共享邀请')}
                onClose={this.hideConfig.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles.linkInfo}>
                            <FlexBox>
                                <FlexBox.Item align="left middle">
                                    {
                                        getIcon(this.props.doc)
                                    }
                                    <div className={styles['filename']}>
                                        <Text>
                                            {
                                                docname(this.props.doc)
                                            }
                                        </Text>
                                    </div>
                                </FlexBox.Item>
                                <FlexBox.Item align="right middle">
                                    {
                                        this.switchMainButton(this.state.status)
                                    }
                                </FlexBox.Item>
                            </FlexBox>
                        </div>
                        {
                            this.state.status === Status.OPEN ? this.renderLinkDetail() : null
                        }
                    </Panel.Main>
                </Panel>
                {
                    this.state.reqStatus !== ReqStatus.OK ? this.renderError(this.state.reqStatus) : null
                }
            </Dialog>
        );
    }

    switchMainButton(status) {
        return status === Status.OPEN ?
            <div>
                <span className={styles['note-btn']} >
                    <Button onClick={() => this.setDescription()}>{__('添加备注')}</Button>
                </span>
                <span>
                    <Button onClick={() => this.linkOff()}>{__('关闭邀请')}</Button>
                </span>
            </div> :
            <Button onClick={() => this.linkOn()}>{__('开启邀请')}</Button>
    }

    renderLinkDetail() {
        return (
            <div>
                <div>
                    <div className={styles.block}>
                        <FlexBox>
                            <FlexBox.Item align="left middle">
                                <div className={styles.fullLinkLabel}>
                                    <label >{__('邀请链接：')}</label>
                                </div>
                            </FlexBox.Item>
                            <FlexBox.Item align="right middle">
                                <CopyLink
                                    invitationid={this.state.invitationid}
                                    swf={this.props.swf}
                                />
                            </FlexBox.Item>
                        </FlexBox>
                    </div>
                    <div className={styles[styles.block]}>
                        <label>{__('您可以对获取邀请的访问者，进行以下配置：')}</label>
                    </div>
                    <div className={styles.block}>
                        <FlexBox>
                            <FlexBox.Item>
                                <div className={styles.config}>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label><label>{__('访问权限：')}</label></Form.Label>
                                            <Form.Field>
                                                <div className={styles['permDrop']} style={{ zIndex: 3 }}>
                                                    <PermissionSelect
                                                        allow={this.state.allow}
                                                        allowPerms={this.Template.allowPerms}
                                                        disabledOptions={this.disabledOptions}
                                                        onChange={(key, perm) => this.selectPerm(perm)} />
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label><label>{__('权限有效期限：')}</label></Form.Label>
                                            <Form.Field>
                                                <div className={styles['permDrop']} style={{ zIndex: 2 }}>
                                                    <ValidityBox2
                                                        allowPermanent={!this.Template.validExpireDays || this.state.permendtime === -1}
                                                        value={this.state.permendtime}
                                                        onChange={date => { this.setPermTime(date) }}
                                                        defaultSelect={this.buildDefaultSelect()}
                                                        selectRange={getSelectionTimeRange(this.Template.validExpireDays ? this.Template.maxExpireDays : 0)}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label><label>{__('链接有效期限：')}</label></Form.Label>
                                            <Form.Field>
                                                <div className={styles['permDrop']} style={{ zIndex: 1 }}>
                                                    <ValidityBox2
                                                        value={this.state.invitationendtime}
                                                        onChange={date => { this.setInvitationTime(date) }}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        <div className={classnames(styles.block, { [styles.invisible]: !this.state.change })} >
                                            <div className={styles.buttonWrapper}>
                                                <Button onClick={this.saveInvitationInfo.bind(this)}>{__('保存')}</Button>
                                            </div>
                                            <div className={styles.buttonWrapper}>
                                                <Button onClick={this.cancelInvitationInfo.bind(this)}>{__('取消')}</Button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </FlexBox.Item>
                            <FlexBox.Item>
                                <QrCodeLink invitationid={this.state.invitationid} />
                            </FlexBox.Item>
                        </FlexBox>
                        {
                            this.state.descriptionDialog ? this.renderDescription() : null
                        }
                    </div>
                </div>
            </div>
        )
    }

    /**
     * 备注信息
     */
    renderDescription() {
        return (
            <Dialog
                title={__('备注信息')}
                onClose={this.closeDescription.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div>
                            <FlexBox>
                                <FlexBox.Item align="left top" width="50">
                                    <label>
                                        {__('图片：')}
                                    </label>
                                </FlexBox.Item>
                                <FlexBox.Item align="left top">
                                    <div className={classnames({ [styles['upload-hide']]: this.state.uploadStatus !== UploadStatus.NO_PICTURE })}>
                                        <div className={styles['btn-uploader-picker']} ref="select"></div>
                                        <div className={styles['block']}>{__('图片大小不能超过5.00 MB')}</div>
                                    </div>
                                    {
                                        this.getImageStatus()
                                    }
                                </FlexBox.Item>
                            </FlexBox>
                        </div>
                        <div className={styles['block']}>
                            <FlexBox>
                                <FlexBox.Item align="left top" width="50">
                                    <label>
                                        {__('内容：')}
                                    </label>
                                </FlexBox.Item>
                                <FlexBox.Item>
                                    <TweetBox style={{ width: '280px', height: '100px' }} onChange={(value) => { this.changeDescription(value) }} value={this.description} />
                                </FlexBox.Item>
                            </FlexBox>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Button onClick={this.saveDescription.bind(this)}>{__('确定')}</Button>
                        <Button onClick={this.closeDescription.bind(this)}>{__('取消')}</Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }

    /**
     * 上传图片
     */
    getImageStatus() {
        if (this.state.uploadStatus === UploadStatus.UPLOADING_IMAGE) {
            return (
                <div className={styles['block']}>
                    <Icon url={load} size="24" />
                    {__('正在上传...')}
                </div>
            )
        } else if (this.state.uploadStatus === UploadStatus.UPLOAD_COMPELETE) {
            return (
                <div>
                    <Icon url={this.state.image} size="60" />
                    <span className={styles['btn-del-image']}>
                        <LinkIcon url={close} onClick={this.delImage.bind(this)} size="16" />
                    </span>
                </div>
            )
        } else {
            return null
        }
    }

    /**
     * 错误处理
     */
    renderError(status) {
        switch (status) {
            case ReqStatus.TIMEERROR:
                return (
                    <MessageDialog onConfirm={this.resetError.bind(this)}>
                        <p>{__('链接有效期限不能大于权限有效期限。')}</p>
                    </MessageDialog>
                );

            case ReqStatus.OVER_ALLOW_PERMS:
                return (
                    <MessageDialog onConfirm={this.resetError.bind(this)}>
                        <p>{__('管理员已限制您可设定的访问权限为“${allowPerms}”。', { allowPerms: this.buildTempAllowPerms() })}</p>
                    </MessageDialog>
                );

            case ReqStatus.OVER_MAX_EXPIRE_DAYS:
                return (
                    <MessageDialog onConfirm={this.resetError.bind(this)}>
                        <p>{__('管理员已限制您设定的有效期，不允许超过${expireDays}天。', { expireDays: this.Template.maxExpireDays })}</p>
                    </MessageDialog>
                )
            case ReqStatus.USER_FREEZED:
            case ReqStatus.DOC_FREEZED:
                return (
                    <MessageDialog onConfirm={this.resetError.bind(this)}>
                        <p>{__('无法开启共享邀请，') + getErrorMessage(status)}</p>
                    </MessageDialog>
                )

            default:
                return (
                    <MessageDialog onConfirm={this.resetError.bind(this)}>
                        <p>{getErrorMessage(this.state.reqStatus)}</p>
                    </MessageDialog>
                )
        }
    }

}