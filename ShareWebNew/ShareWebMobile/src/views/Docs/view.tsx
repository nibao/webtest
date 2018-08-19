import * as React from 'react';
import Docs from '../../../components/Docs/component.mobile'
import { setTitle } from '../../../util/browser/browser'
import { docname, isDir } from '../../../core/docs/docs'
import { setOEMtitle } from '../../../core/oem/oem'
import { openDoc, getDocFromQuery, scrollTop } from '../../helper'

export default class DocsView extends React.Component<any, any>{
    state = {
        doc: null
    }

    async componentWillMount() {
        scrollTop();
        const doc = await getDocFromQuery(this.props.location.query);
        (doc === null || isDir(doc)) ? setOEMtitle() : setTitle(docname(doc))
        this.setState({
            doc
        })
    }

    async componentWillReceiveProps({ location }) {
        if (location.query.gns !== this.props.location.query.gns) {
            scrollTop();
        }
        const doc = await getDocFromQuery(location.query);
        (doc === null || isDir(doc)) ? setOEMtitle() : setTitle(docname(doc))
        this.setState({
            doc
        })
    }

    render() {
        return (
            <Docs
                doc={this.state.doc}
                onPathChange={openDoc}
            />
        )
    }
}