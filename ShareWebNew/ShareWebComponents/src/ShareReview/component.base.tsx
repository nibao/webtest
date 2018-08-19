import * as React from 'react';
import { noop, pairs, last } from 'lodash';
import { getConfig } from '../../core/config/config';
import { isDir } from '../../core/docs/docs';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { getPendingApprovals } from '../../core/apis/eachttp/audit/audit';
import { approve } from '../../core/apis/eachttp/audit/audit';
import { ReviewType, getApprovalsData, fetchApprovalsCounts } from '../../core/audit/audit';
import * as fs from '../../core/filesystem/filesystem';
import { download } from '../../core/download/download';
import { fetchMessages } from '../../core/message/message';
import { webcomponent } from '../../ui/decorators';
import session from '../../util/session/session';
import { lastDoc } from './helper';

@webcomponent
export default class ShareReviewBase extends React.Component<Components.ShareReview.Props, Components.ShareReview.State> {

    static defaultProps = {

    }

    state = {
        applyInfos: {
            all: [],
            pending: [],
            history: []
        },
        selectedReviewType: ReviewType.ShareApvAll,
        csfTextArray: [],
        inReview: false,
        approveException: null,
        errors: [],
        list: [],
        loading: false,
        loadingDir: false,
        crumbs: [],
        reviewSelection: null,
        docSelection: null,
        confirmError: noop
    }

    /**
     * 系统标密id
     */
    csfSysId: string = '';

    /**
     * 当前正在审核的文件
     */
    fileInReview: Core.APIs.EACHTTP.ApplyApproval = null;

    async componentWillMount() {
        const { query } = this.props.location;

        this.getCsfConfig()
        fs.clearCache()
        if (query && query.applyid && query.gns) {
            this.checkBeforeLoad({ applyid: query.applyid, docid: `gns://${query.gns}` })
            this.load({ applyid: query.applyid, docid: `gns://${query.gns}` })
        } else {
            this.getApprovalData()
        }
    }

    async componentWillReceiveProps({ doc, crumbs, location }) {
        if (doc && this.props.doc && (doc.docid !== this.props.doc.docid || doc.applyid !== this.props.doc.applyid) || !doc && this.props.doc || doc && !this.props.doc) {
            this.getCsfConfig()
            if (doc) {
                this.checkBeforeLoad(doc)
                this.load(doc, crumbs)
            } else {
                this.getApprovalData()
            }
        } else if (!doc && location.pathname === '/home/approvals/share-review') {
            this.getApprovalData()
        }
    }

    /**
     * 加载目录之前检查该审核记录是否存在
     */
    private async checkBeforeLoad(doc) {
        const pendingApprovals = (await getPendingApprovals()).applyinfos
        if (pendingApprovals.find(apv => apv.applyid === doc.applyid)) {
            return
        } else {
            this.setState({
                errors: [{ errcode: ErrorCode.ShareApplyComplete }],
                confirmError: () => {
                    this.setState({
                        errors: []
                    })
                    this.props.onPathChange({ applyId: null })
                }
            })
        }
    }

    /**
     * 获取列表数据
     */
    private async getApprovalData() {
        const { applyInfos } = this.state;
        this.setState({
            loading: true
        }, async () => {
            fetchApprovalsCounts()
            let shareApvAll = await getApprovalsData(ReviewType.ShareApvAll)

            shareApvAll = shareApvAll && shareApvAll.length ?
                shareApvAll.reduce((pre, value) => [
                    ...pre,
                    {
                        ...value,
                        date: value.createdate || value.requestdate,
                        sharer: value.sharername || value.requestername
                    }], [])
                : []

            this.setState({
                applyInfos: {
                    ...applyInfos,
                    all: shareApvAll,
                    pending: shareApvAll.filter(apvInfo => !apvInfo.auditornames),
                    history: shareApvAll.filter(apvInfo => apvInfo.auditornames && apvInfo.auditornames.length)
                }
            }, () => {
                this.setState({
                    loading: false
                })
            })
        })
    }

    /**
     * 双击列表
     */
    protected handleDoubleClick = ({ detail: { record } }) => {
        if (!record.auditornames) {
            record.applyid ?
                this.props.onPathChange({ applyId: record.applyid, doc: record })
                : this.props.onPathChange({ doc: record })
        }
    }

    /**
     * 切换审核类型
     */
    protected changeReviewType = (value) => {
        this.setState({
            selectedReviewType: value
        })
    }

    /**
     * 系统密级从低到高排序
     */
    private sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map(([text]) => {
            return text
        })
    }

    /**
     * 获取系统密级配置信息
     */
    private async getCsfConfig() {
        const { third_csfsys_config, csf_level_enum } = await getConfig()

        this.csfSysId = third_csfsys_config ? third_csfsys_config.id : ''
        this.setState({ csfTextArray: this.sortSecu(csf_level_enum) })
    }

    /**
     * 选中审核文件
     */
    protected handleReviewSelectionChange = ({ detail }) => {
        this.setState({
            reviewSelection: detail
        })
    }

    /**
     * 选中打开目录列表里的某一项
     */
    protected handleDocSelectionChange = ({ detail }) => {
        this.setState({
            docSelection: detail
        })
    }

    /**
     * 下载待审核文件
     */
    protected async download(doc) {
        download({ ...doc, name: doc.name || lastDoc(doc.docname) }, { checkPermission: false })
    }

    /**
     * 执行审核事件
     */
    protected handleReview = (applyInfo) => {
        this.fileInReview = applyInfo;
        this.setState({
            inReview: true,
            reviewSelection: applyInfo
        })
    }

    /**
     * 关闭审核弹窗
     */
    doCloseReviewDialog = () => {
        this.setState({
            inReview: false
        })
        this.fileInReview = null;
    }

    /**
     * 按日期排序
     */
    sortApprovals(prev, last) {
        return last.date - prev.date
    }

    /**
     * 审核操作
     */
    protected handleShareReview = async (applyid, result, msg) => {
        const { applyInfos } = this.state;
        try {
            await approve(applyid, result, msg)

            const updateAllApplyInfos = applyInfos.all.map(applyinfo =>
                applyinfo.applyid === applyid ?
                    {
                        ...applyinfo,
                        auditornames: session.get('login').account,
                        approveindex: result === true ? 0 : -1,
                        vetoindex: result === false ? 0 : -1
                    }
                    : applyinfo
            )

            this.setState({
                applyInfos: {
                    ...applyInfos,
                    all: updateAllApplyInfos,
                    pending: updateAllApplyInfos.filter(approval => !approval.auditornames),
                    history: updateAllApplyInfos.filter(approval => approval.auditornames && approval.auditornames.length)
                }
            })
            fetchApprovalsCounts()
            fetchMessages()
        } catch (ex) {
            this.setState({
                approveException: {
                    ...ex,
                    doc: this.fileInReview
                }
            })
        } finally {
            this.setState({
                inReview: false
            })
        }
    }

    /**
     * 异常弹窗确认事件
     */
    protected handleExceptionConfirm = () => {
        this.setState({
            approveException: null
        })
    }

    /**
     * 打开文件/文件夹
     */
    protected handleOpenDoc = async (e, doc) => {
        e.stopPropagation();
        if (!doc.auditornames) {
            doc.applyid ? this.props.onPathChange({ applyId: doc.applyid, doc }) : this.props.onPathChange({ doc })
        }
    }

    /**
     * 列举文档对象
     */
    private load = async (doc, crumbs?) => {
        try {
            this.setState({
                list: null,
                loadingDir: true
            })

            let previewFile = null
            crumbs = crumbs && crumbs.length ? crumbs : await fs.getDocsChain(doc)

            const currentDoc = last(crumbs)

            if (!(currentDoc === null || isDir(currentDoc))) {
                previewFile = currentDoc;
                crumbs = crumbs.slice(0, -1)
            }

            if (previewFile) {
                return
            }

            this.setState({
                crumbs
            }, async () => {
                const currentDir = last(crumbs)
                const { dirs, files } = await fs.list(currentDir);
                this.setState({
                    list: [...dirs, ...files]
                })
            })
        } catch (ex) {
            /**
             * 列举目录出错
             */
            await new Promise(resolve => {
                this.setState({
                    errors: [
                        ...this.state.errors,
                        ex
                    ],
                    confirmError: resolve
                })
            })

            this.setState({
                errors: this.state.errors.slice(1)
            })

            if (ex && ex.upperDocsChain) {
                // 回到上层目录
                const lastDoc = last(ex.upperDocsChain)
                lastDoc && lastDoc.applyid ?
                    this.props.onPathChange({ doc: lastDoc })
                    :
                    this.props.onPathChange({ applyId: null })
            }
        } finally {
            this.setState({
                loadingDir: false
            })
        }
    }

    /**
     * 路径发生变化
     */
    protected handlePathChange(doc) {
        if (doc.docid === '') {
            this.props.onPathChange({ applyId: null })
        } else {
            this.props.onPathChange({ doc })
        }
    }
}