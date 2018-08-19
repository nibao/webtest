import * as React from 'react'

export default class EntryDocsBase extends React.Component<any, any>{

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

    init({ viewsinfo, list, selections }) {
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

    handleViewSelectionChange(viewDocType, selections, multiple) {
        this.setState({
            viewSelections:
                {
                    ...(
                        multiple ?
                            this.state.viewSelections :
                            this.state.viewDocTypes.reduce(
                                (preViewSelections, viewDocType) =>
                                    ({ ...preViewSelections, [viewDocType]: [] }),
                                {}
                            )
                    ),
                    [viewDocType]: selections
                }
        }, () => {
            const { viewDocTypes, viewSelections } = this.state
            this.props.onSelectionChange(viewDocTypes.reduce(
                (selections, viewDocType) =>
                    ([...selections, ...viewSelections[viewDocType]]),
                []
            ))
        })
    }
}