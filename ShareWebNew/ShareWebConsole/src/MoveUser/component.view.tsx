import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import OrganizationTree from '../OrganizationTree/component';
import { getErrorTemplate, getErrorMessage } from '../../core/exception/exception';
import { NodeType, getNodeType } from '../OrganizationTree/helper';
import { Status } from './component.base';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import { Range } from '../helper';
import MoveUserBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';


export default class MoveUser extends MoveUserBase {

    render() {
        return (
            <div className={styles['container']}>
                {
                    this.getTemplate(this.state.status)
                }
            </div>
        )
    }

    getTemplate(status) {
        switch (status) {
            case Status.NORMAL:
                return (
                    <Dialog
                        title={__('移动用户')}
                        buttons={[]}
                    >
                        <Panel>
                            <Panel.Main>
                                <div>
                                    <span> {__('您可以将 ')}</span>
                                    <span className={styles['select-panel']}>
                                        <Select value={this.state.selected} onChange={value => { this.onSelectedType(value) }} width={200} menu={{ width: 200 }}>
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
                                                            <Text>
                                                                {
                                                                    ({
                                                                        [Range.USERS]: __('当前选中用户'),
                                                                        [Range.DEPARTMENT]: __('${name} 部门成员', { 'name': this.props.dep.name }),
                                                                        [Range.DEPARTMENT_DEEP]: __('${name} 及其子部门成员', { 'name': this.props.dep.name })
                                                                    })[value]
                                                                }
                                                            </Text>
                                                        </Select.Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </span>
                                    <label>{__(' 移动至以下指定的部门下面：')}</label>
                                </div>
                                <div className={styles['dep-tree']}>
                                    <OrganizationTree
                                        userid={this.props.userid}
                                        selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION]}
                                        onSelectionChange={value => { this.selectDep(value) }}
                                        getNodeStatus={this.getDepartmentStatus.bind(this)}
                                    />
                                </div>
                            </Panel.Main>
                            <Panel.Footer>
                                <Panel.Button onClick={() => { this.confirmMoveUsers() }} disabled={!this.state.selectedDep}>
                                    {__('确定')}
                                </Panel.Button>
                                <Panel.Button onClick={() => { this.props.onComplete() }}>
                                    {__('取消')}
                                </Panel.Button>
                            </Panel.Footer>
                        </Panel>
                    </Dialog>
                )

            case Status.CHANGE_SITE:
                return (
                    <ConfirmDialog onConfirm={() => { this.confirmChangeSite() }} onCancel={() => { this.cancelChangeSite() }}>
                        {
                            __('您是否需要将已选用户的归属站点，调整为目标部门的归属站点“${depSiteName}”？', { depSiteName: this.state.selectedDep.siteInfo.name })
                        }
                    </ConfirmDialog>
                )
            case Status.LOADING:
                return (
                    <ProgressCircle detail={__('正在移动用户，请稍候……')} />
                )

            case Status.CURRENT_USER_INCLUDED:
                return (
                    <MessageDialog onConfirm={() => { this.props.onComplete() }}>
                        {__('您无法移动自身账号。')}
                    </MessageDialog>
                )
            case Status.DESTDEPARTMENT_NOT_EXIST:
                return (
                    <MessageDialog onConfirm={() => { this.props.onComplete() }}>
                        {
                            __('无法移动用户，您选中的目标部门 “${depName}” 已不存在，请重新选择。', { depName: this.state.selectedDep.name })
                        }
                    </MessageDialog>
                )
            default:
                return (
                    <MessageDialog onConfirm={() => { this.props.onComplete() }}>
                        {
                            getErrorMessage(status)
                        }
                    </MessageDialog>
                )

        }
    }
}