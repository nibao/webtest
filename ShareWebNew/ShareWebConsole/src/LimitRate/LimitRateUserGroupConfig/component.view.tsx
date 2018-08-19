import * as React from 'react';
import session from '../../../util/session/session';
import { CheckBoxOption, ValidateBox, Wizard, Text } from '../../../ui/ui.desktop';
import SearchDep from '../../SearchDep/component.desktop';
import OrganizationTree from '../../OrganizationTree/component';
import { NodeType } from '../../OrganizationTree/helper';
import UserAlreadyExist from '../UserAlreadyExist/component.view';
import { ValidateState, ValidateMessages, LimitRateType } from '../helper';
import LimitRateUserGroupConfigBase from './component.base';
import * as styles from './styles.view';
import __ from './locale';

export default class LimitRateUserGroupConfig extends LimitRateUserGroupConfigBase {
    render() {
        const {
            limitGroup,
            rateConfig,
            limitCheckStatus,
            validateState,
            groupExisted
        } = this.state;
        return (
            <div>
                <Wizard
                    title={this.props.limitRateInfo ? __('编辑') : __('添加')}
                    onCancel={() => this.cancelLimitRateConfig()}
                    onFinish={() => this.validateRate()}
                >
                    <Wizard.Step
                        title={__('第一步：选择部门')}
                        onBeforeLeave={() => this.checkUserGroupExisted()}
                        disabled={!limitGroup}
                    >
                        <div>
                            {
                                limitGroup ?
                                    <p className={styles['selected-group']}>
                                        <span>{__('已选：')}</span>
                                        <Text className={styles['group-selected']}>
                                            {
                                                limitGroup.name ||
                                                limitGroup.displayName ||
                                                limitGroup.departmentName ||
                                                (limitGroup.user && limitGroup.user.displayName)
                                            }
                                        </Text>
                                    </p>
                                    :
                                    <p className={styles['selected-group']}> {__('请选择部门：')}</p>
                            }
                            <div className={styles['organization-panel']}>
                                <div className={styles['search-box']}>
                                    <SearchDep
                                        width="100%"
                                        onSelectDep={value => { this.selectLimitGroup(value) }}
                                        userid={session.get('userid')}
                                        selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION, NodeType.USER]}
                                    />
                                </div>
                                <div className={styles['organization-tree']}>
                                    <OrganizationTree
                                        userid={session.get('userid')}
                                        selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION, NodeType.USER]}
                                        onSelectionChange={value => { this.selectLimitGroup(value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Wizard.Step>
                    <Wizard.Step title={__('第二步：设置总体最大传输速度')}>
                        <div className={styles['rate-config']}>
                            <Text className={styles['limit-object']}>
                                {
                                    limitGroup && (
                                        limitGroup.name ||
                                        limitGroup.displayName ||
                                        limitGroup.departmentName ||
                                        limitGroup.user && limitGroup.user.displayName
                                    )
                                }
                            </Text>
                            <span className={styles['limit-text']}>{__('的总体最大传输速度为：')}</span>
                            <div className={styles['limit-item']}>
                                <CheckBoxOption
                                    onChange={uploadState => this.handleCheckStateChange({ uploadState })}
                                    checked={limitCheckStatus.limitUploadCheckStatus}
                                >
                                    {__('上传速度：')}
                                </CheckBoxOption>
                                <ValidateBox
                                    className={styles['rate-input']}
                                    value={rateConfig.uploadRate}
                                    onChange={uploadRate => this.handleUploadRateChange(uploadRate)}
                                    validateState={validateState.uploadRate}
                                    validateMessages={ValidateMessages}
                                    disabled={!limitCheckStatus.limitUploadCheckStatus}
                                />
                                <span>KB/s</span>
                            </div>
                            <div className={styles['limit-item']}>
                                <CheckBoxOption
                                    onChange={downloadState => this.handleCheckStateChange({ downloadState })}
                                    checked={limitCheckStatus.limitDownloadCheckStatus}
                                >
                                    {__('下载速度：')}
                                </CheckBoxOption>
                                <ValidateBox
                                    className={styles['rate-input']}
                                    value={rateConfig.downloadRate}
                                    onChange={downloadRate => this.handleDownloadRateChange(downloadRate)}
                                    validateState={validateState.downloadRate}
                                    validateMessages={ValidateMessages}
                                    disabled={!limitCheckStatus.limitDownloadCheckStatus}
                                />
                                <span>KB/s</span>
                            </div>
                            {
                                validateState.limitState === ValidateState.NoLimit ?
                                    <span className={styles['warning']}>{__('请至少设置一种最大传输速度')}</span>
                                    : null
                            }
                        </div>
                    </Wizard.Step>
                </Wizard>
                {
                    groupExisted ?
                        <UserAlreadyExist
                            limitType={LimitRateType.LimitUserGroup}
                            userExisted={groupExisted}
                            onUserExistedConfirm={this.confirmUserAlreadyExist}
                        />
                        : null
                }
            </div>
        )
    }
}