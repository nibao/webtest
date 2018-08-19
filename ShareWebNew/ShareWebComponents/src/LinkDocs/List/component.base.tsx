import * as React from 'react'
import { noop } from 'lodash'
import { isDir } from '../../../core/docs/docs'

export default class ListBase extends React.Component<Components.LinkDocs.List.Props, any> {
    static defaultProps = {
        list: {
            dirs: [],
            files: []
        },

        selections: [],

        checkbox: true,

        downloadEnable: false,

        onRequestOpenDir: noop,

        onSelectionChange: noop,

        onContextMenu: noop,

        onRequestDownload: noop,

        onRequrestSaveTo: noop
    }

    /**
     * 打开文件夹
     */
    protected handleOpen(e, doc: any) {
        if (e.defaultPrevented) {
            return
        }
        e.preventDefault()
        this.props.onRequestOpenDir(doc, { newTab: e.ctrlKey || !isDir(doc) })
    }

    /**
     * 选中某一行
     */
    protected handleIconClick(e, doc) {
        e.preventDefault()

        if (typeof this.props.onSelectionChange === 'function') {
            this.props.onSelectionChange([doc])
        }
    }
}