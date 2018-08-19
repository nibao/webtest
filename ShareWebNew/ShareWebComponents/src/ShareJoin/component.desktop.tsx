import * as React from 'react';
import * as classnames from 'classnames';
import { ClassName } from '../../ui/helper';
import { getErrorTemplate, getErrorMessage } from '../../core/errcode/errcode';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { getIcon } from '../helper';
import ShareJoinBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as error from './assets/error.png';
import { ReqStatus } from './helper';
export default class ShareJoin extends ShareJoinBase {
    render() {
        return this.state.reqStatus === ReqStatus.PENDING ?
            <div></div> :
            this.state.reqStatus === ReqStatus.OK ?
                this.getInvitationInfo() :
                this.getErrorText()
    }

    getInvitationIcon() {
        if (this.state.image) {
            return (
                <Icon url={this.state.image} size="80" />
            )
        }
        else {
            return (<span>{getIcon({ name: this.state.docname, isdir: this.state.isdir }, { size: '80' })}</span>)
        }
    }

    getInvitationInfo() {
        return (
            <div className={styles['group-join']}>
                <FlexBox>
                    <FlexBox.Item align="center middle">
                        <div className={styles['header']}>
                            {__('您获得一个文档共享邀请')}
                        </div>
                        <div className={styles['group-info-icon']}>
                            {
                                this.getInvitationIcon()
                            }
                        </div>
                        <div className={styles['group-info']}>
                            <span className={styles['docname']} title={this.state.docname}>
                                {
                                    this.state.docname
                                }
                            </span>
                        </div>
                        <div className={styles['group-info-attr']}>
                            <Form>
                                <Form.Row>
                                    <Form.Label>
                                        {__('访问权限：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <div
                                            className={styles['attr-value']}
                                            title={this.state.perm}
                                        >
                                            {
                                                this.state.perm
                                            }
                                        </div>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        <label>{__('权限有效期限：')}</label>
                                    </Form.Label>
                                    <Form.Field>
                                        <div className={styles['attr-value']}>{this.state.permendtime}</div>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        {__('链接有效期限：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <div className={styles['attr-value']}>{this.state.invitationendtime}</div>
                                    </Form.Field>
                                </Form.Row>
                            </Form>

                        </div>
                    </FlexBox.Item>
                </FlexBox>
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
                        onClick={this.joinNow.bind(this)}
                    >
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
                return this.formatErrorDisplay(__('当前链接地址已失效。'))
            case ReqStatus.DOCSEXIST:
                return this.formatErrorDisplay(__('文档不存在。'));
            case ReqStatus.OWNEREXIST:
                return this.formatErrorDisplay(__('文档所有者不存在。'))
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
    * 弹窗提示
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