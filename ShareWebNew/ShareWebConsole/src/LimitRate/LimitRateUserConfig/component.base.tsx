import * as React from 'react';
import { noop, values, reduce } from 'lodash';
import { ShareMgnt } from '../../../core/thrift/thrift';
import { positiveInteger } from '../../../util/validators/validators';
import WebComponent from '../../webcomponent';
import { NodeType } from '../../OrganizationTree/helper';
import { ValidateState, LimitRateType } from '../helper';

export default class LimitRateUserConfigBase extends WebComponent<Components.LimitRateUserConfig.Props, Components.LimitRateUserConfig.State> {

    static defaultProps = {
        onCancelLimitRateConfig: noop,
        onConfirmLimitRateConfig: noop,
        editLimitRateInfo: null
    }

    state = {
        limitUsers: [],
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
        userAlreadyExisted: []
    }

    componentDidMount() {
        if (this.props.editLimitRateInfo) {
            const { editLimitRateInfo } = this.props;
            const { rateConfig, limitCheckStatus } = this.state;

            this.setState({
                limitUsers: [
                    ...reduce(this.props.editLimitRateInfo.userInfos, (pre, user) => [...pre, { ...user, type: NodeType.USER }], []),
                    ...reduce(this.props.editLimitRateInfo.depInfos, (pre, dep) => [...pre, { ...dep, type: NodeType.DEPARTMENT }], [])
                ],
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
     * 转入前先转换数据格式
     * @param data 
     */
    protected convertData = (data) => {
        return {
            id: data.objectId,
            name: data.objectName,
            type: data.type
        }
    }

    /**
     * 转出数据时转换数据格式
     */
    protected convertDataOut = (data) => {
        return {
            objectId: data.id,
            objectName: data.name || data.displayName || data.departmentName || (data.user && data.user.displayName),
            type: data.type
        }
    }

    /**
     * 选择限速对象
     * @param users 用户
     */
    selectLimitUsers(users) {
        this.setState({
            limitUsers: users
        })
    }

    /**
     * 判断用户是否已存在于列表中
     */
    protected async checkUserExisted() {
        if (!this.state.limitUsers.length) {
            return false
        } else {
            const { userInfos, depInfos } = await ShareMgnt('Usrm_GetExistObjectInfo', [
                reduce(this.state.limitUsers, (pre, { objectId, objectName, type }) =>
                    type === NodeType.USER ?
                        [...pre, { 'ncTLimitRateObject': { objectId, objectName } }]
                        : pre,
                    []),
                reduce(this.state.limitUsers, (pre, { objectId, objectName, type }) =>
                    type === NodeType.DEPARTMENT || type === NodeType.ORGANIZATION ?
                        [...pre, { 'ncTLimitRateObject': { objectId, objectName } }]
                        : pre,
                    []),
                LimitRateType.LimitUser,
                this.props.editLimitRateInfo ? this.props.editLimitRateInfo.id : ''
            ])
            this.setState({
                userAlreadyExisted: [...userInfos, ...depInfos]
            })
            return userInfos.length || depInfos.length ? false : true
        }
    }

    /**
     * 确认所选用户已存在
     */
    protected confirmUserAlreadyExist = () => {
        this.setState({
            userAlreadyExisted: []
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
                uploadRate: 'uploadState' in status ? !status.uploadState ? '' : '500' : rateConfig.uploadRate,
                downloadRate: 'downloadState' in status ? !status.downloadState ? '' : '500' : rateConfig.downloadRate
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
        this.props.onConfirmLimitRateConfig({
            id: this.props.editLimitRateInfo ? this.props.editLimitRateInfo.id : '',
            uploadRate: this.state.rateConfig.uploadRate ? Number(this.state.rateConfig.uploadRate) : -1,
            downloadRate: this.state.rateConfig.downloadRate ? Number(this.state.rateConfig.downloadRate) : -1,
            userInfos: reduce(this.state.limitUsers, (pre, { objectId, objectName, type }) =>
                type === NodeType.USER ?
                    [...pre, { objectId, objectName }]
                    : pre,
                []),
            depInfos: reduce(this.state.limitUsers, (pre, { objectId, objectName, type }) =>
                type === NodeType.DEPARTMENT || type === NodeType.ORGANIZATION ?
                    [...pre, { objectId, objectName }]
                    : pre,
                []),
            limitType: LimitRateType.LimitUser
        })
    }

    /**
     * 取消本次操作
     */
    protected cancelLimitRateConfig = () => {
        this.setState({
            limitUsers: []
        }, () => {
            this.props.onCancelLimitRateConfig();
        })
    }
}