/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { render as ReactDOMRender } from 'react-dom';
import { noop } from 'lodash';
import { efshttp } from '../../core/openapi/openapi';
import { download } from '../../core/download/download'
import WebComponent from '../webcomponent';

export default class AccessListBase extends WebComponent<Components.DocsList.Props, any> {
    static defaultProps = {
        preview: noop
    }

    state = {
        loading: true,

        data: []
    }

    private componentWillMount() {
        efshttp('statistics', 'accessstatistics').then(data => this.setState({ data, loading: false }), () => this.setState({ loading: false }));
    }

    protected download(doc) {
        download(doc)
    }
}