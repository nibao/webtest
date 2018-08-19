import * as React from 'react'
import { noop } from 'lodash'
import { openUrlByChrome } from '../../core/apis/client/tmp/tmp';
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getOEMConfig, buildWebClientURI } from '../../core/config/config';
import { isDir } from '../../core/docs/docs'
import { setCsfLevel as setFileCsfLevel } from '../../core/apis/efshttp/file/file';
import { setCsfLevel as setDirCsfLevel } from '../../core/apis/efshttp/dir/dir';
import { check } from '../../core/apis/eachttp/owner/owner';
import { get as getUser } from '../../core/apis/eachttp/user/user';
import { attribute as getDocAttribute } from '../../core/apis/efshttp/file/file';
import { buildCsfarray, CsfStatus, isSingleFile, hasMultiLibraries } from '../../core/csf/csf'
import { getOpenAPIConfig } from '../../core/openapi/openapi';

export default class CSFEditorBase extends React.Component<Components.CSFEditor.Props, Components.CSFEditor.State> {
    static defaultProps = {
        docs: [],

        onUpdateCsflevel: noop,

        onCloseDialog: noop,

        doApprovalCheck: noop,
    }

    state = {
        csfStatus: CsfStatus.None,

        showLoading: false
    }

    userCsflevel: number;  // 用户密级

    csfOptions: ReadonlyArray<{ level: number, text: string }> = []  // 可设置的密级的数组

    defaultValue: number = 0;  // 当选中的是一个文件时，文件的密级值

    enableCsfLevelAudit: boolean = false;  // 改密审核的开关状态，true--打开; false--关闭

    unhandledDocs: Core.Docs.Docs = this.props.docs   // 还没有设置密级的docs

    hasApprovalCsf: boolean = false;   // 是否存在已经成功提交审核的请求

    currentDoc: Core.Docs.Doc;   // 当前正在操作的文档对象

    skipAuditorMissingError: boolean = false  // 无审核员是否跳过, true-跳过， false-不跳过

    selectedLevel: number;  // 选择的密级选项

    componentWillMount() {
        this.checkInit()
    }

    /**
     * 检查
     * 是否具有所有者权限，是否选择多个文档库，文件是否存在
     */
    protected async checkInit() {
        const { docs } = this.props
        const multiLibraries = await hasMultiLibraries(docs)

        if (!multiLibraries) {
            // 没有选择多个文档库
            // 检查所有者权限
            if (docs && docs.length >= 1) {
                const isowner = await this.checkOwnerOfDocs(docs)

                if (isowner) {
                    // 有所有者权限
                    // 获取用户密级
                    const { csflevel } = await getUser()

                    this.userCsflevel = csflevel
                    this.csfOptions = await buildCsfarray(csflevel)

                    const { dirSelNum, fileSelNum } = isSingleFile(docs)

                    if (fileSelNum === 1 && !dirSelNum) {
                        // 选中单个文件
                        const { csflevel } = await getDocAttribute({ docid: docs[0].docid })
                        this.defaultValue = csflevel

                    } else {
                        this.defaultValue = 0
                    }

                    // 获取改密审核开关
                    this.enableCsfLevelAudit = await getOEMConfig('enablecsflevel')

                    this.setState({
                        csfStatus: CsfStatus.OK
                    })
                }
            }
        } else {
            // 选中多个文档库
            this.setState({
                csfStatus: CsfStatus.SelectMultiLibraries
            });
        }

    }

    /**
    * 检查用户对选中文件是否具有所有者权限
    * @returns 当具有所有者权限时，返回true；当没有所有者权限，或者请求出错了，返回false
    */
    private async checkOwnerOfDocs(docs: Core.Docs.Docs): Promise<boolean> {
        // 判断所有者权限，一旦有文件没有所有者权限，直接返回false，后面的都不用再判断了
        for (const doc of docs) {
            try {
                const { isowner } = await check({ docid: doc.docid })

                if (!isowner) {
                    if (isDir(doc)) {
                        // 文件夹，只需通过check接口判断所有者权限
                        this.setState({
                            csfStatus: CsfStatus.NoOwnerPerm
                        })

                        return false
                    } else {
                        // 文件，判断非所有者：check接口返回false，且该文档不是当前用户创建的
                        const [{ name }, { creator }] = await Promise.all([
                            getUser({}),
                            getDocAttribute({ docid: doc.docid })
                        ])

                        if (name !== creator) {
                            this.setState({
                                csfStatus: CsfStatus.NoOwnerPerm
                            })

                            return false
                        }
                    }
                }
            }
            catch ({ errcode }) {
                // 其他错误
                this.setState({
                    csfStatus: errcode
                })

                return false
            }
        }

        return true
    }

    /*
    ** 设置密级
    */
    protected async setCsflevel(selectedCSF: number, selectedDocs?: Core.Docs.Docs) {

        if (this.defaultValue !== selectedCSF) {
            if (this.enableCsfLevelAudit) {
                this.setState({
                    csfStatus: CsfStatus.None,
                    showLoading: true
                })
            }

            let [doc, ...rest] = selectedDocs
            this.unhandledDocs = rest

            while (doc) {
                try {
                    this.currentDoc = doc

                    const { result } = isDir(doc) ?
                        await setDirCsfLevel({ docid: doc.docid, csflevel: selectedCSF })
                        :
                        await setFileCsfLevel({ docid: doc.docid, csflevel: selectedCSF })

                    if (result === 1) {
                        this.hasApprovalCsf = true
                    }

                    // 记录未处理文件
                    [doc, ...rest] = rest;
                    this.unhandledDocs = rest
                }
                catch (ex) {
                    // 记录未处理文件
                    this.unhandledDocs = rest

                    if (ex.errcode === ErrorCode.AuditCSFMismatch) {
                        // 审核员密级不足
                        if (!this.skipAuditorMissingError) {
                            this.setState({
                                csfStatus: ex.errcode
                            })
                            throw ex;
                        } else {
                            [doc, ...rest] = rest;
                            this.unhandledDocs = rest
                        }
                    } else {
                        this.setState({
                            csfStatus: ex.errcode,
                        })
                        throw ex;
                    }
                }
            }

            if (this.hasApprovalCsf) {
                this.setState({
                    showLoading: false,
                    csfStatus: CsfStatus.Approval
                })
            } else {
                // 给单个文件设置密级， 更新显示
                if (this.props.docs.length === 1 && !isDir(this.props.docs[0])) {
                    this.props.onUpdateCsflevel(selectedCSF)
                } else {
                    this.props.onCloseDialog()
                }
            }
        } else {
            this.props.onUpdateCsflevel(selectedCSF)
        }
    }

    /**
     * 关闭无匹配相应密集审核员弹窗
     */
    protected closeSkipErrorDialog() {
        this.setState({
            csfStatus: CsfStatus.None
        })

        if (this.unhandledDocs && this.unhandledDocs.length) {
            this.setCsflevel(this.selectedLevel, this.unhandledDocs)
        } else {
            if (this.hasApprovalCsf) {
                this.setState({
                    showLoading: false,
                    csfStatus: CsfStatus.Approval
                })
            } else {
                this.props.onCloseDialog()
            }
        }
    }

    /**
     * 改密审核跳转至审核管理
     */
    protected async jumpApprovalCheck(platform: 'client' | 'desktop') {
        if (platform === 'desktop') {
            // desktop
            this.props.doApprovalCheck();
        } else {
            // client          
            const { userid, tokenid, locale } = getOpenAPIConfig(['host', 'userid', 'tokenid', 'locale']);

            openUrlByChrome({ url: await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: '/home/approvals/share-application', lang: locale, platform: 'pc' } }) });

        }
    }

}