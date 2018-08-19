import * as React from 'react';
import session from '../../../util/session/session';
import { CheckBoxOption, ValidateBox, Wizard } from '../../../ui/ui.desktop';
import OrganizationPick from '../../OrganizationPick/component.view';
import { NodeType } from '../../OrganizationTree/helper';
import LimitRateUserConfigBase from './component.base';
import { ValidateState, ValidateMessages, LimitRateType } from '../helper';
import UserAlreadyExist from '../UserAlreadyExist/component.view';
import * as styles from './styles.view';
import __ from './locale';

export default class LimitRateUserConfig extends LimitRateUserConfigBase {
    render() {
        const {
            limitUsers,
            rateConfig,
            limitCheckStatus,
            validateState,
            userAlreadyExisted
         } = this.state;
        return (
            <div>
                <Wizard
                    title={this.props.editLimitRateInfo ? __('编辑') : __('添加')}
                    onCancel={() => this.cancelLimitRateConfig()}
                    onFinish={() => this.validateRate()}
                >
                    <Wizard.Step
                        title={__('第一步：选择用户')}
                        onBeforeLeave={() => this.checkUserExisted()}
                        disabled={!this.state.limitUsers.length}
                    >
                        <OrganizationPick
                            userid={session.get('userid')}
                            selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION, NodeType.USER]}
                            data={limitUsers}
                            converterIn={this.convertData}
                            convererOut={this.convertDataOut}
                            onSelectionChange={value => { this.selectLimitUsers(value) }}
                        />
                    </Wizard.Step>
                    <Wizard.Step
                        title={__('第二步：设置个人最大传输速度')}
                    >
                        <div className={styles['rate-config']}>
                            <span className={styles['text']}>{__('所选用户的个人最大传输速度为：')}</span>
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
                </ Wizard>
                {
                    userAlreadyExisted.length ?
                        <UserAlreadyExist
                            limitType={LimitRateType.LimitUser}
                            userExisted={userAlreadyExisted}
                            onUserExistedConfirm={this.confirmUserAlreadyExist}
                        />
                        : null
                }
            </div>
        )
    }
}