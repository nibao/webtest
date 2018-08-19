/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { efshttp } from '../../core/openapi/openapi';
import { download } from '../../core/download/download'
import WebComponent from '../webcomponent';

export default class MyAccessListBase extends WebComponent<Components.MyAccessList.Props, any> {
    static defaultProps = {
        preview: noop
    }

    state = {
        loading: true,

        data: []
    }

    private componentWillMount() {
        efshttp('statistics', 'myaccessstatistics').then(data => this.setState({ data, loading: false }), () => this.setState({ loading: false }));
    }

    protected download(doc) {
        download(doc)
    }
}