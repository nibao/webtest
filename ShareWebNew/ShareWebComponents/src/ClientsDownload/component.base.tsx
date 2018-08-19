import * as React from 'react';
import { noop, pairs } from 'lodash';
import { clientName } from '../../core/clients/clients';
import { buildClientList } from '../../core/clients/clients';
import WebComponent from '../webcomponent';
import __ from './locale'

export default class ClientsDownloadBase extends WebComponent<any, any>{
    static defaultProps = {
        onClientsReady: noop, // oem配置获取列表回调函数
        onClientClick: noop // 点击下载客户端回调函数
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
            list: list
        })
        this.props.onClientsReady(pairs(list));
    }

    handleClientMiss(osType) {
        const { toast } = this.context;

        toast(`${clientName(osType)} ${__('客户端升级包未上传')}`);
    }
}
