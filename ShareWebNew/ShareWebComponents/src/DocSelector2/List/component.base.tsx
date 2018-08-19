import * as React from 'react'
import { noop } from 'lodash'

export default class ListBase extends React.Component<Components.DocSelector.List.Props, any> {
    static defaultProps = {
        /**
         * 展示的数据
         */
        list: {
            dirs: [],
            files: []
        },

        /**
         * 打开文件夹
         */
        onRequestOpenDir: noop,
    }

    /**
     * 打开文件夹
     */
    protected handleOpen(e, doc: Core.Docs.Doc) {
        if (e.defaultPrevented) {
            return
        }
        e.preventDefault()
        this.props.onRequestOpenDir(doc)
    }
}