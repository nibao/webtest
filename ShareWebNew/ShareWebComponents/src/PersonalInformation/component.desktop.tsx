import * as React from 'react';
import * as classnames from 'classnames';
import { pairs } from 'lodash';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import StackBar from '../../ui/StackBar/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.mobile';
import Form from '../../ui/Form/ui.desktop';
import IconGroup from '../../ui/IconGroup/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import { formatSize } from '../../util/formatters/formatters';
import { getErrorMessage } from '../../core/errcode/errcode';
import PersonalInformationBase from './component.base';
import { UserType } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class PersonalInformation extends PersonalInformationBase {
    /**
     * 判断用户角色
     */
    getRoleType() {
        if (this.state.userinfo) {
            const { roletypes } = this.state.userinfo;
            if (roletypes.length === 0) {// 普通用户
                return __('普通用户');
            } else if (roletypes.length === 1 && roletypes[0] === 1) {// 文档审核员
                return __('文档审核员');
            }
        }
    }

    /**
     * 判断用户认证类型
     */
    getUserType() {
        switch (this.state.userinfo.usertype) {
            case UserType.DomainUser:
                return __('域用户');
            case UserType.LocalUser:
                return __('本地用户');
            case UserType.ThirdUser:
                return __('外部用户');
            default:
                return __('未知');
        }
    }

    /**
     * 系统密级从低到高排序
     */
    sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map((item, index) => {
            return item[0]
        })
    }

    render() {
        const { quotaStackDatas, userinfo, csfLevelEnum, emailValue, errCode } = this.state;
        if (userinfo) {
            return (
                <div className={styles['personal']}>
                    <div className={styles['info-wrap']}>
                        <div className={classnames(styles['info-title'], styles['base-title'])}>{__('账户信息')}</div>
                        <FlexBox>
                            <FlexBox.Item align="center top" width="130px" >
                                <div style={{ paddingTop: '12px' }}>
                                    <UIIcon code="\uf01f" className={styles['icon']} />
                                    {
                                        userinfo.usertype === UserType.LocalUser || userinfo.passwordUrl ? (
                                            <p
                                                className={styles['modify-password']}
                                                onClick={this.handleChangePassword.bind(this)}
                                            >
                                                {__('修改密码')}
                                            </p>
                                        ) : null
                                    }
                                </div>
                            </FlexBox.Item>
                            <FlexBox.Item align="left top">
                                <Form>
                                    <Form.Row>
                                        <Form.Label><label className={styles['label']}>{__('用户名：')}</label></Form.Label>
                                        <Form.Field>
                                            <div className={styles['field']}>
                                                {userinfo.account ? <Text className={styles['text']}>{userinfo.account}</Text> : '---'}
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label><label className={styles['label']}>{__('显示名：')}</label></Form.Label>
                                        <Form.Field>
                                            <div className={styles['field']}>
                                                {userinfo.name ? <Text className={styles['text']}>{userinfo.name}</Text> : '---'}
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label><label className={styles['label']}>{__('用户角色：')}</label></Form.Label>
                                        <Form.Field>
                                            <div className={styles['field']}>
                                                {
                                                    this.getRoleType()
                                                }
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label><label className={styles['label']}>{__('密级：')}</label></Form.Label>
                                        <Form.Field>
                                            <div className={styles['field']}>
                                                {this.sortSecu(csfLevelEnum)[userinfo.csflevel - 5]}
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </FlexBox.Item>
                            <FlexBox.Item align="left top">
                                <Form>
                                    <Form.Row>
                                        <Form.Label><label className={styles['label']}>{__('直属部门：')}</label></Form.Label>
                                        <Form.Field>
                                            <div className={styles['field']}>
                                                <Text className={styles['text']}>{userinfo.directdepinfos.map(dep => dep.name).join(',')}</Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>

                                        <Form.Label><label className={styles['label']}>{__('认证类型：')}</label></Form.Label>
                                        <Form.Field>
                                            <div className={styles['field']}>
                                                {this.getUserType()}
                                            </div>
                                        </Form.Field>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Label><label className={styles['label']}>{__('邮箱：')}</label></Form.Label>
                                        <Form.Field>
                                            {
                                                this.state.emailEditing ? (
                                                    <div className={styles['email-input-wrap']}>
                                                        <TextBox
                                                            style={{ lineHeight: 'normal' }}
                                                            value={emailValue}
                                                            autoFocus={true}
                                                            selectOnFocus={[0, emailValue.length]}
                                                            onChange={this.updateEmailValue.bind(this)}
                                                        />
                                                        <IconGroup className={styles['actions']}>
                                                            <IconGroup.Item
                                                                code={'\uf00a'}
                                                                onClick={this.confirmEditEmail.bind(this)}
                                                            />
                                                            <IconGroup.Item
                                                                code={'\uf046'}
                                                                onClick={this.cancelEditEmail.bind(this)}
                                                            />
                                                        </IconGroup>
                                                    </div>) :
                                                    <div className={styles['field']}>
                                                        {emailValue ? <div className={styles['email-value']}><Text className={styles['email']}>{emailValue}</Text></div> : '---'}
                                                        <div className={styles['eidt-wrap']}>
                                                            <UIIcon
                                                                code="\uf085"
                                                                title={__('编辑')}
                                                                className={styles['edit-icon']}
                                                                onClick={this.handleEditEmail.bind(this)}
                                                            />
                                                        </div>
                                                    </div>
                                            }
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                            </FlexBox.Item>
                        </FlexBox>
                    </div>
                    <div className={styles['info-wrap']}>
                        <div className={styles['info-title']}>{__('配额空间')}</div>
                        <FlexBox>
                            <FlexBox.Item align="center top" width="380px">
                                <div className={styles['total']}>
                                    <p className={styles['pie-title']}>{__('账户总配额')} {formatSize(this.state.totalUsed)}/{formatSize(this.state.totalQuota)}</p>
                                    <div id="pie"></div>
                                </div>
                            </FlexBox.Item>
                            <FlexBox.Item align="left top">
                                <div className={styles['detail']}>
                                    {
                                        quotaStackDatas.map(function ({ doctype, docname, used, quota, background }) {
                                            return (
                                                <div className={styles['quota-part']}>
                                                    <div className={styles['quota-space-title']}>
                                                        <span>
                                                            {
                                                                doctype === 'userdoc' ?
                                                                    __('个人配额') : __('群组配额')
                                                            }
                                                        </span>
                                                        （
                                                        <div className={styles['docname']}><Text>{docname}</Text></div>
                                                        ）
                                                        <span> {formatSize(used)} / {formatSize(quota)}</span>
                                                    </div>
                                                    {
                                                        used > quota ? (
                                                            <StackBar width="500px" className={styles['stack-bar']}>
                                                                <StackBar.Stack
                                                                    className={styles['stack']}
                                                                    background="#e82828"
                                                                    rate={1}>
                                                                </StackBar.Stack>
                                                            </StackBar>
                                                        ) : (
                                                                <StackBar width="500px" className={styles['stack-bar']}>
                                                                    <StackBar.Stack
                                                                        className={styles['stack']}
                                                                        background={background}
                                                                        rate={used / quota}>
                                                                    </StackBar.Stack>
                                                                    <StackBar.Stack
                                                                        className={styles['stack']}
                                                                        background="#fff"
                                                                        rate={(quota - used) / quota}>
                                                                    </StackBar.Stack>
                                                                </StackBar>
                                                            )
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </FlexBox.Item>
                        </FlexBox>
                    </div>
                    {
                        errCode ? (
                            <MessageDialog
                                onConfirm={() => {
                                    this.setState({
                                        errCode: null
                                    })
                                }}
                            >
                                {getErrorMessage(errCode)}
                            </MessageDialog>
                        ) : null
                    }
                </div>
            )
        } else {
            return null;
        }

    }
}
