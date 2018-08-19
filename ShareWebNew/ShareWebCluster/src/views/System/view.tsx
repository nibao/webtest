import * as React from 'react';
import OverView from '../../../console/OverView/component.view';
import { ECMSManagerClient } from '../../../core/thrift2/thrift2'

export default class System extends React.Component<any, any> {

    OIP = ''
    /**
     * 关闭系统事件
     */
    onSystemShutdown() {
        location.assign('/');
    }

    /**
     * 重定向到个人文档
     */
    protected doServerRedirect() {
        this.props.history.push(`${this.props.location.pathname}/server`);
    }

    protected doStorageRedirect() {
        this.props.history.push(`${this.props.location.pathname}/storage`);
    }

    /**
     * 打开监控详情
     */
    async doSystemDetailRedirect() {
        if (!this.OIP) {
            let nodeInfo = await ECMSManagerClient.get_all_node_info()
            this.OIP = nodeInfo.find((value) => {
                if (value.role_ecms === 1) {
                    return value
                }
            }).node_ip
        }
        window.open(`http://${this.OIP}:10049/zabbix/zabbix.php?action=dashboard.view`);
    }

    render() {
        return (
            <OverView
                onSystemShutdown={this.onSystemShutdown.bind(this)}
                doServerRedirect={this.doServerRedirect.bind(this)}
                doStorageRedirect={this.doStorageRedirect.bind(this)}
                doSystemDetailRedirect={this.doSystemDetailRedirect.bind(this)}
            />
        )
    }
}