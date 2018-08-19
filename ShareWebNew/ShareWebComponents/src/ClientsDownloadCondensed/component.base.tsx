import * as React from 'react';
import { noop } from 'lodash';
import { useHTTPS } from '../../util/browser/browser';
import { download } from '../../core/apis/eachttp/update/update';
import { clientName } from '../../core/clients/clients';
import { getOffice, buildClientList, ClientTypes } from '../../core/clients/clients';
import __ from './locale'

export default class ClientsDownloadCondensedBase extends React.Component<Components.ClientsDownloadCondensed.Props, Components.ClientsDownloadCondensed.State>{
    static defaultProps = {
        onClientMiss: noop,
        doClientDownload: noop
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        list: {}
    }

    async componentWillMount() {
        const list = await buildClientList();
        this.setState({
            list
        })
    }

    /**
     * 点击下载客户端事件回调
     */
    async downloadClient(type) {
        const { toast } = this.context;

        switch (type) {
            case ClientTypes.OFFICE_PLUGIN:
                this.props.doClientDownload(getOffice())
                break;
            default:
                try {
                    let { URL } = await download({ osType: type, reqhost: location.hostname, usehttps: useHTTPS() });
                    this.props.doClientDownload(URL);
                } catch (e) {
                    toast(`${clientName(type)} ${__('客户端升级包未上传')}`);
                }
                break;
        }
    }
}
