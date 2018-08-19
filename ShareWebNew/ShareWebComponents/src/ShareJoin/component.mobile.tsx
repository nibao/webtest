import * as React from 'react';
import { getErrorTemplate, getErrorMessage } from '../../core/errcode/errcode';
import * as classnames from 'classnames';
import { ClassName } from '../../ui/helper';
import FlexBox from '../../ui/FlexBox/ui.mobile';
import Icon from '../../ui/Icon/ui.mobile';
import Button from '../../ui/Button/ui.mobile';
import MessageDialog from '../../ui/MessageDialog/ui.mobile';
import { getIcon } from '../helper';
import ShareJoinBase from './component.base';
import __ from './locale';
import { ReqStatus } from './helper';
import * as error from './assets/error.png';
import * as styles from './styles.mobile.css';
export default class ShareJoin extends ShareJoinBase {
    render() {
        return (
            <div className={styles['group-join']}>
                {
                    this.state.reqStatus === ReqStatus.PENDING ?
                        <div></div> :
                        this.state.reqStatus === ReqStatus.OK ?
                            this.getInvitationInfo() :
                            this.getErrorText()
                }
            </div>
        )
    }
    getInvitationIcon() {
        if (this.state.image) {
            return (
                <Icon url={this.state.image} size="80" />
            )
        }
        else {
            return (
                <span>{getIcon({ name: this.state.docname, isdir: this.state.isdir }, { size: '80' })}</span>
            )
        }
    }

    getInvitationInfo() {
        return (
            <div>
                <div className={styles['header']}>
                    {__('您获得一个文档共享邀请')}
                </div>
                <div className={styles['group-info-icon']}>
                    {
                        this.getInvitationIcon()
                    }
                </div>
                <div className={styles['group-info']}>
                    <FlexBox>
                        <FlexBox.Item align="left middle" width="120">
                            <label >{__('文档名称：')}</label>
                        </FlexBox.Item>
                        <FlexBox.Item align="left top" width="150">
                            <span className={styles['docname']}>{this.state.docname}</span>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                <div className={styles['group-info']}>
                    <FlexBox>
                        <FlexBox.Item align="left top" width="120">
                            <label>{__('访问权限：')}</label>
                        </FlexBox.Item>
                        <FlexBox.Item align="left top" width="150">
                            <span className={styles['perm']}>{this.state.perm}</span>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                <div className={styles['group-info']}>
                    <FlexBox>
                        <FlexBox.Item align="left top" width="120">
                            <label>{__('权限有效期限：')}</label>
                        </FlexBox.Item>
                        <FlexBox.Item align="left top" width="150">
                            <span>{this.state.permendtime}</span>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                <div className={styles['group-info']}>
                    <FlexBox>
                        <FlexBox.Item align="left top" width="120">
                            <label>{__('链接有效期限：')}</label>
                        </FlexBox.Item>
                        <FlexBox.Item align="left top" width="150">
                            <span>{this.state.invitationendtime}</span>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                {
                    this.state.description ?
                        <div className={styles['description']}>
                            <label>
                                {__('备注内容：')}
                            </label>
                            <span>
                                {this.state.description}
                            </span>
                        </div> : null
                }
                <div className={styles['group-info-button']}>
                    <Button
                        type="submit"
                        className={classnames(styles['submit-btn'], ClassName.BackgroundColor)}
                        onClick={this.joinNow.bind(this)}>
                        {
                            __('立即加入')
                        }
                    </Button>
                </div>
                {
                    this.messageNote()
                }
            </div>
        )
    }
    /**
     * 错误提示
     */
    getErrorText() {
        switch (this.state.reqStatus) {
            case ReqStatus.EXPIRED:
                return this.formatErrorDisplay(__('当前链接地址已失效。'));

            case ReqStatus.DOCSEXIST:
                return this.formatErrorDisplay(__('文档不存在。'));

            case ReqStatus.OWNEREXIST:
                return this.formatErrorDisplay(__('文档所有者不存在。'));
            default:
                return this.formatErrorDisplay(getErrorMessage(this.state.reqStatus));

        }
    }
    formatErrorDisplay(message) {
        return (
            <div className={styles['group-join']}>
                <div>
                    <Icon url={error} size="96" />
                </div>
                <div className={styles['error-tip']}>
                    {message}
                </div>
            </div>
        )
    }
    /**
     *弹窗提示
     */
    messageNote() {
        if (this.state.message) {
            return (
                <MessageDialog onConfirm={this.groupJoin.bind(this)}>
                    <p>{__('您需要通过身份认证后，方能加入。')}</p>
                </MessageDialog>
            )
        }

    }
}