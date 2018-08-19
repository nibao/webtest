import * as React from 'react';
import Dialog from '../../ui/Dialog/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import { getErrorTemplate, getErrorMessage } from '../../core/exception/exception';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import { Range } from '../helper';
import DisableUserBase from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.view.css';
import ErrorMessage from './ErrorMessage/component.view';

export default class DisableUser extends DisableUserBase {

    render() {
        return (
            <div>
                {
                    this.state.status === Status.NORMAL ?
                        <ConfirmDialog
                            onConfirm={this.confirmDisableUsers.bind(this)}
                            onCancel={this.props.onComplete} >
                            <div className={styles['select-dialog']}>
                                <label>{__('您将禁用 ')} </label>
                                <div className={styles['select-item']}>
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

                                                return (
                                                    <Select.Option value={value} selected={this.state.selected === value}>
                                                        <Text>{
                                                            {
                                                                [Range.USERS]: __('当前选中用户'),
                                                                [Range.DEPARTMENT]: __('${name} 部门成员', { 'name': this.props.dep.name }),
                                                                [Range.DEPARTMENT_DEEP]: __('${name} 及其子部门成员', { 'name': this.props.dep.name })
                                                            }[value]
                                                        }</Text>
                                                    </Select.Option>
                                                )
                                            })
                                        }

                                    </Select>
                                </div>
                                <label>{__(' 的个人账号，确定要执行此操作吗？')}</label>
                            </div>
                        </ConfirmDialog> :
                        null
                }

                {

                    this.state.status !== Status.NORMAL && this.state.status !== Status.LOADING ?
                        <ErrorMessage errorType={this.state.status} onConfirm={this.props.onComplete} /> :
                        null
                }
                {
                    this.state.status === Status.LOADING ?
                        <ProgressCircle detail={__('正在禁用用户，请稍候……')} /> :
                        null
                }


            </div>)
    }
}