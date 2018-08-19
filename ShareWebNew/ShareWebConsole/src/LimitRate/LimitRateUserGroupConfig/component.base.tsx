import * as React from 'react';
import { noop, values } from 'lodash';
import { ShareMgnt } from '../../../core/thrift/thrift';
import { positiveInteger } from '../../../util/validators/validators';
import { getNodeType, NodeType } from '../../OrganizationTree/helper';
import { ValidateState, LimitRateType } from '../helper';

export default class LimitRateUserGroupConfigBase extends React.Component<Components.LimitRateUserGroupConfig.Props, Components.LimitRateUserGroupConfig.State> {

    static defaultProps = {
        onCancelLimitRateConfig: noop,
        onConfirmLimitRateConfig: noop,
        editLimitRateInfo: null
    }

    state = {
        limitGroup: null,
        rateConfig: {
            uploadRate: '',
            downloadRate: ''
        },
        limitCheckStatus: {
            limitUploadCheckStatus: false,
            limitDownloadCheckStatus: false,
        },
        validateState: {
            uploadRate: ValidateState.Normal,
            downloadRate: ValidateState.Normal,
            limitState: ValidateState.Normal
        },
        groupExisted: null
    }

    componentDidMount() {
        const { editLimitRateInfo } = this.props;

        if (editLimitRateInfo) {
            const { rateConfig, limitCheckStatus } = this.state;

            this.setState({
                limitGroup: editLimitRateInfo.userInfos.length ?
                    { ...this.convertData(editLimitRateInfo.userInfos[0]), user: editLimitRateInfo.userInfos[0] } :
                    this.convertData(editLimitRateInfo.depInfos[0]),
                rateConfig: {
                    ...rateConfig,
                    uploadRate: editLimitRateInfo.uploadRate === -1 ? '' : editLimitRateInfo.uploadRate,
                    downloadRate: editLimitRateInfo.downloadRate === -1 ? '' : editLimitRateInfo.downloadRate
                },
                limitCheckStatus: {
                    ...limitCheckStatus,
                    limitUploadCheckStatus: editLimitRateInfo.uploadRate === -1 ? false : true,
                    limitDownloadCheckStatus: editLimitRateInfo.downloadRate === -1 ? false : true
                }
            })
        }
    }

    /**
     * 转换数据格式
     * @param data 
     */
    private convertData(data) {
        return {
            id: data.objectId,
            name: data.objectName,
        }
    }

    /**
     * 选择限速对象
     * @param group 用户组
     */
    protected selectLimitGroup(group) {
        this.setState({
            limitGroup: {
                ...group,
                id: group.id || group.departmentId,
                name: group.name || group.displayName || group.departmentName || (group.user && group.user.displayName),
                type: getNodeType(group)
            }
        })
    }

    /**
     * 执行下一步之前判断用户组是否已存在于列表中
     */
    protected async checkUserGroupExisted() {
        const { limitGroup } = this.state;

        if (!limitGroup) { // 未选择任何用户时不能执行下一步
            return false
        } else {
            const { userInfos, depInfos } = await ShareMgnt('Usrm_GetExistObjectInfo', [
                limitGroup.user || limitGroup.type === NodeType.USER ?
                    [{
                        'ncTLimitRateObject':
                            {
                                objectId: limitGroup.id,
                                objectName: limitGroup.name || limitGroup.displayName || limitGroup.departmentName || (limitGroup.user && limitGroup.user.displayName)
                            }
                    }]
                    : [],
                !limitGroup.user && limitGroup.type !== NodeType.USER ?
                    [{
                        'ncTLimitRateObject':
                            {
                                objectId: limitGroup.id,
                                objectName: limitGroup.name || limitGroup.displayName || limitGroup.departmentName || (limitGroup.user && limitGroup.user.displayName)
                            }
                    }]
                    : [],
                LimitRateType.LimitUserGroup,
                this.props.editLimitRateInfo ? this.props.editLimitRateInfo.id : ''
            ])

            this.setState({
                groupExisted: userInfos.length || depInfos.length ? { userInfos, depInfos } : null
            })
            return userInfos.length || depInfos.length ? false : true
        }
    }

    /**
     * 确认所选用户已存在
     */
    protected confirmUserAlreadyExist = () => {
        this.setState({
            groupExisted: null
        })
    }

    /**
     * 勾选/取消勾选限速复选框 
     */
    protected handleCheckStateChange(status = {}) {
        const { limitCheckStatus, rateConfig } = this.state;

        this.setState({
            validateState: {
                uploadRate: ValidateState.Normal,
                downloadRate: ValidateState.Normal,
                limitState: ValidateState.Normal
            },
            limitCheckStatus: {
                ...limitCheckStatus,
                limitUploadCheckStatus: 'uploadState' in status ? status.uploadState : limitCheckStatus.limitUploadCheckStatus,
                limitDownloadCheckStatus: 'downloadState' in status ? status.downloadState : limitCheckStatus.limitDownloadCheckStatus
            },
            rateConfig: {
                ...rateConfig,
                uploadRate: 'uploadState' in status ? '' : rateConfig.uploadRate,
                downloadRate: 'downloadState' in status ? '' : rateConfig.downloadRate
            }
        })
    }

    /**
     * 验证速度值
     */
    protected validateRate() {
        const { rateConfig, validateState, limitCheckStatus } = this.state;

        this.setState({
            validateState: {
                ...validateState,
                uploadRate: limitCheckStatus.limitUploadCheckStatus ?
                    rateConfig.uploadRate ?
                        positiveInteger(rateConfig.uploadRate) ?
                            Number(rateConfig.uploadRate) < 200 ?
                                ValidateState.LessThanMinimum
                                : ValidateState.Normal
                            : ValidateState.InvalidSpeed
                        : ValidateState.Empty
                    : validateState.uploadRate,
                downloadRate: limitCheckStatus.limitDownloadCheckStatus ?
                    rateConfig.downloadRate ?
                        positiveInteger(rateConfig.downloadRate) ?
                            ValidateState.Normal
                            : ValidateState.InvalidSpeed
                        : ValidateState.Empty
                    : validateState.downloadRate,
                limitState: !limitCheckStatus.limitUploadCheckStatus && !limitCheckStatus.limitDownloadCheckStatus ?
                    ValidateState.NoLimit
                    : ValidateState.Normal
            }
        }, () => {
            if (!(values(this.state.validateState).some(state => state !== ValidateState.Normal))) {
                this.confirmLimitRateConfig()
            }
        })
    }

    /**
     * 修改上传速度限制值
     */
    protected handleUploadRateChange(rate) {
        const { rateConfig, validateState } = this.state;

        this.setState({
            validateState: {
                ...validateState,
                uploadRate: ValidateState.Normal,
                limitState: ValidateState.Normal
            },
            rateConfig: {
                uploadRate: (!(/^[1-9]\d*$/.test(rate)) || rate.length > 5) ?
                    rate.substring(0, rate.length - 1)
                    : rate,
                downloadRate: rateConfig.downloadRate
            }
        })
    }

    /**
     * 修改下载速度限制值
     */
    protected handleDownloadRateChange(rate) {
        const { rateConfig, validateState } = this.state;

        this.setState({
            validateState: {
                ...validateState,
                downloadRate: ValidateState.Normal,
                limitState: ValidateState.Normal
            },
            rateConfig: {
                uploadRate: rateConfig.uploadRate,
                downloadRate: (!(/^[1-9]\d*$/.test(rate)) || rate.length > 5) ?
                    rate.substring(0, rate.length - 1)
                    : rate
            }
        })
    }

    /**
     * 将限速配置传出去
     */
    private confirmLimitRateConfig() {
        const { limitGroup } = this.state;

        this.props.onConfirmLimitRateConfig({
            id: this.props.editLimitRateInfo ? this.props.editLimitRateInfo.id : '',
            uploadRate: this.state.rateConfig.uploadRate ? Number(this.state.rateConfig.uploadRate) : -1,
            downloadRate: this.state.rateConfig.downloadRate ? Number(this.state.rateConfig.downloadRate) : -1,
            userInfos: limitGroup.user || limitGroup.type === NodeType.USER ?
                [{ objectId: limitGroup.id, objectName: limitGroup.name || limitGroup.displayName || limitGroup.departmentName || (limitGroup.user && limitGroup.user.displayName) }]
                : [],
            depInfos: !limitGroup.user && limitGroup.type !== NodeType.USER ?
                [{ objectId: limitGroup.id, objectName: limitGroup.name || limitGroup.displayName || limitGroup.departmentName || (limitGroup.user && limitGroup.user.displayName) }]
                : [],
            limitType: LimitRateType.LimitUserGroup
        })
    }

    /**
     * 取消本次操作
     */
    protected cancelLimitRateConfig() {
        this.setState({
            limitGroup: null
        }, () => {
            this.props.onCancelLimitRateConfig();
        })
    }
}