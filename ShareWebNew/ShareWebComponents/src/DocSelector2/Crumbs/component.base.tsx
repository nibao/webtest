import * as React from 'react'
import { noop } from 'lodash'

export default class CrumbsBase extends React.Component<Components.DocSelector2.Crumbs.Props, any> {

    static defaultProps = {
        crumbs: [],
        onCrumbChange: noop,
        onCancel: noop
    }

    /**
     * 跳转到doc对应的路径
     * @param doc 
     */
    protected loadDoc(doc: Core.Docs.Doc) {
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
}