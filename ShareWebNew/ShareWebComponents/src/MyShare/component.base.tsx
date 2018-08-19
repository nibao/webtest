import * as React from 'react'
import { noop, includes } from 'lodash'
import { getShared, get as getPermInfos, set } from '../../core/apis/eachttp/perm/perm'
import { close as closeLinkShare, getLinked } from '../../core/apis/efshttp/link/link'
import { getPermConfigs, addNamePath, SHARETYPE, getBasename, filterCancelResult } from '../../core/myshare/myshare'
import __ from './locale'

export default class MyShareBase extends React.Component<Components.MyShare.Props, Components.MyShare.State> {
    static defaultProps = {
        doDirOpen: noop,
        doFilePreview: noop,
        doShare: noop,
        doLinkShare: noop,
        doLinkShareDetailShow: noop,
        doApvJump: noop,
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        type: SHARETYPE.Share,
        shareDocs: null,
        linkShareDocs: null,
        selection: [],
        cancelDocs: null,
        record: undefined,
        shareDocDetail: [],
        errorCode: 0,
        failedDoc: {},
        apvCase: false,
    }

    /**
     * 初始化加载内链共享shareDocs文档
     */
    componentWillMount() {
        this.initShareDocs()
    }

    /**
     * 初始化内链共享列表
     */
    protected async initShareDocs() {
        // 获得docs文件后，遍历为其添加name字段（解决Thumbnail组件根据docname()方法查找文件类型找不到name属性时不能正确显示文件图标）
        try {
            const docs = (await getShared()).docinfos.map((docinfo) => {
                return { ...docinfo, name: getBasename(docinfo.path) }
            })
            this.setState({
                shareDocs: docs
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * 初始化外链共享列表
     */
    protected async initLinkShareDocs() {
        // 遍历添加name字段
        try {
            const docs = (await getLinked()).map((doc) => {
                return { ...doc, name: getBasename(doc.namepath) }
            }, [])
            this.setState({
                linkShareDocs: docs
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * 选择的共享类型发生变化时触发
     * @param {any} type 选中的共享类型
     */
    protected handleTypeChange(type) {
        type === SHARETYPE.Share ? this.initShareDocs() : this.initLinkShareDocs()
        this.setState({
            type,
            selection: [],
        })
    }

    /**
     * 取消共享时，将取消共享的文件存入到cancelDocs中
     * @param {any} doc 
     */
    protected setCancelDocs(doc) {
        this.setState({ cancelDocs: doc })
    }

    /**
     * 确认取消内链|外链共享时触发
     * @param {any} cancelShareDocs 选中的取消内链或者外链共享的文件列表
     */
    protected async handleCancelShare(cancelDocs: ReadonlyArray<Core.APIs.EACHTTP.SharedDocs> | ReadonlyArray<Core.APIs.EFSHTTP.GetLinkedResult>) {
        this.cancelShare(cancelDocs)
    }

    /**
     * 取消共享
     * @param cancelDocs 取消共享的文件列表 
     */
    protected async cancelShare(cancelDocs) {
        const { type } = this.state
        let flag = 0
        // 循环取消共享
        await cancelDocs.reduce(async (prePromise, cancelDoc) => {
            return prePromise.then(() => {
                return new Promise(async (resolve, reject) => {
                    try {
                        // 依次发送请求，取消共享
                        if (type === SHARETYPE.Share) {
                            const perminfos = await getPermInfos({ docid: cancelDoc.docid })
                            if (perminfos.perminfos.length === 0) {
                                this.setState({
                                    errorCode: 10,
                                    failedDoc: cancelDoc,
                                    cancelDocs: null,
                                })
                                reject()
                            } else {
                                // 返回的result结果为0，表示没有开启权限审核，直接执行删除操作
                                if ((await set({ docid: cancelDoc.docid, permconfigs: [] })).result === 0) {
                                    // 取消共享成功的文件从列表中清除掉
                                    this.filterResult(cancelDoc)
                                } else {
                                    // 设置标志位，当打开权限申请，显示跳转至权限申请对话框
                                    flag = 1
                                }
                            }
                        } else {
                            await closeLinkShare({ docid: cancelDoc.docid })
                            this.filterResult(cancelDoc)
                        }
                        resolve()
                    } catch (err) {
                        // 取消共享发生错误时，处理错误
                        this.handleError(err, cancelDoc)

                        // 设置状态
                        this.setState({
                            cancelDocs: null,
                        })
                        reject()
                    }
                })
            })

        }, Promise.resolve())

        // 全部取消共享成功后,如果是开启了共享审核则弹出跳转对话框，没有则弹出成功提示
        if (flag === 1) {
            this.setState({
                apvCase: true,
                cancelDocs: null,
            })
        } else {
            if (type === SHARETYPE.Share) {
                this.context.toast(__('取消内链共享成功'))
            } else {
                this.context.toast(__('取消外链共享成功'))
            }

            this.setState({
                cancelDocs: null,
                selection: [],
            })
        }
    }

    /**
     * 过滤取消共享的文件
     * @param doc 被取消共享的文件
     */
    protected filterResult(doc: any) {
        const { type, shareDocs, linkShareDocs } = this.state
        let newDocs

        // 从整个列表中删除取消共享的文件
        if (type === SHARETYPE.Share) {
            newDocs = filterCancelResult(shareDocs, doc)

            this.setState({
                shareDocs: newDocs,
            })
        } else {
            newDocs = filterCancelResult(linkShareDocs, doc)

            this.setState({
                linkShareDocs: newDocs,
            })
        }
    }

    /**
     * 展示内链访问详情时触发
     * @param doc 查看详情的内链文件
     */
    protected async handleShowShareDetail(event, doc: Core.APIs.EACHTTP.SharedDocs) {
        const { record, selection } = this.state

        // 点击查看按钮时不改变整行的选中状态
        if (selection.length === 1 && includes(selection, doc)) {
            event.stopPropagation()
        }

        try {
            const perminfos = await getPermConfigs(doc)

            // 如果访问者详情列表长度为0，则不显示展开列表，而是弹出窗口，提示内链共享不存在
            if (perminfos.length === 0) {
                this.setState({
                    errorCode: 10,
                    failedDoc: doc,
                    record: undefined,
                })
            } else {
                // 如果是展开状态则关闭
                if (record && doc === record) {
                    this.setState({
                        record: undefined
                    })
                } else {
                    const finalDetails = await addNamePath(perminfos)

                    this.setState({
                        shareDocDetail: finalDetails,
                        record: doc,
                    })
                }
            }
        } catch (error) {
            this.setState({
                record: undefined
            })
            this.handleError(error, doc)
        }
    }

    /**
     * 处理取消共享错误
     * @param {*} err 错误信息
     * @param {*} doc 出错的文件
     */
    protected handleError(err: any, doc: any): void {
        this.setState({
            errorCode: err.errcode,
            failedDoc: doc
        })
    }

    /**
     * 点击浮动按钮时阻止双击事件
     */
    handleIconClick(e, record) {
        if (this.state.selection.length === 1 && includes(this.state.selection, record)) {
            e.stopPropagation()
        }
    }

    /**
     * 关闭跳转至权限申请弹框时触发
     */
    handleComfirmApvCaseDialog() {
        this.setState({
            apvCase: false,
            cancelDocs: null,
        })
    }
}
