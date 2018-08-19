import * as React from 'react';
import { noop, includes, values } from 'lodash';
import { getAllAuditorInfos, getAllProcessInfo, searchAuditor, createProcess, convertDocName, editProcess } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import { NodeType, getNodeType } from '../OrganizationTree/helper';
import __ from './locale';
import { getCurrentAuditModel } from './helper';

/**
 * 文档审核模式
 */
export enum ncTDocAuditType {
    /**
     * 同级审核，一个人审核通过即可
     */
    NCT_DAT_ONE = 1,

    /**
     *  汇签审核，全部通过才算通过
     */
    NCT_DAT_ALL = 2,

    /**
     * 逐级审核，一级一级通过
     */
    NCT_DAT_LEVEL = 3,

    /**
     * 免审核
     */
    NCT_DAT_FREE = 4
}

export enum AccessorType {
    /**
     * 用户
     */
    User = 1,

    /**
     * 部门
     */
    Organization = 2
}

export enum DialogStatus {
    /**
     * 没有任何弹窗
     */
    None,

    /**
     * 用户未选择审核员
     */
    SelectedAccessorInfosEmpty,

    /**
     * 用户未选择适用范围
     */
    applicativeRangeResultEmpyt,

    /**
     * 汇签审核、逐级审核 审核模式下,审核员数量少于两位则给出警告提示弹窗
     */
    AccessorCountTips,

    /**
     *  创建流程报错
     */
    CreateError,

    /**
     * 编辑流程报错
     */
    EditError,
}

export enum FlowNameValidateStatus {
    /**
     * 合法
     */
    None,

    /**
     * 输入为空
     */
    Empty,

    /**
     * 名称不合法
     */
    NameIllegal,

    /**
     * 名称已存在
     */
    NameAlreadyExist,
}

export enum FileLocationStatus {
    /**
     * 合法
     */
    None,

    /**
     * 输入为空
     */
    Empty,
}

export enum ApplicativeRangeResultStatus {
    /**
     * 合法
     */
    None,

    /**
     * 用户选择的适用范围为空
     */
    Empty,
}

export default class FileFlowBase extends WebComponent<Console.FileFlow.Props, Console.FileFlow.State> {
    static defaultProps = {
        onCreateFlowCancel: noop,
        selectType: [NodeType.ORGANIZATION, NodeType.DEPARTMENT, NodeType.USER],
        process: []
    }

    state = {
        flowName: '',
        errMsg: '',
        fileLocationFormGns: '',
        auditModel: 'one',
        fileLocation: [],
        accessorSearchResult: [],
        allAccessorInfos: [],
        selectedAccessorInfos: [],
        applicativeRangeResult: [],
        allProcessInfo: [],
        fileLocationStatus: FileLocationStatus.None,
        dialogStatus: DialogStatus.None,
        flowNameValidateStatus: FlowNameValidateStatus.None,
        isPickingDest: false,
    }

    async componentWillMount() {
        this.initCreateFlowInfo()
        this.setState({
            allAccessorInfos: await getAllAuditorInfos(),
            allProcessInfo: await getAllProcessInfo([this.props.userid])
        })
    }

    /**
     * 在浏览组件中点击确定触发事件
     * @param path 文件路径
     */
    protected async onBrowseConfirm(path) {
        this.setState({
            fileLocation: path,
            isPickingDest: false,
            fileLocationStatus: FileLocationStatus.None,
            fileLocationFormGns: path[0].docId ?
                await convertDocName([path[0].docId]) : await convertDocName([path[0].gns]),
        })
    }

    /**
     * 点击编辑按钮时,初始化创建流程的信息
     */
    private initCreateFlowInfo() {
        // 编辑流程状态下初始化数据
        if (values(this.props.process).length !== 0) {
            this.setState({
                flowName: this.props.process.name,
                fileLocation: [{ docId: this.props.process.destDocId }],
                fileLocationFormGns: this.props.process.destDocName,
                auditModel: this.getAuditModel(this.props.process.auditType),
                selectedAccessorInfos: this.getSelectedAccessorInfos(),
                applicativeRangeResult: this.getApplicativeRangeResult(),
            })
        }
    }

    /**
     * 编辑时,获得已经被选择的审核员的 displayName
     */
    private getSelectedAccessorInfos() {
        return this.props.process.auditorNames.map((name, index) => {
            return {
                displayName: name,
                id: this.props.process.auditorIds[index]
            }
        })
    }

    /**
     * 编辑时,获得已经被选择的适用范围
     */
    private getApplicativeRangeResult() {
        return this.props.process.accessorInfos
    }

    /**
     * 根据编辑时的 auditType 获取到 auditModel
     */
    private getAuditModel(auditType) {
        switch (auditType) {
            case 1:
                return 'one'
            case 2:
                return 'all'
            case 3:
                return 'level'
        }
    }

    /**
     * 在浏览组件中点击取消触发事件
     */
    protected onBrowseCancel() {
        this.setState({
            isPickingDest: false,
        })
    }

    /**
     * 取消创建流程
     */
    protected cancelCreateFlow() {
        this.props.cancelSetFlow()
    }

    /**
     * 更新文档组织树
     */
    protected updateDocTree() {
        this.setState({
            isPickingDest: true,
        })
    }

    /**
     * 更改定义流程中流程名称触发事件
     */
    protected changeFlowName(value) {
        this.setState({
            flowName: value,
            flowNameValidateStatus: FlowNameValidateStatus.None,
        })
    }

    /**
     * 更改流程审核模式
     * @param auditModel 流程审核模式
     */
    protected updateAuditModel(auditModel) {
        this.setState({
            auditModel,
        })
    }

    /**
     * 选择审核员
     * @param allAccessorInfo 当前所选择的审核员信息
     */
    protected selectAccessor(accessorInfo) {
        if (!(this.state.selectedAccessorInfos.map(info => info.displayName)
            .includes(accessorInfo.displayName))) {
            this.setState({
                selectedAccessorInfos: [...this.state.selectedAccessorInfos, accessorInfo]
            })
        }
        this.refs.autocomplete.toggleActive(false);
    }

    /**
     * 删除已经被选择的审核员
     * @param selectedAccessorInfo 当前被删除的审核员信息
     */
    protected deleteSelectedAccessor(selectedAccessorInfo) {
        let selectedAccessorInfos = this.state.selectedAccessorInfos.filter(info => info.displayName !== selectedAccessorInfo.displayName)

        this.setState({
            selectedAccessorInfos,
        })
    }

    /**
     * 更新用审核员关键字查找到的审核员信息
     */
    getAccessorInfosByKey(key: string): PromiseLike<Array<Object>> {
        if (key) {
            return searchAuditor([key])
        } else {
            return null
        }
    }

    /**
     * 加载根据关键字搜索出来的搜索框列表
     */
    protected getAccessorSearchResultByKey(data) {
        this.setState({
            accessorSearchResult: data
        })
    }

    /**
     * 清空别选择的审核员信息
     */
    protected emptySelectedAccessor() {
        this.setState({
            selectedAccessorInfos: [],
        })
    }

    /**
     * 更新使用范围列表选出来的适用范围
     */
    protected updateApplicativeRangeResult(value) {
        if (!(this.state.applicativeRangeResult.map(range => range.id || range.departmentId).includes(value.id || value.departmentId))) {
            this.setState({
                applicativeRangeResult: [...this.state.applicativeRangeResult, value]
            })
        }
    }

    /**
     * 删除已经选择的适用范围
     */
    protected deleteApplicativeRangeResult(deletedRange: Array<object>) {
        this.setState({
            applicativeRangeResult: this.state.applicativeRangeResult.filter(range => {
                return (deletedRange.id || deletedRange.departmentId) !== (range.id || range.departmentId)
            })
        })
    }

    /**
     * 清空已经被用户选择的适用范围
     */
    protected emptyApplicativeRangeResult() {
        this.setState({
            applicativeRangeResult: [],
        })
    }

    /**
     * 在搜索框中选择搜索出来的内容时触发事件
     */
    protected updateApplicativeRangeResultBySearch(value) {
        if (!(
            this.state.applicativeRangeResult.map((range) => range.departmentId || range.id).includes(value.departmentId || value.id)
        )) {
            this.setState({
                applicativeRangeResult: [...this.state.applicativeRangeResult, value]
            })
        }
    }

    /**
     * 关闭弹窗
     */
    protected closeDialog() {
        this.setState({
            dialogStatus: DialogStatus.None,
        })
    }

    /**
     * 创建流程完成
     */
    protected async completeCreateFlow() {
        // 用户选择的适用范围不为空时
        if (this.state.applicativeRangeResult.length !== 0) {
            let param = {
                processId: this.props.process ? this.props.process.processId : '',
                name: this.state.flowName,
                auditType: this.getAuditType(this.state.auditModel),
                auditorIds: this.state.selectedAccessorInfos.map(info => info.id),
                destDocId: this.state.fileLocation[0].docId ? this.state.fileLocation[0].docId
                    : this.state.fileLocation[0].gns,
                creatorId: this.props.userid,
                status: true,
                auditorNames: this.state.selectedAccessorInfos.map(info => info.displayName),
                creatorName: this.props.username,
                destDocName: this.state.fileLocationFormGns,
                accessorInfos: this.getAccessorInfos()
            }
            // 当前状态为创建流程
            if (values(this.props.process).length === 0) {
                try {
                    param.processId = await createProcess([param])
                    this.props.onCreateFlowSuccess({ ...param, accessorInfos: param.accessorInfos.map(value => value.ncTAccessorInfo) })
                    manageLog(
                        ManagementOps.CREATE,
                        __('创建 文档流程“${flowName}” 成功', {
                            'flowName': param.name
                        }),
                        __('最终保存位置：${destDocName}，审核模式：${auditModel}，审核员：${auditorNames}，适用范围：${accessorName}', {
                            destDocName: param.destDocName,
                            auditModel: getCurrentAuditModel(this.state.auditModel),
                            auditorNames: param.auditorNames.join('，'),
                            accessorName: this.getAccessorName()
                        }),
                        Level.INFO
                    )
                } catch (ex) {
                    this.setState({
                        dialogStatus: DialogStatus.CreateError,
                        errMsg: ex.error.errMsg,
                    })
                }
            } else {
                // 当前状态为编辑流程
                try {
                    await editProcess([param, this.props.userid])
                    this.props.onEditFlowSuccess({ ...param, accessorInfos: param.accessorInfos.map(value => value.ncTAccessorInfo) })
                    manageLog(
                        ManagementOps.SET,
                        __('编辑 文档流程“${flowName}” 成功', {
                            'flowName': param.name
                        }),
                        __('最终保存位置：${destDocName}，审核模式：${auditModel}，审核员：${auditorNames}，适用范围：${accessorName}', {
                            destDocName: param.destDocName,
                            auditModel: getCurrentAuditModel(this.state.auditModel),
                            auditorNames: param.auditorNames.join('，'),
                            accessorName: this.getAccessorName()
                        }),
                        Level.INFO
                    )
                } catch (ex) {
                    this.setState({
                        dialogStatus: DialogStatus.EditError,
                        errMsg: ex.error.errMsg,
                    })
                }
            }
        } else {
            this.setState({
                dialogStatus: DialogStatus.applicativeRangeResultEmpyt
            })
        }
    }

    /**
     * 获得适用范围名称 获得适用范围名称
     */
    private getAccessorName() {
        let range: Array<string> | null = this.state.applicativeRangeResult.length !== 0 ?
            this.state.applicativeRangeResult.map((range) => {
                return range.name
                    || range.departmentName
                    || range.displayName
                    || range.user.displayName
            })
            : null
        return (range && range.length !== 0) ? range.join('，') : ''
    }

    /**
     * 获取文档审核模式
     */
    private getAuditType(auditModel) {
        switch (auditModel) {
            case 'one':
                return ncTDocAuditType.NCT_DAT_ONE
            case 'all':
                return ncTDocAuditType.NCT_DAT_ALL
            case 'level':
                return ncTDocAuditType.NCT_DAT_LEVEL
        }
    }

    /**
     * 获得访问者类型
     */
    private getAccessorType(range) {
        let Rangetype = getNodeType(range)
        return Rangetype === NodeType.ORGANIZATION
            || Rangetype === NodeType.DEPARTMENT ?
            AccessorType.Organization
            : AccessorType.User
    }

    /**
     * 获得流程使用范围，限定哪些部门，哪些人可以看到该流程
     */
    private getAccessorInfos() {
        // 新建流程状态下
        if (values(this.props.process).length === 0) {
            return this.state.applicativeRangeResult.length ?
                this.state.applicativeRangeResult.map((range) => {
                    let ncTAccessorInfo = {
                        id: range.id
                            || range.departmentId,
                        type: this.getAccessorType(range),
                        name: range.name
                            || range.departmentName
                            || range.displayName
                            || range.user.displayName
                    }
                    return { 'ncTAccessorInfo': ncTAccessorInfo }
                })
                : null
            // 编辑流程状态下
        } else {
            return this.state.applicativeRangeResult.map((range) => {
                let ncTAccessorInfo = {
                    id: range.id
                        || range.departmentId,
                    type: range.type || this.getAccessorType(range),
                    name: range.name
                        || range.departmentName
                        || range.displayName
                        || range.user.displayName
                }
                return { 'ncTAccessorInfo': ncTAccessorInfo }
            })
        }
    }

    /**
     * 判断流程名称是否合法
     * 在第一步点击下一步时触发该函数
     */
    protected isFlowNameLegal() {
        return /^[^\/\\:*?"<>|]+$/.test(this.state.flowName);
    }

    /**
     * 判断流程名称是否已经存在
     * 在第一步点击下一步时触发该函数
     */
    protected async isFlowNameExist() {
        let processInfos = await getAllProcessInfo([this.props.userid])
        return processInfos.some(info => info.name === this.state.flowName)
    }

    /**
     * 验证流程名称和流程保存位置
     */
    protected async getNameLocationValidate() {
        let isFlowNameExistTemp = await this.isFlowNameExist()
        if (!(await this.isNameLocationValidate(isFlowNameExistTemp))) {
            if (!this.isFlowNameLegal()) {
                this.state.flowName === '' ?
                    this.setState({
                        flowNameValidateStatus: FlowNameValidateStatus.Empty
                    })
                    : this.setState({
                        flowNameValidateStatus: FlowNameValidateStatus.NameIllegal
                    })
            } else if (values(this.props.process).length === 0) {
                if (isFlowNameExistTemp) {
                    this.setState({
                        flowNameValidateStatus: FlowNameValidateStatus.NameAlreadyExist,
                    })
                }
            }
            if (this.state.fileLocationFormGns === '') {
                this.setState({
                    fileLocationStatus: FileLocationStatus.Empty,
                })
            }
            return false
        }
    }

    /**
     * 验证流程名称和文档保存路径是否合法
     */
    private async isNameLocationValidate(isFlowNameExistTemp) {
        if (values(this.props.process).length === 0) {
            if (this.isFlowNameLegal()
                && !isFlowNameExistTemp
                && (this.state.fileLocationFormGns !== '')) {
                return true
            } else {
                return false
            }
        }

        if (values(this.props.process).length !== 0) {
            if (this.isFlowNameLegal()
                && (this.state.fileLocationFormGns !== '')) {
                return true
            } else {
                return false
            }
        }
    }

    /**
     * 验证汇签审核、逐级审核 两种审核模式下,审核员数量是否足够
     * 在选择审核模式时点击下一步时触发
     */
    private isAccessorCountEnough() {
        if (this.state.auditModel !== 'one' && this.state.selectedAccessorInfos.length < 2) {
            this.setState({
                dialogStatus: DialogStatus.AccessorCountTips
            })
            return false
        }
        return true
    }

    /**
     * 验证被用户选择的审核员信息
     */
    protected isSelectedAccessorInfosValidate() {
        if (this.state.selectedAccessorInfos.length !== 0) {
            return this.isAccessorCountEnough()
        } else {
            this.setState({
                dialogStatus: DialogStatus.SelectedAccessorInfosEmpty
            })
            return false
        }
    }
}