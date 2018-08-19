/// <reference path="./component.base.d.ts" />


import * as React from 'react'
import WebComponent from '../webcomponent'
import { getConfig } from '../../core/config/config'
import { noop } from 'lodash'

export default class DocProperties extends WebComponent<Components.DocProperties.Props, any> implements Components.DocProperties.Base {

    static defaultProps = {
        parent: null,
        docs: [],
        onTagClick: noop,
        doRevisionRestore: noop,
        doRevisionView: noop,
        doRevisionDownload: noop
    }

    state = {
        showFileComment: false
    }

    handleTagClick(tag) {
        this.props.onTagClick(tag)
    }

    componentWillMount() {
        getConfig('enable_doc_comment').then(showFileComment => {
            this.setState({
                showFileComment
            })
        })
    }
}