import * as React from 'react'
import { noop } from 'lodash'
import { PureComponent } from '../../../ui/decorators'

@PureComponent
export default class CrumbsBase extends React.Component<any, any>{

    static defaultProps = {
        crumbs: [],
        onCrumbChange: noop,
        onRequestCreateDir: noop
    }

    state = {
        overflow: false
    }

    crumbs: HTMLDivElement

    constructor(props, context) {
        super(props, context)
        this.checkOverflow = this.checkOverflow.bind(this)
    }

    loadDoc(doc) {
        this.props.onCrumbChange(doc)
    }

    loadParent() {
        const { crumbs } = this.props
        if (crumbs.length > 1) {
            this.loadDoc(crumbs[crumbs.length - 2])
        }
    }

    ref(crumbs) {
        if (crumbs) {
            this.crumbs = crumbs
        }
    }

    /**
     * 选中一条搜索结果
     */
    protected selectItem(doc) {
        this.props.onCrumbChange(doc, { newTab: true })
    }

    /**
     * 跳转至全文检索
     */
    protected toGlobalSearch(key, range) {
        this.props.onRequestGlobalSearch(key, range)
    }

    /**
     * 打开文档所在位置
     */
    protected handleRequestOpenDir(doc) {
        // 传入父级gns路径(一级gns32个字符 + '/' = 33)
        this.props.onCrumbChange({ docid: doc.docid.slice(0, -33), size: -1 }, { newTab: true })
    }

    /**
     * 判断当前路径栏宽度是否溢出
     */
    protected checkOverflow() {
        let overflow = false
        if (this.crumbs) {
            if ((this.crumbs.scrollWidth > this.crumbs.offsetWidth)) {
                if (!this.state.overflow) {
                    overflow = true
                }
            }
        }
        this.setState({
            overflow
        })
    }
}