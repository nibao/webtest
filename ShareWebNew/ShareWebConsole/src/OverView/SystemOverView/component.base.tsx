import * as React from 'react';
import { noop } from 'lodash';
import { formatTime } from '../../../util/formatters/formatters'
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import WebComponent from '../../webcomponent';

export default class SystemOverViewBase extends WebComponent<Console.OverView.Props, Console.OverView.State> {

    static defaultProps = {
        onSystemShutdown: noop,
    }

    state = {
        version: '',
        time: '',
        nodeLength: '',
        status: false,
        closing: false
    }

    componentWillMount() {
        this.getOverView()
    }

    /**
     * 获取系统的信息
     */
    async getOverView() {
        try {
            this.setState({
                version: await ECMSManagerClient.get_cluster_version(),
                time: formatTime(Number(await ECMSManagerClient.get_cluster_time()) * 1000),
                nodeLength: (await ECMSManagerClient.get_all_node_info()).length
            })
        } catch (ex) {

        }

    }

    /**
     * 关闭系统
     */
    protected async shutDownSystem() {
        this.setState({
            status: true
        })
    }

    /**
     * 确认关闭
     */
    protected async confirmShutDown() {
        try {
            this.setState({
                status: false,
                closing: true
            })
            await ECMSManagerClient.shutdown_cluster()

        } catch (ex) {

        }
        this.props.onSystemShutdown();
    }

    /**
     * 取消关闭
     */
    protected async CancelShutDown() {
        this.setState({
            status: false
        })
    }

}