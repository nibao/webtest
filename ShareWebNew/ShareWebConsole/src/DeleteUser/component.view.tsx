import * as React from 'react';
import Dialog from '../../ui/Dialog/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import { getErrorTemplate, getErrorMessage } from '../../core/exception/exception';
import { Range, Status } from './component.base';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import DeleteUserBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class DeleteUser extends DeleteUserBase {

    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.status === Status.NORMAL ?
                        <ConfirmDialog onConfirm={this.confirmDeleteUsers.bind(this)} onCancel={this.props.onComplete} >
                            <div className={styles['select-dialog']}>
                                <label>{__('您将彻底删除 ')} </label>
                                <span style={{ 'vertical-align': 'middle', 'display': 'inline-block' }}>
                                    <Select
                                        value={this.state.selected}
                                        onChange={value => { this.onSelectedType(value) }}
                                        width={200}
                                        menu={{ width: 200 }}
                                    >
                                        {
                                            [Range.USERS, Range.DEPARTMENT, Range.DEPARTMENT_DEEP].filter((value) => {
                                                if ((this.props.dep.id === '-2' || this.props.dep.id === '-1') && value === Range.DEPARTMENT_DEEP) {
                                                    return false
                                                } else if (value === Range.USERS && !this.props.users.length) {
                                                    return false
                                                } else {
                                                    return true
                                                }
                                            }).map((value) => {

                                                return <Select.Option value={value} selected={this.state.selected === value}>
                                                    <Text>{
                                                        {
                                                            [Range.USERS]: __('当前选中用户'),
                                                            [Range.DEPARTMENT]: __('${name} 部门成员', { 'name': this.props.dep.name }),
                                                            [Range.DEPARTMENT_DEEP]: __('${name} 及其子部门成员', { 'name': this.props.dep.name })
                                                        }[value]
                                                    }</Text>
                                                </Select.Option>
                                            })
                                        }

                                    </Select>
                                </span>
                                <label>{__(' 的个人账号，确定执行此操作吗？')}</label>
                            </div>
                        </ConfirmDialog> :
                        null
                }

                {

                    this.state.status !== Status.NORMAL && this.state.status !== Status.LOADING ?
                        <MessageDialog onConfirm={() => { this.props.onComplete() }}>
                            {
                                this.getErrorMessage(this.state.status)
                            }
                        </MessageDialog> :
                        null
                }
                {
                    this.state.status === Status.LOADING ?
                        <ProgressCircle detail={__('正在删除用户，请稍候...')} /> :
                        null
                }


            </div>)
    }

    getErrorMessage(error) {
        switch (error) {
            case Status.CURRENT_USER_INCLUDED:
                return __('您无法删除自身账号。');
            case Status.HAS_UNCLOSED_DOC:
                return __('无法删除。您选中的用户仍有个人数据，请先关闭其个人文档，再执行此操作。');

            default:
                return getErrorMessage(error);
        }
    }
}