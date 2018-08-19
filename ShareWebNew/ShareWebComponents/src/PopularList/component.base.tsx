/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { noop } from 'lodash';
import { DocType, getResolvedByTypeDB } from '../../core/entrydoc/entrydoc';
import { list } from '../../core/apis/efshttp/dir/dir';
import { download } from '../../core/download/download'
import WebComponent from '../webcomponent';

export default class PopularListBase extends WebComponent<Components.DocsList.Props, any> {
    static defaultProps = {
        preview: noop
    }

    state = {
        loading: true,

        data: []
    }

    private componentWillMount() {
        getResolvedByTypeDB(DocType.customdoc).then(entrys => {
            for (let entry of entrys) {
                if (entry.docname === '热点知识') {
                    return list({
                        docid: entry.docid,
                        by: 'time',
                        sort: 'desc'
                    }).then(({ files }) => this.setState({ data: files.slice(0, 100), loading: false }));
                }
            }

            this.setState({ loading: false });
        }, () => this.setState({ loading: false }));
    }

    protected download(doc) {
        download(doc)
    }
}