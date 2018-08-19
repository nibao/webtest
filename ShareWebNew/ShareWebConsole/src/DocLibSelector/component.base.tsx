import * as React from 'react'
import { ShareMgnt, EACP } from '../../core/thrift/thrift'
import session from '../../util/session/session'

export enum DocLibType {
    DocLib = 0,
    ArchiveLib = 1
}

interface Props {
    docLibs: Array<DocLibType>,
    onConfirmSelectDocLib,
    onCancelSelectDocLib
}

export default class DocLibSelectorBase extends React.Component<Props, any>{

    static defaultProps = {
        docLibs: [0, 1]
    }

    state = {
        libs: {
            [DocLibType.DocLib]: [],
            [DocLibType.ArchiveLib]: []
        },
        selected: [],
        values: {
            [DocLibType.DocLib]: '',
            [DocLibType.ArchiveLib]: ''
        }
    }

    searchKey = {
        [DocLibType.DocLib]: '',
        [DocLibType.ArchiveLib]: ''
    }

    count = {
        [DocLibType.DocLib]: 0,
        [DocLibType.ArchiveLib]: 0
    }

    start = {
        [DocLibType.DocLib]: 0,
        [DocLibType.ArchiveLib]: 0
    }

    loading = {
        [DocLibType.DocLib]: false,
        [DocLibType.ArchiveLib]: false
    }

    componentDidMount() {
        this.props.docLibs.forEach(docLibType => {
            this.searchDocInfos(docLibType)('').then(this.handleDocLibsLoaded.bind(this))
        })
    }

    /**
     * 根据文档库类型返回搜索文档库function
     */
    searchDocInfos(docLibType, start = 0) {
        return (key = this.searchKey[docLibType]) => {
            if (key !== this.searchKey[docLibType]) {
                start = 0
                this.start[docLibType] = 0
                this.searchKey[docLibType] = key
            }
            let promise,
                params = {
                    ncTGetPageDocParam: {
                        docCreaters: [],
                        docNames: [key],
                        docOwners: [],
                        docTypes: [],
                        limit: 200,
                        sortKey: 1,
                        sortType: 0,
                        start,
                        userId: session.get('userid')
                    }
                }
            switch (docLibType) {
                case DocLibType.ArchiveLib:
                    promise = Promise.all([
                        start === 0 ? EACP('EACP_GetSearchArchiveDocCnt', [params]) : this.count[docLibType],
                        EACP('EACP_SearchArchiveDocInfos', [params])
                    ])
                    break
                case DocLibType.DocLib:
                    promise = Promise.all([
                        start === 0 ? EACP('EACP_GetSearchCustomDocCnt', [params]) : this.count[docLibType],
                        EACP('EACP_SearchCustomDocInfos', [params])
                    ])
                    break
            }
            return promise.then(([count, libs]) => {
                this.count[docLibType] = count
                return { [docLibType]: start === 0 ? libs : [...this.state.libs[docLibType], ...libs] }
            })
        }
    }

    /**
     * 文档库加载完成
     */
    handleDocLibsLoaded(lib) {
        this.setState({
            libs: { ...this.state.libs, ...lib }
        })
    }

    /**
     * 文档库懒加载
     */
    lazyloader(docLibType) {
        if (this.state.libs[docLibType].length < this.count[docLibType] && !this.loading[docLibType]) {
            this.loading[docLibType] = true
            this.start[docLibType] = this.start[docLibType] + 200
            this.searchDocInfos(docLibType, this.start[docLibType])(this.searchKey[docLibType]).then(res => {
                this.handleDocLibsLoaded(res)
                this.loading[docLibType] = false
            })
        }
    }

    /**
     * 选中文档库
     */
    handleSelectDocLib(docLib) {
        if (!this.state.selected.some(lib => lib.docId === docLib.docId)) {
            this.setState({
                selected: [...this.state.selected, docLib]
            })
        }
    }

    /**
     * 删除已选中文档库
     */
    handleDeleteDocLib(docLib) {
        this.setState({
            selected: this.state.selected.filter(lib => lib.docId !== docLib.docId)
        })
    }

    /**
     * 清空已选
     */
    handleClearSelected() {
        this.setState({
            selected: []
        })
    }

    /**
     * 确定
     */
    handleConfirm() {
        this.props.onConfirmSelectDocLib(this.state.selected)
    }

    /**
     * 取消
     */
    handleCancel() {
        this.props.onCancelSelectDocLib()
    }
}