import * as React from 'react';
import { QuarantineState, getIllegalFileList, getFileVersionList, getIllegalFileCount, oSDownload, restoreQuarantineFile, deleteQuarantineFile, qRTAppealApproval } from '../../core/thrift/illegalcontrol/illegalcontrol';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { formatTime } from '../../util/formatters/formatters';
import session from '../../util/session/session';
import { PureComponent } from '../../ui/decorators';
import WebComponent from '../webcomponent';
import { CASE, ApprovalStatus } from './helper';
import __ from './locale';

@PureComponent
export default class IllegalDocSeparationBase extends WebComponent<Components.Quarantine.Props, any> {

    state: Components.Quarantine.State = {
        illegalFileList: [],
        searchKey: '',
        count: 0,
        selections: [],
        setDefault: false,
        errMsg: '',
        historicalVersions: [],
        page: 1,
        errorQueue: [],
        viewAppealedOnly: false,
        withinAppealValidity: false,
        showAppealApproval: false,
        inFetching: false,
        disableApprovalConfirm: true,
        fileNeedReview: []
    }

    // 正在审核的申诉文件
    fileInApproval: Array<Core.IllegalControl.IllegalFileInfo> = [];

    // 审核意见
    approvalStatus: ApprovalStatus = ApprovalStatus.Rejection;


    /**
     * 默认策略
     */
    defaultStrategy = {
        [CASE.GNS_OBJECT_NOT_EXIST]: false,

        [CASE.CID_OBJECT_NOT_EXIST]: false,

        [CASE.QUOTAS_INSUFFICIENT]: false,

        [CASE.ILLEGALDOC_NOT_EXIST]: false
    }

    // 默认分页条数
    DEFAULT_PAGESIZE = 200;

    /**
     * 获取非法文件列表
     */
    componentWillMount() {
        CoverLayer(1, __('正在加载......'));
        this.setState({
            // 刷新页面时先判断session有没有存入viewAppealedOnly
            viewAppealedOnly: session.has('viewAppealedOnly') ? session.get('viewAppealedOnly') : false
        }, async () => {
            const [count, illegalFileList] = await this.getIllegalInfo(this.state.searchKey, this.state.page)
            this.setState({
                count,
                illegalFileList
            }, () => {
                CoverLayer(0);
            })
        })
    }

    /**
     * 获取隔离区信息
     */
    private async getIllegalInfo(key: string, page: number) {
        const [count, illegalFileList] = await Promise.all([
            getIllegalFileCount({ key, appeal: this.state.viewAppealedOnly ? QuarantineState.APPEAL : QuarantineState.ALL }),
            getIllegalFileList({ key, appeal: this.state.viewAppealedOnly ? QuarantineState.APPEAL : QuarantineState.ALL }, (page - 1) * this.DEFAULT_PAGESIZE, this.DEFAULT_PAGESIZE)
        ]);
        this.setState({
            fileNeedReview: illegalFileList.filter(file => file.appeal.needReview)
        })
        return [count, illegalFileList];
    }

    protected setLoadingStatus() {
        this.setState({ inFetching: true });
    }

    /**
     * 搜索非法文件方法
     */
    protected async searchIllegalDoc(key: string) {
        // 从第一页开始搜
        const [count, illegalFileList] = await this.getIllegalInfo(key, 1);
        this.setState({ count });
        return illegalFileList;
    }

    /**
     * 载入搜索结果
     */
    protected loadSearchResult(data: Array<Core.IllegalControl.IllegalFileInfo>) {
        this.setState({
            inFetching: false,
            illegalFileList: data,
            page: 1
        });
    }

    /**
     * 改变搜索关键字
     */
    protected changeSearchKey(key: string) {
        this.setState({ searchKey: key });
    }

    /**
     * 翻页时触发
     * @param page 页码
     * @param limit 每页条数
     */
    protected async handlePageChange(page: number, limit: number) {
        this.setState({ inFetching: true }, async () => {
            const [count, illegalFileList] = await this.getIllegalInfo(this.state.searchKey, page);
            this.setState({
                page,
                illegalFileList,
                inFetching: false,
                count
            })
        })
    }

    /**
     * 下载非法文件
     */
    protected downloadIllegalDoc(event, file: Core.IllegalControl.IllegalFileInfo) {
        if (this.state.selections.some(selection => selection.docid === file.docid)) {
            event.stopPropagation()
        }
        oSDownload(file.docid, file.versionId, file.name);
        // 记日志
        manageLog(ManagementOps.DOWNLOAD,
            __('下载非法文件“${file}”', { file: file.name }),
            __('修改时间：${modifieTime}，文件所在路径：${path}', { modifieTime: formatTime(file.modifie_time / 1000), path: file.parentPath }),
            Level.INFO)
    }

    /**
     * 还原非法文件
     */
    protected revertIllegalDoc() {
        this.setState({ toggleConfirmRevert: true }, () => {
            // 重置策略
            this.defaultStrategy[CASE.GNS_OBJECT_NOT_EXIST] = false;
            this.defaultStrategy[CASE.CID_OBJECT_NOT_EXIST] = false;
            this.defaultStrategy[CASE.QUOTAS_INSUFFICIENT] = false;
            this.defaultStrategy[CASE.ILLEGALDOC_NOT_EXIST] = false;
        });
    }

    /**
     * 还原非法文件
     */
    protected confirmRevertFiles() {
        this.setState({ toggleConfirmRevert: false, inFetching: true }, async () => {
            for (let file of this.fileInApproval.length ? this.fileInApproval : this.state.selections) {
                try {
                    if (this.fileInApproval.length) {
                        // 审核申诉并同意还原,2代表如果重名冲突，自动重名
                        await qRTAppealApproval(file.docid, true, 2);
                        manageLog(
                            ManagementOps.RESTORE,
                            __('同意“${displayName}”对非法文件“${fileName}” 的申诉，并还原文件', { displayName: file.appeal.appellant, fileName: file.name }),
                            __('文件所在路径：${path}', { path: file.parentPath }),
                            Level.INFO
                        );
                    } else {
                        await restoreQuarantineFile(file.docid, 2);
                        manageLog(ManagementOps.RESTORE, __('还原非法文件“${file}”', { file: file.name }), __('文件所在路径：${path}', { path: file.parentPath }), Level.INFO)
                    }
                    const [, illegalFileList] = await this.getIllegalInfo(this.state.searchKey, this.state.page);
                    this.setState({
                        illegalFileList,
                        inFetching: false,
                        count: this.state.count - 1
                    })
                } catch (ex) {
                    // 处理抛错
                    if (!this.defaultStrategy[ex.error.errID]) {
                        await new Promise(resolve => this.setState({
                            errorQueue: [{ file, errID: ex.error.errID, resolve, errStrategy: this.defaultStrategy[ex.error.errID] }, ...this.state.errorQueue]
                        })).then(() => {
                            this.setState({
                                errorQueue: this.state.errorQueue.slice(1),
                                inFetching: false,
                            });
                        });
                    }
                } finally {
                    this.fileInApproval = [];
                }
            }
        })
    }

    /**
     * 撤销还原操作
     */
    protected cancelRevert() {
        this.setState({ toggleConfirmRevert: false });
        this.fileInApproval = [];
    }

    /**
     * 还原文档库不存在
     */
    protected confirmLibraryNotExist(solution: any, errorcase: any) {
        this.defaultStrategy[CASE.GNS_OBJECT_NOT_EXIST] = solution.setDefault;
        this.defaultStrategy[CASE.CID_OBJECT_NOT_EXIST] = solution.setDefault;
        errorcase.resolve();
    }

    /**
     * 还原文档库配额不足
     */
    protected comfirmQuotasInsufficient(solution: any, errorcase: any) {
        this.defaultStrategy[CASE.QUOTAS_INSUFFICIENT] = solution.setDefault;
        errorcase.resolve();
    }

    /**
     * 文件不存在
     */
    protected confirmIllegalDocNotExist(solution: any, errorcase: any) {
        this.defaultStrategy[CASE.ILLEGALDOC_NOT_EXIST] = solution.setDefault;
        errorcase.resolve();
    }

    /**
     * 触发删除操作
     */
    protected toggleConfirmDelete() {
        // 选中的文档中是否包含申诉期限内的文件
        if (this.state.selections.some(file => file.appealExpiredTime > file.serverTime)) {
            this.setState({
                withinAppealValidity: true
            })
        } else {
            this.setState({
                withinAppealValidity: false
            })
            this.deleteIllegalDoc();
        }
    }

    /**
     * 删除非法文件
     */
    protected deleteIllegalDoc() {
        this.setState({
            withinAppealValidity: false
        })
        this.setState({ confirmDelete: true });
    }

    /**
     * 确认删除非法文件
     */
    protected comfirmDeleteFiles() {
        this.setState({ confirmDelete: false, inFetching: true }, async () => {
            for (let file of this.state.selections) {
                try {
                    await deleteQuarantineFile(file.docid);
                    const [, illegalFileList] = await this.getIllegalInfo(this.state.searchKey, this.state.page);
                    this.setState({
                        illegalFileList,
                        inFetching: false,
                        count: this.state.count - 1
                    })
                    manageLog(
                        ManagementOps.DELETE,
                        __('删除非法文件“${file}”', { file: file.name }),
                        __('文件所在路径：${path}', { path: file.parentPath }),
                        Level.INFO
                    );
                } catch (ex) {
                    // 处理抛错
                    if (!this.defaultStrategy[ex.error.errID]) {
                        await new Promise(resolve => this.setState({
                            errorQueue: [{ file, errID: ex.error.errID, resolve, errStrategy: this.defaultStrategy[ex.error.errID] }, ...this.state.errorQueue]
                        })).then(() => {
                            this.setState({
                                errorQueue: this.state.errorQueue.slice(1),
                                inFetching: false,
                            });
                        });
                    }
                }
            }
        })
    }

    /**
     * 撤销删除操作
     */
    protected cancelDelete() {
        this.setState({ confirmDelete: false });
    }

    /**
     * 改变当前选中项
     * @param selections 
     */
    protected handleSelectionChange(selections: Array<Core.IllegalControl.IllegalFileInfo>) {
        this.setState({ selections });
    }

    /**
     * 查看版本
     */
    protected async checkVersions(event, record: Core.IllegalControl.IllegalFileInfo) {
        if (this.state.selections.some(selection => selection.docid === record.docid)) {
            event.stopPropagation()
        }
        // 根据文件docid获取文件在隔离区中的版本，关键字置为空，获取所有版本
        const versions = await getFileVersionList(record.docid, '');
        this.setState({ toggleCheckVersions: true, historicalVersions: versions })
    }

    /**
     * 取消查看版本
     */
    protected CancelCheckVersions() {
        this.setState({ toggleCheckVersions: false })
    }

    /**
     * 改变只看申诉的文件勾选状态
     */
    protected changeViewAppealed(checkStatus: boolean) {
        // 存入session，刷新页面后仍保持上一次的勾选状态
        session.set('viewAppealedOnly', checkStatus);
        this.setState({
            inFetching: true,
            viewAppealedOnly: checkStatus
        }, async () => {
            const [count, illegalFileList] = await this.getIllegalInfo(this.state.searchKey, this.state.page);
            this.setState({
                illegalFileList,
                count,
                inFetching: false
            })
        })
    }

    /**
     * 打开审核申诉dialog
     */
    protected toggleAppealApproval(event, record: Core.IllegalControl.IllegalFileInfo) {
        if (this.state.selections.some(selection => selection.docid === record.docid)) {
            event.stopPropagation()
        }
        this.setState({
            showAppealApproval: true
        })
        this.fileInApproval = [record];
    }

    /**
     * 取消审核操作
     */
    protected cancelApproval() {
        this.setState({
            showAppealApproval: false,
            disableApprovalConfirm: true
        })
        this.fileInApproval = [];
    }

    /**
     * 审核申诉意见onChange
     */
    protected changeApprovalStatus(status: ApprovalStatus) {
        this.approvalStatus = status;
        this.setState({
            disableApprovalConfirm: false
        })
    }

    /**
     * 执行审核意见
     */
    protected approvalAppeal(fileInApproval: Array<Core.IllegalControl.IllegalFileInfo>) {
        this.setState({
            showAppealApproval: false
        }, async () => {
            if (this.approvalStatus === ApprovalStatus.Rejection) {
                // 否决申诉
                await qRTAppealApproval(fileInApproval[0].docid, false, 2);
                manageLog(
                    ManagementOps.AUDIT_MGM,
                    __('否决“${displayName}”对非法文件“${fileName}”的申诉', { displayName: fileInApproval[0].appeal.appellant, fileName: fileInApproval[0].name }),
                    __('文件所在路径：${path}', { path: fileInApproval[0].parentPath }),
                    Level.INFO
                );
                this.setState({
                    fileNeedReview: this.state.fileNeedReview.filter(file => file.docid !== fileInApproval[0].docid)
                }, () => {
                    this.fileInApproval = [];
                })
            } else {
                this.revertIllegalDoc();
            }
        })
    }
}