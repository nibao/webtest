import * as React from 'react'
import { noop } from 'lodash'

export default class CrumbsBase extends React.Component<Components.LinkDocs.Crumbs.Props, any> {

    static defaultProps = {
        crumbs: [],
        uploadEnable: false,
        onCrumbChange: noop
    }

    state = {
        overflow: false
    }

    crumbs: HTMLDivElement

    constructor(props, context) {
        super(props, context)
        this.checkOverflow = this.checkOverflow.bind(this)
    }

    /**
     * 跳转到doc对应的路径
     * @param doc 
     */
    protected loadDoc(doc: any) {
        this.props.onCrumbChange(doc)
    }

    /**
     * 返回上一级路径
     */
    protected loadParent() {
        const { crumbs } = this.props

        if (crumbs.length > 1) {
            this.loadDoc(crumbs[crumbs.length - 2])
        } else if (crumbs.length === 1) {
            this.loadDoc({ ...(crumbs[0]), docid: '' })
        }
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

    protected ref(crumbs) {
        if (crumbs) {
            this.crumbs = crumbs
        }
    }
}