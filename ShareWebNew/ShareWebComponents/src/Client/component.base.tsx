///<reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { useHTTPS } from '../../util/browser/browser';
import { download } from '../../core/apis/eachttp/update/update';
import { getOffice, ClientTypes } from '../../core/clients/clients';

export default class ClientBase extends React.Component<Components.Client.Props, Components.Client.State>{
    static defaultProps = {
        host: location.origin,
        onClientMiss: noop,
        onClientClick: noop,
    }

    state = {
        url: ''
    }

    componentDidMount() {
        const { type, host } = this.props

        switch (type) {
            case ClientTypes.ANDROID:
                this.setState({
                    url: `${host}/#/mobileClient?client=android`
                });
                break;

            case ClientTypes.IOS:
                this.setState({
                    url: `${host}/#/mobileClient?client=iOS`
                });
                break;
        }
    }

    /**
     * 点击下载客户端事件回调
     */
    async downloadClient(e: MouseEvent) {
        e.stopPropagation();

        const { type } = this.props;

        switch (type) {
            case ClientTypes.IOS:
                this.props.onClientClick('https://itunes.apple.com/cn/app/anyshare/id724109340');
                break;

            case ClientTypes.OFFICE_PLUGIN:
                this.props.onClientClick(getOffice())
                break;

            default:
                try {
                    let { URL } = await download({ osType: type, reqhost: location.hostname, usehttps: useHTTPS() });
                    this.props.onClientClick(URL);
                } catch (e) {
                    this.props.onClientMiss(type)
                }
                break;
        }

    }
}