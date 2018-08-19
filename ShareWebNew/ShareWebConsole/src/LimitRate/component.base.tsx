import * as React from 'react';
import { reduce } from 'lodash';
import { ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import { LimitRateType } from './helper';
import __ from './locale';

export default class LimitRateBase extends WebComponent<Components.LimitRate.Props, any> {
    static defaultProps = {
    }

    state = {
        limitRateStatus: false,
        limitRateType: LimitRateType.LimitUser,
        showLimitRateConfigDialog: false,
        searchKey: '',
        limitRateInfo: [],
        count: 0,
        page: 1,
        errorInfo: null,
        loading: false
    }

    /**
     * 默认分页条数
     */
    defaultPageSize = 200;

    /**
     * 当前正在编辑的一条限速配置
     */
    limitRateInEdit = null;

    async componentWillMount() {
        this.setState({
            loading: true
        })
        try {
            const { isEnabled, limitType } = await ShareMgnt('Usrm_GetLimitRateConfig', []);
            this.setState({
                limitRateStatus: isEnabled,
                limitRateType: limitType
            }, async () => {
                const [limitRateInfo, count] = await this.getLimitRateInfo({})
                this.setState({
                    count,
                    limitRateInfo
                })
            })
        } catch (ex) {
            this.setState({
                errorInfo: {
                    errCode: ex.error.errID,
                    errMsg: ex.error.errMsg
                }
            })
        } finally {
            this.setState({
                loading: false
            })
        }
    }

    /**
     * 获取限速配置信息
     */
    private getLimitRateInfo({ key = '', page = 1 }) {
        return key ?
            Promise.all([
                ShareMgnt('Usrm_SearchLimitRateInfoByPage', [
                    key,
                    (page - 1) * this.defaultPageSize,
                    this.defaultPageSize,
                    this.state.limitRateType
                ]), // 搜索限速信息
                ShareMgnt('Usrm_SearchLimitRateInfoCnt', [key, this.state.limitRateType]) // 搜索限速信息总数
            ])
            :
            Promise.all([
                ShareMgnt('Usrm_GetLimitRateInfoByPage', [(page - 1) * this.defaultPageSize, this.defaultPageSize, this.state.limitRateType]), // 分页获取限速信息
                ShareMgnt('Usrm_GetLimitRateInfoCnt', [this.state.limitRateType]) // 获取限速信息总数
            ])
    }

    /**
     * 限速用户/部门列表项显示名称
     */
    protected makeUsersName = function (data) {
        return reduce([...data.depInfos, ...data.userInfos], (pre, item, index) =>
            `${pre}${pre === '' || index === (data.depInfos.length + data.userInfos.length) ? '' : ','}${item.objectName}`, '')
    }

    /**
     * 设置限速配置开关状态
     */
    private async setLimitRateConfig({ isEnabled = this.state.limitRateStatus, limitType = this.state.limitRateType }) {
        try {
            await ShareMgnt('Usrm_SetLimitRateConfig', [{ 'ncTLimitRateConfig': { isEnabled, limitType } }]);
            manageLog(
                ManagementOps.SET,
                __('${status} 指定${type}网速限制', {
                    'status': isEnabled ? __('启用') : __('关闭'),
                    'type': limitType === LimitRateType.LimitUser ? __('用户个人') : __('部门总体')
                }),
                '',
                Level.INFO
            )
        } catch (ex) {
            this.setState({
                errorInfo: {
                    errCode: ex.error.errID,
                    errMsg: ex.error.errMsg
                }
            })
        }
    }

    /**
     * 改变限速类型
     * @param type 限速类型
     */
    protected changeLimitType(type) {
        this.setLimitRateConfig({ limitType: type });
        this.setState({
            loading: true,
            limitRateType: type
        }, async () => {
            // 重新获取限速配置信息
            const [limitRateInfo, count] = await this.getLimitRateInfo({ key: this.state.searchKey });
            this.setState({
                count,
                limitRateInfo,
                loading: false
            })
        })
    }

    /**
     * 改变网速限制开关状态
     */
    protected handleLimitStateChange(limitRateStatus) {
        this.setLimitRateConfig({ isEnabled: limitRateStatus });
        this.setState({
            limitRateStatus
        })
    }

    protected changeLimitState = () => {
        this.setLimitRateConfig({ isEnabled: !this.state.limitRateStatus });
        this.setState({
            limitRateStatus: !this.state.limitRateStatus
        })
    }

    /**
     * 改变搜索关键字
     */
    protected changeSearchKey = (key: string) => {
        this.setState({ searchKey: key });
    }

    /**
     * 搜索限速信息方法
     */
    protected searchLimitRateInfo = async (key: string) => {
        this.setState({
            loading: true
        })
        const [limitRateInfo, count] = await this.getLimitRateInfo({ key });
        this.setState({ count });
        return limitRateInfo;
    }

    /**
     * 载入搜索结果
     */
    protected loadSearchResult(data: Array<Core.ShareMgnt.ncTLimitRateInfo>) {
        this.setState({
            limitRateInfo: data,
            page: 1,
            loading: false
        });
    }

    /**
     * 翻页时触发
     * @param page 页码
     */
    protected async handlePageChange(page: number) {
        this.setState({
            loading: true
        })
        const [limitRateInfo, count] = await this.getLimitRateInfo({ key: this.state.searchKey, page });

        this.setState({
            page,
            limitRateInfo,
            count,
            loading: false
        })
    }

    /**
     * 添加网速限制配置信息
     */
    protected addLimitRateInfo = () => {
        this.setState({
            showLimitRateConfigDialog: true
        })
    }

    /**
     * 编辑网速限制配置信息
     */
    protected editLimitRateInfo(data) {
        this.setState({
            showLimitRateConfigDialog: true
        })
        this.limitRateInEdit = data
    }

    /**
     * 删除网速限制配置信息
     */
    protected async deleteLimitRateInfo(data) {
        const { limitRateInfo, limitRateType, count } = this.state;

        try {
            // 删除一条限速信息
            await ShareMgnt('Usrm_DeleteLimitRateInfo', [data.id, limitRateType]);
            this.setState({
                limitRateInfo: limitRateInfo.filter(item => item.id !== data.id),
                count: count - 1
            })
            manageLog(
                ManagementOps.SET,
                __('取消了 “${limitUsersName}” 的${limitType}限速：上传 ${uploadrate}，下载 ${downloadrate}。',
                    {
                        'limitUsersName': this.makeUsersName(data),
                        'limitType': limitRateType === LimitRateType.LimitUser ? __('个人') : __('总体'),
                        'uploadrate': data.uploadRate === -1 ? __('不限制') : `${data.uploadRate}KB/s`,
                        'downloadrate': data.downloadRate === -1 ? __('不限制') : `${data.downloadRate}KB/s`
                    }
                ),
                '',
                Level.INFO
            )
        } catch (ex) {
            this.setState({
                errorInfo: {
                    errCode: ex.error.errID,
                    errMsg: ex.error.errMsg
                }
            })
        }
    }

    /**
     * 个人最大网速/部门总体网速限制配置
     */
    protected handleConfirmLimitRateConfig = async (limitRateConfig) => {
        const { limitRateInfo, count } = this.state;

        this.setState({
            showLimitRateConfigDialog: false
        })

        if (limitRateConfig.id === '') { // 添加一条限速信息
            try {
                const limitRateId = await ShareMgnt('Usrm_AddLimitRateInfo', [{
                    'ncTLimitRateInfo': {
                        ...limitRateConfig,
                        userInfos: limitRateConfig.userInfos.length ?
                            reduce(limitRateConfig.userInfos,
                                (pre, user) => [...pre, { 'ncTLimitRateObject': { objectId: user.objectId, objectName: user.objectName } }], [])
                            : [],
                        depInfos: limitRateConfig.depInfos.length ?
                            reduce(limitRateConfig.depInfos,
                                (pre, dep) => [...pre, { 'ncTLimitRateObject': { objectId: dep.objectId, objectName: dep.objectName } }], [])
                            : []
                    }
                }]);
                // 更新列表 ，新添的记录位于第一条
                this.setState({
                    limitRateInfo: [
                        {
                            ...limitRateConfig,
                            id: limitRateId
                        },
                        ...limitRateInfo
                    ],
                    count: count + 1
                })
                manageLog(
                    ManagementOps.SET,
                    __('设置了 “${limitUsersName}” 的${limitType}限速：上传 ${uploadrate}，下载 ${downloadrate}。',
                        {
                            'limitUsersName': this.makeUsersName(limitRateConfig),
                            'limitType': limitRateConfig.limitType === LimitRateType.LimitUser ? __('个人') : __('总体'),
                            'uploadrate': limitRateConfig.uploadRate === -1 ? __('不限制') : `${limitRateConfig.uploadRate}KB/s`,
                            'downloadrate': limitRateConfig.downloadRate === -1 ? __('不限制') : `${limitRateConfig.downloadRate}KB/s`,
                        }
                    ),
                    '',
                    Level.INFO
                )
            } catch (ex) {
                this.setState({
                    errorInfo: {
                        errCode: ex.error.errID,
                        errMsg: ex.error.errMsg
                    }
                })
            } finally {
                this.limitRateInEdit = null;
            }
        } else { // 编辑一条限速信息
            try {
                await ShareMgnt('Usrm_EditLimitRateInfo', [
                    {
                        'ncTLimitRateInfo': {
                            ...limitRateConfig,
                            userInfos: limitRateConfig.userInfos.length ?
                                reduce(limitRateConfig.userInfos,
                                    (pre, user) => [...pre, { 'ncTLimitRateObject': { objectId: user.objectId, objectName: user.objectName } }], [])
                                : [],
                            depInfos: limitRateConfig.depInfos.length ?
                                reduce(limitRateConfig.depInfos,
                                    (pre, dep) => [...pre, { 'ncTLimitRateObject': { objectId: dep.objectId, objectName: dep.objectName } }], [])
                                : []
                        }
                    }
                ]);
                // 更新列表
                const [limitRateInfo, count] = await this.getLimitRateInfo({ key: this.state.searchKey, page: this.state.page });
                this.setState({
                    limitRateInfo,
                    count
                })
                manageLog(
                    ManagementOps.SET,
                    __('设置了 “${limitUsersName}” 的${limitType}限速：上传 ${uploadrate}，下载 ${downloadrate}。',
                        {
                            'limitUsersName': this.makeUsersName(limitRateConfig),
                            'limitType': limitRateConfig.limitType === LimitRateType.LimitUser ? __('个人') : __('总体'),
                            'uploadrate': limitRateConfig.uploadRate === -1 ? __('不限制') : `${limitRateConfig.uploadRate}KB/s`,
                            'downloadrate': limitRateConfig.downloadRate === -1 ? __('不限制') : `${limitRateConfig.downloadRate}KB/s`
                        }
                    ),
                    '',
                    Level.INFO
                )
            } catch (ex) {
                this.setState({
                    errorInfo: {
                        errCode: ex.error.errID,
                        errMsg: ex.error.errMsg
                    }
                })
            } finally {
                this.limitRateInEdit = null;
            }
        }
    }

    /**
     * 取消网速限制配置操作
     */
    protected handleCancelLimitRateConfig = () => {
        this.setState({
            showLimitRateConfigDialog: false
        })
        this.limitRateInEdit = null;
    }

    /**
     * 错误信息弹窗confirm事件
     */
    protected confirmErrMsg = () => {
        this.setState({
            errorInfo: null
        })
    }
}