import * as React from 'react'
import { PureComponent } from '../../../ui/decorators'
import { isDir } from '../../../core/docs/docs'

@PureComponent
export default class List extends React.Component<any, any>{

    state = {
        showQuickMenu: null
    }

    handleOpen(e, doc) {
        if (e.defaultPrevented) {
            return
        }
        e.preventDefault()
        this.props.onOpen(doc, { newTab: !e.altKey && (e.ctrlKey || !isDir(doc)) })
    }

    showQuickMenu(doc) {
        this.setState({
            showQuickMenu: doc
        })
    }

    hideQuickMenu() {
        this.setState({
            showQuickMenu: null
        })
    }

    handleIconClick(e, doc) {
        e.preventDefault()
        if (typeof this.props.onSelectionChange === 'function') {
            this.props.onSelectionChange([doc])
        }
    }

    openDrawer(e, docs) {
        e.preventDefault()
        this.props.onOpenDrawer(docs)
    }
}