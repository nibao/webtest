import * as React from 'react'
import { noop } from 'lodash'

export default class EntryDosBase extends React.Component<Components.DocSelector2.EntryDocs.Props, Components.DocSelector2.EntryDocs.State> {
    static defaultProps = {
        viewsinfo: [],
        viewsOpen: [],
        list: {
            dirs: [],
            files: []
        },
        selections: [],
        onToggleViewOpen: noop,
        onRequestOpenDir: noop
    }

    state = {
        viewDocTypes: [],
        viewDocs: {},
        viewSelections: {}
    }

    componentDidMount() {
        this.init(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.init(nextProps)
    }

    /**
     * 初始化
     * @param param0 
     */
    private init({ viewsinfo, list, selections }: { viewsinfo: ReadonlyArray<any>, list: ReadonlyArray<any>, selections: ReadonlyArray<any> }) {
        const viewDocTypes = viewsinfo.map(({ view_doctype }) => view_doctype)
        const viewDocs = viewDocTypes.reduce(
            (preViewDocs, viewDocType) =>
                ({ ...preViewDocs, [viewDocType]: list.dirs.filter(doc => doc.view_doctype === viewDocType) }),
            {}
        )
        const viewSelections = viewDocTypes.reduce(
            (preViewSelections, viewDocType) =>
                ({ ...preViewSelections, [viewDocType]: selections.filter(doc => doc.view_doctype === viewDocType) }),
            {}
        )
        this.setState({
            viewDocTypes,
            viewDocs,
            viewSelections
        })
    }
}